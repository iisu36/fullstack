import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    voteBlog(state, action) {
      const id = action.payload.id
      const blogToChange = state.find((blog) => blog.id === id)
      const changedBlog = { ...blogToChange, likes: blogToChange.likes + 1 }
      return state.map((blog) => (blog.id !== id ? blog : changedBlog))
    },
    commentBlog(state, action) {
      const id = action.payload.id
      const blogToChange = state.find((blog) => blog.id === id)
      const changedBlog = { ...blogToChange, comments: action.payload.comments }
      return state.map((blog) => (blog.id !== id ? blog : changedBlog))
    },
    removeBlog(state, action) {
      const id = action.payload.id
      return state.filter((blog) => blog.id !== id)
    },
  },
})

export const {
  setBlogs,
  appendBlog,
  voteBlog,
  removeBlog,
  commentBlog,
  errorBlog,
} = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch(appendBlog(newBlog))
    } catch (error) {
      return error
    }
  }
}

export const addVote = (blog) => {
  const blogToUpdate = { ...blog, likes: blog.likes + 1, user: blog.user.id }
  return async (dispatch) => {
    await blogService.update(blog.id, blogToUpdate)
    dispatch(voteBlog(blog))
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    const ok = window.confirm(`remove '${blog.title}' by ${blog.author}?`)

    if (!ok) {
      return false
    }

    await blogService.remove(blog.id)
    dispatch(removeBlog(blog))
  }
}

export const addComment = (blog) => {
  return async (dispatch) => {
    await blogService.comment(blog.id, blog)
    dispatch(commentBlog(blog))
  }
}

export default blogSlice.reducer
