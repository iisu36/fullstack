import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {

  test('form is calling callback-function with correct parameters', async () => {

    const user = userEvent.setup()

    const createBlog = jest.fn()

    const blogUser = {
      username: 'tester',
      user: 'Tester Jester'
    }

    render(<BlogForm createBlog={createBlog} user={blogUser} />)

    const title = screen.getByPlaceholderText('title')
    const author = screen.getByPlaceholderText('author')
    const url = screen.getByPlaceholderText('url')
    const button = screen.getByText('create')

    await user.type(title, 'testing title')
    await user.type(author, 'author tester')
    await user.type(url, 'url.test.fi')
    await user.click(button)

    const blogCreated = {
      title: 'testing title',
      author: 'author tester',
      url: 'url.test.fi',
      likes: 0,
      user: { username: 'tester', user: 'Tester Jester' }
    }

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(blogCreated)
  })
})

