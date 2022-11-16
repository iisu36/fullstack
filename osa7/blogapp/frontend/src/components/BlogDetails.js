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
          <h2 className='header'>{blog.title}</h2>
          <a href={blog.url} className='blog-url'>{blog.url}</a>
        </div>
        <div className='likes'>
          {blog.likes} likes{' '}
          <button onClick={() => likeBlog(blog.id)} className='create'>like</button>
        </div>
        <p className='added-by'>added by {addedBy}</p>
        {own && <button onClick={() => handleRemove(blog.id)} className='remove-button'>remove blog</button>}
      </div>
      <div>
        <h2 className='comment-header'>comments</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
            id="comment"
            placeholder="comment blog"
          />
          <button id="create-button" type="submit" className='create'>
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
