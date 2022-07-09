import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ logIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const userToLogin = {
      username, password
    }
    logIn(userToLogin)

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>
  )
}

LoginForm.propTypes = {
  logIn: PropTypes.func.isRequired
}

export default LoginForm