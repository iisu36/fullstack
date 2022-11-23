require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')

const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDb')
  })
  .catch((error) => {
    console.log('error connection to MongoDb:', error.message)
  })

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
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
      return books.populate('author', { name: 1, born: 1, bookCount: 1, id: 1 })
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: async (root) => Book.countDocuments({ author: root._id }),
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres,
      })

      await book.save()

      return book.populate('author', { name: 1, born: 1, bookCount: 1, id: 1 })
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      if (!author) return null

      author.born = args.setBornTo
      await author.save()

      return author
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
