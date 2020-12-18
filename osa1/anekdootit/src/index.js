import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState([])
  const [most, setMost] = useState(0)

  if (votes.length === 0) {

    console.log('Votes tehty')

    setVotes(new Array(6).fill(0))
  }

  const handleAnecdote = () => {

    setSelected(Math.floor(Math.random() * 6))
  }

  const handleVote = () => {

    const copy = [...votes]

    copy[selected] += 1

    for (let i = 0; i < 6; i++) {
      
      if (copy[i] > copy[most]) {
        setMost(i)
      }
    }

    setVotes(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[selected]}
      <p>has {votes[selected]} votes</p>
      <br />
      <button onClick={handleVote}>vote</button>
      <button onClick={handleAnecdote}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      {props.anecdotes[most]}
      <p>has {votes[most]} votes</p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)