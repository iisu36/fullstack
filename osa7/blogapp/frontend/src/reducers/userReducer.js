import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/user'

const userSlice = createSlice({
  name: 'user',
  initialState: '',
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions

export const setUserFromStorage = () => {
  return async dispatch => {
    const user = await userService.getUser()
    if (user) {
      dispatch(setUser(user))
    } else {
      return
    }
  }
}

export const loginUser = (user) => {
  return async dispatch => {
    await userService.setUser(user)
    dispatch(setUser(user))
  }
}

export const logOutUser = () => {
  return async dispatch => {
    await userService.clearUser()
    dispatch(setUser(null))
  }
}

export default userSlice.reducer
