import { useState, useEffect } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import SetBirthYear from './components/SetBirthYear'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED, ALL_BOOKS, ME } from './queries'

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
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
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

      <LoginForm show={page === 'login'} setPage={setPage} setToken={setToken} />

      <Recommendations show={page === 'recommendations'} />
    </div>
  )
}

export default App
