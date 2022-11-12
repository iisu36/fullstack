import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { addVote, deleteBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'

const BlogDetails = ({ blog, user, onComment }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [comment, setComment] = useState('')

  if (!user || !blog) {
    return null
  }
  const own = blog.user && user.username === blog.user.username
  const addedBy = blog.user && blog.user.name ? blog.user.name : 'anonymous'

  const notify = (message, type = 'info') => {
    dispatch(createNotification({ message, type }))
  }

  const likeBlog = async () => {
    dispatch(addVote(blog))
    notify(`you liked '${blog.title}' by ${blog.author}`)
  }

  const remove = async () => {
    const request = dispatch(deleteBlog(blog))
    request.then((response) => {
      if (response !== false) {
        notify(`succesfully deleted '${blog.title}' by ${blog.author}`)
      }
    })
  }

  const handleRemove = (id) => {
    remove(id)
    navigate('/')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onComment(blog, comment)
    setComment('')
  }

  return (
    <>
      <div>
        <div>
          <h1>{blog.title}</h1>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          {blog.likes} likes{' '}
          <button onClick={() => likeBlog(blog.id)}>like</button>
        </div>
        added by {addedBy}
        {own && <button onClick={() => handleRemove(blog.id)}>remove</button>}
      </div>
      <div>
        <h3>comments</h3>
        <form onSubmit={handleSubmit}>
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            id="comment"
            placeholder="comment blog"
          />
          <button id="create-button" type="submit">
            add comment
          </button>
        </form>
      </div>
      <div>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment}>{comment}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default BlogDetails
