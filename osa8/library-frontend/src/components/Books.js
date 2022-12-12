import { useQuery } from '@apollo/client'
import { useState } from 'react'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genreToShow, setGenreToShow] = useState('')

  const allBooksResult = useQuery(ALL_BOOKS)
  const sortedGenreResult = useQuery(ALL_BOOKS, {
    variables: { genre: genreToShow },
  })

  if (!props.show) {
    return null
  }

  if (allBooksResult.loading || sortedGenreResult.loading) {
    return <div>loading...</div>
  }

  const allBooks = allBooksResult.data.allBooks

  const genres = [
    ...new Set(
      allBooks.reduce((accumulator, currentValue) => {
        return currentValue.genres.includes('null')
          ? accumulator
          : [...accumulator, ...currentValue.genres]
      }, [])
    ),
  ]

  const setGenre = (genre) => {
    setGenreToShow(genre)
    sortedGenreResult.refetch({ genre: genre })
  }

  return (
    <div>
      <h2>books</h2>
      <p>in {genreToShow === '' ? 'all genres' : `genre ${genreToShow}`}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {sortedGenreResult.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => setGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
