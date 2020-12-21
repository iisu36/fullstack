import React, { useState, useEffect } from 'react'

import axios from 'axios'

const App = () => {

  const [data, setData] = useState([])
  const [filter, setFilter] = useState('')
  let countries

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setData(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    listCountries()
  }

  const listCountries = () => {

    countries = data.filter((country) => country.name.toLowerCase().includes(filter.toLowerCase()))

    console.log(countries)
  }

  return (
    <div>

      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>

      <div>
      </div>

    </div>
  )
}

export default App;
