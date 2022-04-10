import React from 'react'
import CountryInfo from './countryInfo'

const Countries = ({ filter, countries, setFilter }) => {

    if (filter === '') {

        return null

    } else if (countries.length > 10) {

        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    } else if (countries.length === 1) {

        const country = countries[0]

        return <CountryInfo country={country} />

    } else {

        return (
            <div>

                {countries.map(country => {

                    return (
                        <div key={country.name.common}>
                            {country.name.common} <button onClick={() => setFilter(country.name.common)}>show</button>
                        </div>
                    )
                }
                )}

            </div>
        )
    }
}

export default Countries