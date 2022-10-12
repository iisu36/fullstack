import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification', 
    initialState: null,
    reducers: {
        createNotification(state, action) {
            return state = action.payload
        }
    }
})

export const { voteNotification, createNotification } = notificationSlice.actions

export const setNotification = (content, seconds = 5, lastTimeOutId) => {
    return dispatch => {
        clearTimeout(lastTimeOutId)
        const timeOutId = setTimeout(() => {
            dispatch(createNotification(null))
        }, seconds*1000)
        dispatch(createNotification({content, timeOutId}))
    }
}

export default notificationSlice.reducer