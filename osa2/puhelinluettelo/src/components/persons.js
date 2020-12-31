import React from 'react'

const Persons = ({ persons, filter, remove, setPersons }) => {

    const removePerson = (id) => {
        remove(id)
        setPersons(persons.filter(person => person.id !== id ? person : null))
    }

    return (

        persons.map(person => {

            if (filter === '' || person.name.toLowerCase().includes(filter.toLowerCase())) {

                return (
                    <div key={`${person.name}row`}>
                        <p key={person.name} >{person.name} {person.number}</p>
                        <button key={`${person.name}button`} onClick={() => {
                            if (window.confirm(`Delete ${person.name}?`)) {
                                removePerson(person.id)
                            }
                        }}>Delete</button>
                    </div>
                )
            }

            return null
        })
    )
}

export default Persons