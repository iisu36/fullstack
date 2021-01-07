const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

describe('tests with initial blogs', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a spesific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const titles = response.body.map(b => b.title)

        expect(titles).toContain('React patterns')
    })

    test('blog has right id attribute', async () => {
        const response = await api.get('/api/blogs')

        const firstBlog = response.body[0]

        expect(firstBlog.id).toBeDefined()
    })
})

describe('getting a single blog with its id', () => {

    test('id testing', async () => {
        const blogs = await helper.blogsInDb()
        const blog = blogs[0]

        const response = await api.get(`/api/blogs/${blog.id}`)

        expect(response.body).toEqual(blog)
    })
})

describe('adding blog', () => {

    test('blog without title is not added', async () => {
        const newBlog = {
            author: "Jester the Tester",
            url: "http://this-is-a-test",
            likes: 123
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: "Valid blog",
            author: "Jester the Tester",
            likes: 123
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: "Valid blog",
            author: "Jester the Tester",
            url: "http://this-is-a-test",
            likes: 123
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)

        expect(titles).toContain('Valid blog')
    })

    test('blog without likes is added with 0 likes', async () => {
        const newBlog = {
            title: "Without likes",
            author: "Jester the Tester",
            url: "http://this-is-a-test"
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        const addedBlog = blogsAtEnd.find(blog => blog.title === 'Without likes')

        expect(addedBlog.likes).toBe(0)
    })
})

describe('updating blog', () => {

    test('succeedingly updated', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            title: "This is updated",
            author: "Jester the Tester",
            url: "http://this-is-a-test",
            likes: 753159
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)

            const response = await api.get(`/api/blogs/${blogToUpdate.id}`)

            expect(response.body.title).toEqual(updatedBlog.title)
            expect(response.body.likes).toBe(753159)
    })
})

describe('deleting blog', () => {

    test('succeedingly deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)

        const titles = blogsAtEnd.map(b => b.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

afterAll(() => {
    mongoose.connection.close()
})