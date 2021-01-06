const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    const reducer = (sum, blog) => sum + blog.likes

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {

    if (blogs.length === 0) return {}

    let i = 0

    const reducer = (most, blog, index) => {
        if (blog.likes > most) {
            i = index
            return blog.likes
        } else {
            return most
        }
    }

    blogs.reduce(reducer, 0)

    const bestBlog = blogs[i]

    return {
        title: bestBlog.title,
        author: bestBlog.author,
        likes: bestBlog.likes
    }
}

const mostBlogs = (blogs) => {

    if (blogs.length === 0) return {}

    const collection = _.countBy(blogs, 'author')
    const array = []

    _.forEach(collection, (value, key) => {
        array.push({
            author: key,
            blogs: value
        })
    })

    const sorted = _.sortBy(array, ['blog'])

    return sorted[sorted.length - 1]
}

const mostLikes = (blogs) => {

    if (blogs.length === 0) return {}

    const collection = _.groupBy(blogs, 'author')
    const array = []

    console.log(collection)

    _.forEach(collection, (value, key) => {

        let likeSum = 0

        for (blog of value) {
            likeSum += blog.likes
        }

        array.push({
            author: key,
            likes: likeSum
        })
    })

    const sorted = _.sortBy(array, ['likes'])

    return sorted[sorted.length - 1]
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }