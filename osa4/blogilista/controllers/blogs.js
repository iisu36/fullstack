const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.json(blog.toJSON())
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    
    const body = request.body
    
    const user = request.user
    
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: user.id
    }

    const savedBlog = await Blog.create(blog)
    await savedBlog.populate('user', { username: 1, name: 1 })
    
    user.blogs = user.blogs.concat(savedBlog.id)
    
    const userToUpdate = {
        username: user.username,
        user: user.user,
        passwordHash: user.passwordHash,
        blogs: user.blogs
    }
    
    const userUpdated = await User.findByIdAndUpdate(user.id, userToUpdate, { new: true, runValidators: true, context: 'query' })
                        .populate('blogs', { title: 1, author: 1, likes: 1 })
    
    response.status(201).json(savedBlog.toJSON())
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: user
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
                        .populate('user', { username: 1, name: 1 })
    
    const userToUpdate = {
        username: user.username,
        user: user.user,
        passwordHash: user.passwordHash,
        blogs: user.blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)
    }
    
    const userUpdated = await User.findByIdAndUpdate(user.id, userToUpdate, { new: true, runValidators: true, context: 'query' })
                        .populate('blogs', { title: 1, author: 1, likes: 1 })

    response.json(updatedBlog.toJSON())
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)

        response.status(204).end()
    } else {
        response.status(401).json({ error: 'Unauthorized to delete this blog' })
    }
})

module.exports = blogsRouter