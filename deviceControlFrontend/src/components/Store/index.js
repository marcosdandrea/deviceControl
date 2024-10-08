import { configureStore } from "@reduxjs/toolkit";
import systemReducer from "./system.slice"

export const store = configureStore({

    reducer: {
        system: systemReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat()

        
})

window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
