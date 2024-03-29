import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const NewBook = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    update(cache, editAuthor) {
      const editedAuthor = editAuthor.data.editAuthor
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.map((author) =>
            author.name !== editedAuthor.name ? author : editedAuthor
          ),
        }
      })
    },
  })

  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const submit = async (event) => {
    event.preventDefault()

    editAuthor({ variables: { name, born } })
    setBorn('')
    props.setPage('authors')
  }

  if (name === '') {
    setName(result.data.allAuthors[0].name)
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {result.data.allAuthors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">set birth year</button>
      </form>
    </div>
  )
}

export default NewBook
