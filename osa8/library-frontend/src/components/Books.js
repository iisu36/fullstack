import { useQuery, useLazyQuery } from '@apollo/client'
import { useState } from 'react'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genreToShow, setGenreToShow] = useState(null)
  const [showAll, setShowAll] = useState(true)

  const allBooksResult = useQuery(ALL_BOOKS)
  const [loadSortedResult, sortedGenreResult] = useLazyQuery(ALL_BOOKS, {
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
    setShowAll(false)
    loadSortedResult()
  }

  return (
    <div>
      <h2>books</h2>
      <p>in {showAll ? 'all genres' : `genre ${genreToShow}`}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {(showAll &&
            allBooksResult.data?.allBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))) ||
            sortedGenreResult.data?.allBooks.map((a) => (
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
        <button onClick={() => setShowAll(true)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
