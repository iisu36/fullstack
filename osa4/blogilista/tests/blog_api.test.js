const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')
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

    let token = ''

    beforeEach(async () => {

        const user = {
            username: 'root',
            password: 'password'
        }

        const result = await api
            .post('/api/login')
            .send(user)

        token = result.body.token
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            author: "Jester the Tester",
            url: "http://this-is-a-test",
            likes: 123
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: "Without url",
            author: "Jester the Tester",
            likes: 123
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
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
            .set('Authorization', `bearer ${token}`)
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
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()

        const addedBlog = blogsAtEnd.find(blog => blog.title === 'Without likes')

        expect(addedBlog.likes).toBe(0)
    })

    test('a blog is not added when there is no token', async () => {
        const newBlog = {
            title: "No token",
            author: "Jester the Tester",
            url: "http://this-is-a-test",
            likes: 123
        }

        const result = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        expect(result.body.error).toContain('invalid token')
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

    let token = ''
    let id = ''

    beforeEach(async () => {

        const user = {
            username: 'root',
            password: 'password'
        }

        const result = await api
            .post('/api/login')
            .send(user)

        token = result.body.token

        const newBlog = {
            title: "Deleting blog",
            author: "Jester the Tester",
            url: "http://this-is-a-test",
            likes: 123
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)

        id = response.body.id
    })

    test('succeedingly deleted with authorization', async () => {
        const blogsAtStart = await helper.blogsInDb()

        await api
            .delete(`/api/blogs/${id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1)
    })

    test('can not delete without authorization', async () => {
        const blogsAtStart = await helper.blogsInDb()

        await api
            .delete(`/api/blogs/${id}`)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd.length).toBe(blogsAtStart.length)
    })
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash1 = await bcrypt.hash('password', 10)
        const user1 = new User({ username: 'root', passwordHash: passwordHash1 })

        await user1.save()

        const passwordHash2 = await bcrypt.hash('password66', 10)
        const user2 = new User({ username: 'root66', passwordHash: passwordHash2 })

        await user2.save()
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'admin',
            name: 'Admin Nimda',
            password: 'password',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'shortpassword',
            name: 'Short Password',
            password: 'sa',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('Password length must be at least 3 characters')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'sh',
            name: 'Short Username',
            password: 'password',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username`', 'is shorter')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})