import { createSlice } from "@reduxjs/toolkit";

const initialState = 
    {
        SERVER_URL: "http://localhost",
        SERVER_PORT: 3030,
        localIP: "0.0.0.0",
        socketConnected: false,
        routines: []
    }

const systemSlice = createSlice({
    name: "system",
    initialState,
    reducers: {
        setSocketConnected: (state, action) => {
            state.socketConnected = action.payload
        },
        setRoutines: (state, action) => {
            state.routines = action.payload
        },
        setRoutine: (state, action) => {
            const index = state.routines.findIndex(routine => routine._id === action.payload._id)
            if (index !== -1) {
                state.routines[index] = action.payload
            }else{
                state.routines.push(action.payload)
            }
        },
        setLocalIP: (state, action) => {
            state.localIP = action.payload
        }
        
    }
})

export const {
    setSocketConnected,
    setRoutines,
    setRoutine,
    setLocalIP
} = systemSlice.actions

export default systemSlice.reducer