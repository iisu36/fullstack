import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification', 
    initialState: null,
    reducers: {
        voteNotification(state, action) {
            if (action.payload === null) return state = null
            return state = `you voted '${action.payload}'`
        },
        createNotification(state, action) {
            if (action.payload === null) return state = null
            return state = `you created ${action.payload}`
        }
    }
})

export const { voteNotification, createNotification } = notificationSlice.actions
export default notificationSlice.reducer