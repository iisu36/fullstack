import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Recommendations = (props) => {
  const genreToShow = props.genreToShow
  const sortedGenreResult = useQuery(ALL_BOOKS, {
    variables: { genre: genreToShow === undefined ? 'undefined' : genreToShow },
  })

  if (!props.show) {
    return null
  }

  if (sortedGenreResult.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{genreToShow}</b></p>
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
