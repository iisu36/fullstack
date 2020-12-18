import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = ({ stats }) => {

  const { good, neutral, bad } = stats

  if (!good && !neutral && !bad) {
    return (
      <>
        <p>No feedbacks given</p>
      </>
    )
  }

  const all = good + neutral + bad || 0

  const average = (good - bad) / all || 0

  const positive = good * 100 / all || 0

  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={all} />
        <StatisticLine text='average' value={average} />
        <StatisticLine text='positive' value={positive} unit='%' />
      </tbody>
    </table>
  )
}

const StatisticLine = ({ value, text, unit }) => {

  return (
    <tr>
      <td>{text}</td>
      <td>{value} {unit}</td>
    </tr>
  )
}

const Button = ({ text, handleClick }) => {

  return (
    <>
      <button onClick={handleClick}>{text}</button>
    </>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const stats = {
    good: good,
    neutral: neutral,
    bad: bad
  }

  const handleGood = () => {
    setGood(good + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>

      <h1>give feedback</h1>

      <Button handleClick={handleGood} text='good' />
      <Button handleClick={handleNeutral} text='neutral' />
      <Button handleClick={handleBad} text='bad' />

      <h1>statistics</h1>

      <Statistics stats={stats} />

    </div>
  )
}

ReactDOM.render(<App />,
  document.getElementById('root')
)