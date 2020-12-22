import React, { useState, useEffect } from 'react'
import Countries from './countries'

import axios from 'axios'

const App = () => {

  const [data, setData] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setData(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>

      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>

      <Countries filter={filter} setFilter={setFilter} countries={data.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))} />

    </div>
  )
}

export default App;
