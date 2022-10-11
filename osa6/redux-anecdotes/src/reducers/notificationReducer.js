import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification', 
    initialState: null,
    reducers: {
        createNotification(state, action) {
            if (action.payload === null) return state = null
            return state = action.payload
        }
    }
})

export const { voteNotification, createNotification } = notificationSlice.actions

export const setNotification = (content, seconds = 5) => {
    return dispatch => {
        dispatch(createNotification(content))
        setTimeout(() => {
            dispatch(createNotification(null))
        }, seconds*1000);
    }
}

export default notificationSlice.reducer