import React, { FC, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { About } from "../ControlPages/About/About";
import { Terms } from "../ControlPages/Terms/Terms";
import { ControlPage } from "../ControlPages/ControlPage";
import { Privacy } from "../ControlPages/Privacy/Privacy";
import { Contact } from "../ControlPages/Contact/Contact";
import { styled } from "@mui/system";
import { Login } from "../Auth/Login/Login";
import { Register } from "../Auth/Register/Register";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/userSlice";
import { Home } from "../Home/Home";
import { Game } from "../Game/Game";
import { GameContainer } from "../Game/GameContainer";

// const Wrapper = styled(Box)`
//   text-align: center;
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   flex-grow: 1;
//   margin-bottom: 60px;
// `;

const Wrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "hasMarginBottom",
})<{ hasMarginBottom?: boolean }>(({ theme, hasMarginBottom }) => ({
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  flexGrow: 1,
  ...(hasMarginBottom && {
    marginBottom: 60,
  }),
}));

const Nav: FC<Props> = function ({
  signInWithGoogle,
  signInWithFacebook,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  loading,
  error,
}) {
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  return (
    <Wrapper hasMarginBottom={!!user}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Login
              signInWithGoogle={signInWithGoogle}
              signInWithFacebook={signInWithFacebook}
              signUp={() => navigate("/register")}
              error={error}
              onSubmit={signInWithEmailAndPassword}
              loading={loading}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              onSubmit={createUserWithEmailAndPassword}
              login={() => navigate("/login")}
            />
          }
        />
        <Route
          path="/about"
          element={
            <ControlPage>
              <About />
            </ControlPage>
          }
        />
        <Route
          path="/terms"
          element={
            <ControlPage>
              <Terms />
            </ControlPage>
          }
        />
        <Route
          path="/privacy"
          element={
            <ControlPage>
              <Privacy />
            </ControlPage>
          }
        />
        <Route
          path="/contact"
          element={
            <ControlPage>
              <Contact />
            </ControlPage>
          }
        />
        <Route
          path="/admin"
          element={
            <ControlPage>
              <Contact />
            </ControlPage>
          }
        />
        <Route element={<RequireAuth />}>
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/play" element={<GameContainer />} />
          <Route path="/play/:gameId" element={<GameContainer />} />
        </Route>
      </Routes>
    </Wrapper>
  );
};

export default Nav;

interface Props {
  signInWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>;
  createUserWithEmailAndPassword?: (
    email: string,
    password: string
  ) => Promise<any>;
  signInWithGoogle?: () => void;
  signInWithFacebook?: () => void;
  signOut?: () => void;
  error?: string;
  loading?: boolean;
}

function RequireAuth() {
  const user = useSelector(userSelector);

  let location = useLocation();

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} />;
  }

  return <Outlet />;
}