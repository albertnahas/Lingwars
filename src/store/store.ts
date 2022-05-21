import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import alertReducer from "./alertSlice"
import drawerReducer from "./drawerSlice"
import snackbarReducer from "./snackbarSlice"
import feedbackReducer from "./feedbackSlice"
import challengeReducer from "./challengeSlice"

export default configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
    drawer: drawerReducer,
    snackbar: snackbarReducer,
    feedback: feedbackReducer,
    challenge: challengeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
