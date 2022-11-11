import { useEffect, useRef } from 'react'

import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import Users from './components/Users'
import User from './components/User'

import loginService from './services/login'

import { createNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
import {
  setUserFromStorage,
  loginUser,
  logOutUser,
} from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'

import { useDispatch, useSelector } from 'react-redux'

import { Routes, Route, useMatch } from 'react-router-dom'

const Lander = ({ addBlog, user }) => {
  const blogFormRef = useRef()

  const createBlog = (blog) => {
    addBlog(blog)
    blogFormRef.current.toggleVisibility()
  }
  return (
    <>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <NewBlogForm onCreate={createBlog} />
      </Togglable>

      <BlogList user={user} />
    </>
  )
}

const App = () => {
  const blogFormRef = useRef()

  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
    dispatch(setUserFromStorage())
  }, [dispatch])

  const login = async (username, password) => {
    loginService
      .login({
        username,
        password,
      })
      .then((user) => {
        dispatch(loginUser(user))
        notify(`${user.name} logged in!`)
      })
      .catch(() => {
        notify('wrong username/password', 'alert')
      })
  }

  const logout = () => {
    dispatch(logOutUser())
    notify('good bye!')
  }

  const addBlog = async (blog) => {
    const newBlog = { ...blog, user: user.id }
    const request = dispatch(createBlog(newBlog))
    request.then((response) => {
      if (response === undefined) {
        notify(`a new blog '${newBlog.title}' by ${newBlog.author} added`)
      } else {
        notify('creating a blog failed', 'alert')
      }
    })
  }

  const notify = (message, type = 'info') => {
    dispatch(createNotification({ message, type }))
  }

  if (user === null) {
    return (
      <>
        <Notification />
        <LoginForm onLogin={login} />
      </>
    )
  }

  const matchUser = useMatch('users/:id')
  const userMatched = matchUser ? users.find(user => user.id === matchUser.params.id) : null

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>

      <Routes>
        <Route path="/" element={<Lander user={user} addBlog={addBlog} />} blogFormRef={blogFormRef} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User user={userMatched} />} />
      </Routes>
    </div>
  )
}

export default App
