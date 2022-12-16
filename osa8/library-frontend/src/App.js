import { useState, useEffect } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import SetBirthYear from './components/SetBirthYear'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED, ALL_BOOKS, ME, ALL_AUTHORS } from './queries'

export const updateCache = (cache, query, added) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      const v = seen.has(k) ? false : seen.add(k)
      return v
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(added)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const client = useApolloClient()
  const userResult = useQuery(ME)
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded

      window.alert(
        `New book ${addedBook.title} by ${addedBook.author.name} added!`
      )

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)

      addedBook.genres.forEach((genre) => {
        const data = client.cache.readQuery({
          query: ALL_BOOKS,
          variables: { genre: genre },
        }) ?? { allBooks: [] }
        client.cache.writeQuery({
          query: ALL_BOOKS,
          variables: { genre: genre },
          data: { allBooks: [...data.allBooks, addedBook] },
        })
      })

      client.cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const existingAuthor = allAuthors.find(
          (author) => author.name === addedBook.author.name
        )
        if (existingAuthor) {
          return {
            allAuthors: allAuthors.map((author) =>
              author.name !== existingAuthor.name
                ? author
                : { ...author, books: author.books.concat(addedBook) }
            ),
          }
        } else {
          const newAuthor = { ...addedBook.author, books: [addedBook] }

          return {
            allAuthors: allAuthors.concat(newAuthor),
          }
        }
      })
    },
  })

  useEffect(() => {
    userResult.refetch()
  }, [token]) //eslint-disable-line

  if (userResult.loading) {
    return <div>loading</div>
  }

  const logOut = () => {
    localStorage.clear()
    client.resetStore()
    setToken(null)
    setPage('login')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && (
          <button onClick={() => setPage('set')}>set birth year</button>
        )}
        {token && (
          <button
            onClick={() => {
              setPage('recommendations')
            }}
          >
            recommend
          </button>
        )}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={logOut}>logout</button>}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setPage={setPage} />

      <SetBirthYear show={page === 'set'} setPage={setPage} />

      <LoginForm
        show={page === 'login'}
        setPage={setPage}
        setToken={setToken}
      />

      <Recommendations show={page === 'recommendations'} />
    </div>
  )
}

export default App
