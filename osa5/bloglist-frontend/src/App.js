import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogsState] = useState([])
  const [message, setMessage] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    }
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const setBlogs = (blogArray) => {
    const copy = blogArray.map(blog => blog)
    setBlogsState(copy.sort((a, b) => b.likes - a.likes))
  }

  const handleLogin = async (userToLogin) => {
    try {
      const user = await loginService.login(userToLogin)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setMessage({
        text: 'wrong credentials',
        color: 'error'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogToAdd) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogToAdd)

      setMessage({
        text: `a new blog ${response.title} by ${response.author} added`,
        color: 'success'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)

      setBlogs(blogs.concat(response))

    } catch (exception) {
      setMessage({
        text: exception.toString(),
        color: 'error'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (blog) => {

    const blogToUpdate = {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    try {
      const response = await blogService.update(blog.id, blogToUpdate)

      setMessage({
        text: `liked blog ${response.title} by ${response.author}`,
        color: 'success'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)

      setBlogs(blogs.map(b => b.id !== response.id ? b : response))
    } catch (exception) {
      setMessage({
        text: exception.toString(),
        color: 'error'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const removeBLog = async (blogToDelete) => {
    if (window.confirm(`delete blog ${blogToDelete.title} by ${blogToDelete.author} ?`)) {
      try {
        await blogService.remove(blogToDelete.id)

        setMessage({
          text: `deleted blog ${blogToDelete.title} by ${blogToDelete.author}`,
          color: 'success'
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)

        setBlogs(blogs.filter(b => b.id !== blogToDelete.id))
      } catch (exception) {
        setMessage({
          text: exception.toString(),
          color: 'error'
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />

      {user === null ?
        <Togglable buttonLabel='login'>
          <LoginForm
            logIn={handleLogin}
          />
        </Togglable> :
        <div>
          <p>{user.name} logged in
            <button onClick={handleLogout}>Logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
              createBlog={addBlog}
              user={user}
            />
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              removeBLog={removeBLog}
              user={user} />
          )}
        </div>
      }
    </div>
  )
}

export default App