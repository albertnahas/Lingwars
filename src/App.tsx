/* eslint-disable no-debugger */
import { useEffect, useState } from "react";
import "./App.css";
import withFirebaseAuth from "react-with-firebase-auth";
import { useDispatch, useSelector } from "react-redux";
import firebase, { getToken, onMessageListener } from "./config";
import { TopBar } from "./components/TopBar/TopBar";
import { User } from "./types/user";
import { State } from "./types/state";
import { SplashScreen } from "./molecules/SplashScreen/SplashScreen";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { setServerUser } from "./store/userSlice";
import Nav from "./components/Nav/Nav";
import { usePwa } from "./hooks/usePwa";
import { Alert, Box, Snackbar } from "@mui/material";
import { AlertDialog } from "./molecules/AlertDialog/AlertDialog";
import { setSnackbar, snackbarSelector } from "./store/snackbarSlice";
import { alertSelector, setAlertOpen } from "./store/alertSlice";
import { SideDrawer } from "./components/SideDrawer/SideDrawer";

const firebaseAppAuth = firebase.auth();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/user.birthday.read");

const facebookProvider = new firebase.auth.FacebookAuthProvider();

const providers = {
  googleProvider,
  facebookProvider,
};

const createComponentWithAuth = withFirebaseAuth({
  providers,
  firebaseAppAuth,
});

const App = function ({
  /** These props are provided by withFirebaseAuth HOC */
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  // signInWithGithub,
  // signInWithTwitter,
  // signInAnonymously,
  signOut,
  // setError,
  user,
  error,
  loading,
}: Props) {
  const currentUser = useSelector((state: State) => state.user.value);
  const snackbar = useSelector(snackbarSelector);

  const { signOutUser } = useCurrentUser();
  const { handleInstallClick, deferredPrompt } = usePwa();
  const dispatch = useDispatch();

  const [notification, setNotification] = useState({ title: "", body: "" });
  const alertWidget = useSelector(alertSelector);

  const signInWithGoogle = () => {
    firebase.auth().signInWithRedirect(googleProvider);
  };

  const signInWithFacebook = () => {
    firebase.auth().signInWithRedirect(facebookProvider);
  };

  const initNotificationListener = () => {
    onMessageListener()
      .then((payload: any) => {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        });
      })
      .catch((err) => console.log("failed: ", err));
  };

  useEffect(() => {
    async function initUser() {
      try {
        if (user && user.uid) {
          const messagingToken = await getToken();
          if (messagingToken) {
            user.messagingToken = messagingToken;
          }
          dispatch(setServerUser(user));
          initNotificationListener();
        } else if (user === null) {
          signOutUser();
        }
      } catch (error) {
        alert(error);
      }
    }
    initUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const signOutFromApp = () => {
    signOut?.();
    signOutUser();
  };

  const handleSnackbarClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setSnackbar({ open: false, message: "" }));
  };

  return currentUser === undefined ? (
    <SplashScreen />
  ) : (
    <Box sx={{ bgcolor: "background.paper" }}>
      <TopBar
        handleInstallClick={handleInstallClick}
        signOut={signOutFromApp}
        deferredPrompt={deferredPrompt}
        notification={notification}
        setNotification={setNotification}
      />
      <Nav
        createUserWithEmailAndPassword={createUserWithEmailAndPassword}
        error={error}
        loading={loading}
        signInWithEmailAndPassword={signInWithEmailAndPassword}
        signInWithGoogle={signInWithGoogle}
        signInWithFacebook={signInWithFacebook}
        signOut={signOutFromApp}
      />
      <SideDrawer signOut={signOutFromApp} />
      <AlertDialog
        title={alertWidget.title}
        message={alertWidget.message}
        open={alertWidget.open || false}
        setOpen={(open: boolean) => dispatch(setAlertOpen(open))}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbar.type} sx={{ bottom: "72px" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

interface Props {
  signInWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>;
  createUserWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>;
  signInWithGoogle?: () => Promise<any>;
  signInWithFacebook?: () => Promise<any>;
  // signInWithGithub: PropTypes.object,
  // signInWithTwitter: PropTypes.object,
  // signInAnonymously: PropTypes.object,
  signOut?: () => Promise<any>;
  // setError: PropTypes.object,
  user?: User;
  error?: string;
  loading?: boolean;
}

export default createComponentWithAuth(App);
