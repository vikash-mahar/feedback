import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import feedbacksSlice from "./feedbacksSlice"
import authSlice from "./authSlice";

const store = configureStore ({
    reducer: {
        auth: authSlice,
        user: userSlice,
        tweets: feedbacksSlice,
    }
})

export default store