import React from 'react'
import ReactDOM from 'react-dom'

const Header = ({course}) => {

  console.log('Header')
  console.log(course)

  return (
    <div>
      <h1>{course}</h1>
    </div>
  )
}

const Content = ({parts}) => {

  console.log('Content')
  console.log(parts)

  return (
    <div>
      {parts.map(part => 
        <Part part={part} key={part.id} />  
      )}
    </div>
  )
}

const Part = ({part}) => {

  console.log('Part')
  console.log(part)

  return (
    <>
      <p>{part.name} {part.exercises}</p>
    </>
  )
}

const Total = ({parts}) => {

  console.log('Total')
  console.log(parts)

  const total = parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <p style={{fontWeight: 'bolder'}} >
        total of {total} exercises
      </p>
    </div>
  )
}

const Course = ({course}) => {

  return (
    <div>
      <Header course={course.name} />

      <Content parts={course.parts} />

      <Total parts={course.parts} />

    </div>
  )

}

const App = () => {

  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  

  return (
    <div>
      
      {courses.map(course => 
        <Course course={course} key={course.id} />  
      )}

    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))