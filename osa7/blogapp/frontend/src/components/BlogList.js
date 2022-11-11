import Blog from './Blog'

const BlogList = ({ blogs }) => {

  if (!blogs) {
    return null
  }

  return (
    <div id="blogs">
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  )
}

export default BlogList
