import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog, user }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
      likes: 0,
      user: user
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='title'
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='author'
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='url'
          />
        </div>
        <button id="create-blog-button" type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default BlogForm