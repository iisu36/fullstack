import { useQuery } from '@apollo/client'

import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => {
  const userResult = useQuery(ME)
  const sortedGenreResult = useQuery(ALL_BOOKS, {
    variables: { genre: userResult.data.me?.favoriteGenre },
  })

  if (!props.show) {
    return null
  }

  if (userResult.loading || sortedGenreResult.loading) {
    return <div>loading...</div>
  }

  const favoriteGenre = userResult.data.me?.favoriteGenre

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{favoriteGenre}</b></p>
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
    </div>
  )
}

export default Recommendations
