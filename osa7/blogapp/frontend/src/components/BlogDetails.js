import { useDispatch } from 'react-redux'
import { addVote, deleteBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router-dom'

const BlogDetails = ({ blog, user }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

  return (
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
  )
}

export default BlogDetails
