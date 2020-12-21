import React, { useState, useEffect } from 'react'
import Filter from './filter'
import PersonForm from './personForm'
import Persons from './persons'

import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/db')
      .then(response => {
        setPersons(response.data.persons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (!persons.some(person => {
      return person.name === newName
    })) {

      const personObject = {
        name: newName,
        number: newNumber
      }

      setPersons(persons.concat(personObject))
    } else {

      alert(`${newName} is already added to phonebook`)
    }

    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>
      
      <PersonForm add={addPerson} handleName={handleNameChange}  handleNumber={handleNumberChange}
                  name={newName} number={newNumber}/>

      <h2>Numbers</h2>
      
      <Persons persons={persons} filter={filter} />

    </div>
  )

}

export default App