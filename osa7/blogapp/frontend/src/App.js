import { useEffect, useRef } from 'react'

import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import loginService from './services/login'

import { createNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
import { setUserFromStorage, loginUser, logOutUser } from './reducers/userReducer'

import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'

const App = () => {
  const blogFormRef = useRef()

  const user = useSelector((state) => state.user)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
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
    request.then(response => {
      if (response === undefined) {
        notify(`a new blog '${newBlog.title}' by ${newBlog.author} added`)
      }
      else {
        notify('creating a blog failed', 'alert')
      }
    })
    blogFormRef.current.toggleVisibility()
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

  return (
    <div>
      <h2>blogs</h2>

      <Notification />

      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>

      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <NewBlogForm onCreate={addBlog} />
      </Togglable>

      <BlogList user={user} />
    </div>
  )
}

export default App
