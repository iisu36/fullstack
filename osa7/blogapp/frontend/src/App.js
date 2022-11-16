import { useEffect, useRef } from 'react'

import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import Users from './components/Users'
import User from './components/User'
import BlogDetails from './components/BlogDetails'

import loginService from './services/login'

import { createNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, addComment } from './reducers/blogReducer'
import {
  setUserFromStorage,
  loginUser,
  logOutUser,
} from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'

import { useDispatch, useSelector } from 'react-redux'

import { Routes, Route, useMatch, useNavigate, Link } from 'react-router-dom'

const Lander = ({ addBlog, user, blogs }) => {
  const blogFormRef = useRef()

  const createBlog = (blog) => {
    addBlog(blog)
    blogFormRef.current.toggleVisibility()
  }
  return (
    <>
      <h2 className='header'>Blogs</h2>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <NewBlogForm onCreate={createBlog} />
      </Togglable>

      <BlogList user={user} blogs={blogs} />
    </>
  )
}

const App = () => {
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => {
    const sorted = [...state.blogs].sort((a, b) => (b.likes > a.likes ? 1 : -1))
    return sorted
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    dispatch(setUserFromStorage())
  }, [dispatch])

  const matchUser = useMatch('users/:id')
  const userMatched = matchUser
    ? users.find((user) => user.id === matchUser.params.id)
    : null

  const matchBlog = useMatch('blogs/:id')
  const blogMatched = matchBlog
    ? blogs.find((blog) => blog.id === matchBlog.params.id)
    : null

  const navigate = useNavigate()

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
    navigate('/')
  }

  const logout = () => {
    dispatch(logOutUser())
    notify('good bye!')
    navigate('/')
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

  const commentBlog = async (blog, comment) => {
    const newBlog = {
      ...blog,
      comments: blog.comments.concat(comment),
      user: user.id,
    }
    const request = dispatch(addComment(newBlog))
    request.then(() => {
      notify(`commented on blog ${newBlog.title}`)
    })
  }

  const notify = (message, type = 'info') => {
    dispatch(createNotification({ message, type }))
  }

  if (!user) {
    return (
      <div>
        <Notification />
        <LoginForm onLogin={login} />
      </div>
    )
  }

  return (
    <div>
      <nav className="nav">
        <Link to="/" className="navlink">
          blogs
        </Link>
        <Link to="/users" className="navlink">
          users
        </Link>
        <p className="user">{user.name}</p>
        <p>logged in</p>
        <button onClick={logout}>log out</button>
      </nav>

      <Notification />

      <Routes>
        <Route
          path="/"
          element={<Lander user={user} addBlog={addBlog} blogs={blogs} />}
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User user={userMatched} />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogDetails
              user={user}
              blog={blogMatched}
              onComment={commentBlog}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
