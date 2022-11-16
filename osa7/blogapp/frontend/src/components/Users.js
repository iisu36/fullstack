import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Users = () => {

  const users = useSelector(state => state.users)

  if (!users) {
    return null
  }

  return (
    <div>
      <h2 className='header'>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id + user.name}>
              <td>
                <Link to={`/users/${user.id}`} className='user-block'>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
