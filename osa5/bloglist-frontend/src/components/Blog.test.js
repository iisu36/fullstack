import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog
  let user
  let mockRemove
  let mockUpdate
  let container

  beforeEach(() => {
    blog = {
      title: 'Test blog',
      author: 'Test Author',
      url: 'test.fi',
      likes: 0,
      user: {
        username: 'tester',
        user: 'Tester Jester'
      }
    }

    user = {
      username: 'tester',
      user: 'Tester Jester'
    }

    mockRemove = jest.fn()

    mockUpdate = jest.fn()

    container = render(
      <Blog blog={blog} updateBlog={mockUpdate} user={user} removeBLog={mockRemove}/>
    ).container
  })

  test('at start the information is limited', () => {
    const element = screen.getByText('Test blog Test Author')
    expect(element).toBeDefined()

    const noUrl = screen.queryByText('test.fi')
    expect(noUrl).toBeNull()

    const noLikes = screen.queryByText('likes 0')
    expect(noLikes).toBeNull()
  })

  test('after clicking the button, all information is displayed', async () => {

    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    const element = screen.getByText('Test blog Test Author')
    expect(element).toBeDefined()

    const noUrl = screen.getByText('test.fi')
    expect(noUrl).not.toBeNull()

    const noLikes = screen.getByText('likes 0')
    expect(noLikes).not.toBeNull()
  })

  test('after clicking like button twice, the eventhandler-function is called twice', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = container.querySelector('.likeButton')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdate.mock.calls).toHaveLength(2)
  })
})

