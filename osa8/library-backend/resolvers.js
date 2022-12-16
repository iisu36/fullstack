require('dotenv').config()
const { UserInputError, AuthenticationError } = require('apollo-server')

const { PubSub } = require('graphql-subscriptions')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const jwt = require('jsonwebtoken')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let books
      if (!args.author && !args.genre) {
        books = Book.find({})
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        if (args.genre) {
          books = Book.find({
            author: author._id,
            genres: { $in: [args.genre] },
          })
        } else {
          books = Book.find({ author: author._id })
        }
      } else if (args.genre) {
        books = Book.find({ genres: { $in: [args.genre] } })
      }
      return books.populate('author', { name: 1, born: 1, id: 1 })
    },
    allAuthors: async () => {
      const authors = await Author.find({}).populate('books', {
        title: 1,
        id: 1,
      })
      return authors
    },
    me: (root, args, context) => context.currentUser,
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated')
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author, books: [] })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres,
      })

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      author.books = author.books.concat(book._id)
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      const bookToReturn = book.populate('author', {
        name: 1,
        born: 1,
        books: 1,
        id: 1,
      })

      pubsub.publish('BOOK_ADDED', { bookAdded: bookToReturn })

      return bookToReturn
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError('Not authenticated')
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) return null

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return author.populate('books', {
        title: 1,
        id: 1,
      })
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
