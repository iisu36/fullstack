import React from 'react'

const Persons = ({ persons, filter }) => {

    return (

        persons.map(person => {

            if (filter === '' || person.name.toLowerCase().includes(filter.toLowerCase())) {

                return <p key={person.name} >{person.name} {person.number}</p>
            }

            return null
        })
    )
}

export default Persons