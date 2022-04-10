
const Header = ({course}) => {

  return (
    <div>
      <h1>{course}</h1>
    </div>
  )
}

const Content = ({parts}) => {

  return (
    <div>
      {parts.map(part => 
        <Part part={part} key={part.id} />  
      )}
    </div>
  )
}

const Part = ({part}) => {

  return (
    <>
      <p>{part.name} {part.exercises}</p>
    </>
  )
}

const Total = ({parts}) => {

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