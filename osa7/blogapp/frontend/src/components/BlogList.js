import Blog from './Blog'

import { useSelector, useDispatch } from 'react-redux'
import { addVote, deleteBlog } from '../reducers/blogReducer'
import { createNotification } from '../reducers/notificationReducer'

const BlogList = (props) => {
  const blogs = useSelector((state) => {
    const sorted = [...state.blogs].sort((a, b) => b.likes > a.likes ? 1 : -1)
    return sorted
  })
  const dispatch = useDispatch()

  const notify = (message, type = 'info') => {
    dispatch(createNotification({ message, type }))
  }

  const findBlog = id => {
    return blogs.find(blog => blog.id === id)
  }

  const vote = async (id) => {
    const blog = findBlog(id)
    dispatch(addVote(blog))
    notify(`you liked '${blog.title}' by ${blog.author}`)
  }

  const remove = async (id) => {
    const blog = findBlog(id)
    const request = dispatch(deleteBlog(blog))
    request.then(response => {
      if (response !== false) { notify(`succesfully deleted '${blog.title}' by ${blog.author}`) }
    })
  }

  return (
    <div id="blogs">
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={vote}
          removeBlog={remove}
          user={props.user}
        />
      ))}
    </div>
  )
}

export default BlogList
