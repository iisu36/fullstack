import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => {
      console.log(blogs)
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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong credentials')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const hangdleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
            <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
            <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      const blogToAdd = {
        title: title,
        author: author,
        url: url,
        likes: 0,
        user: user
      }

      const response = await blogService.create(blogToAdd)

      setMessage(`a new blog ${response.title} by ${response.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)

      setBlogs(blogs.concat(response))
      setTitle('')
      setAuthor('')
      setUrl('')

    } catch (exception) {
      setMessage(exception.toString())
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleBlogChange = () => {

  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      title:
      <div>
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      author:
      <div>
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      url:
      <div>
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit" onClick={addBlog}>create</button>
    </form>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          <button onClick={hangdleLogout}>Logout</button>
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App