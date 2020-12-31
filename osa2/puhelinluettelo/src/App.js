import React, { useState, useEffect } from 'react'
import Filter from './components/filter'
import PersonForm from './components/personForm'
import Persons from './components/persons'
import Notification from './components/notification'
import phoneService from './services/phonebook'
import phonebook from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState({ text: null, error: false })


  useEffect(() => {
    phoneService
      .getAll()
      .then(data => {
        setPersons(data)
      })
      .catch(e => {
        setMessage({ text: e, error: true })
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

    const personObject = {
      name: newName,
      number: newNumber
    }

    let id = 0

    if (!persons.some(person => {

      id = person.id

      return person.name === newName
    })) {

      phoneService
        .create(personObject)
        .then(data => {
          setPersons(persons.concat(data))
          setMessage({ text: `Added ${newName}`, error: false })
          setTimeout(() => {
            setMessage({ ...message, text: null })
          }, 1000)
        })
        .catch(e => {
          setMessage({ text: e, error: true })
        })

    } else {

      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {

        replace(personObject, id)
      }
    }

    setNewName('')
    setNewNumber('')
  }

  const replace = (personObject, id) => {

    phoneService.replace(id, personObject)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        setMessage({ text: `Replaced ${returnedPerson.name}`, error: false })
        setTimeout(() => {
          setMessage({ ...message, text: null })
        }, 1000)
      })
      .catch(e => {
        setPersons(persons.filter(person => person.id !== id))
        setMessage({ text: `Information about ${personObject.name} has already been removed from server`, error: true })
      })
  }

  const remove = (id) => {
    phonebook.remove(id)
      .then(() => {
        setMessage({ text: "Deleted", error: false })
        setTimeout(() => {
          setMessage({ ...message, text: null })
        }, 1000)
      })
      .catch(e => {
        setMessage({ text: e, error: true })
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm add={addPerson} handleName={handleNameChange} handleNumber={handleNumberChange}
        name={newName} number={newNumber} />

      <h2>Numbers</h2>

      <Persons persons={persons} filter={filter} remove={remove} setPersons={setPersons} />

    </div>
  )

}

export default App