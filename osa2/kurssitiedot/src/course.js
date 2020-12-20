import React from 'react'

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
        <Part part={part} />  
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

export default Course