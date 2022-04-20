import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBLog, user }) => {

  const [view, setView] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}<button onClick={() => setView(!view)}>{view === false ? 'view' : 'hide'}</button>
      {view === false ? '' :
        <>
          <p>{blog.url}</p>
          <p>likes {blog.likes}<button onClick={() => updateBlog(blog)}>like</button></p>
          <p>{blog.user.name}</p>
          {user.username !== blog.user.username ? '' :
            <button onClick={() => removeBLog(blog)}>remove</button>}
        </>
      }

    </div>
  )
}

export default Blog
