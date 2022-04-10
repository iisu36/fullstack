import Course from './Course'

const App = ({ courses }) => {

    return (
        <div>

            {courses.map(course =>
                <Course course={course} key={course.id} />
            )}

        </div>
    )
}

export default App