import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import SetBirthYear from './components/SetBirthYear'
import Recommendations from './components/Recommendations'
import { ME } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [favoriteGenre, setFavoriteGenre] = useState('undefined')
  const client = useApolloClient()
  const token = localStorage.getItem('library-user-token')

  const getUserInfo = async () => {
    const response = await client.query({
      query: ME
    })
    setFavoriteGenre(response.data.me.favoriteGenre)
  }

  const logOut = () => {
    localStorage.clear()
    client.resetStore()
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
          <button onClick={() => {
            getUserInfo()
            setPage('recommendations')
          }}>recommend</button>
        )}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={logOut}>logout</button>}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <SetBirthYear show={page === 'set'} />

      <LoginForm
        show={page === 'login'}
        setPage={setPage}
      />

      <Recommendations
        show={page === 'recommendations'}
        genreToShow={favoriteGenre}
      />
    </div>
  )
}

export default App
