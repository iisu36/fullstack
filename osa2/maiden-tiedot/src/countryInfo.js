import React from 'react'
import Weather from './weather'

const CountryInfo = ({ country }) => {

    return (
        <div>

            <h1>{country.name.common}</h1>
            <p>capital {country.capital[0]}</p>
            <p>population {country.population}</p>
            <h3>languages</h3>

            <ul>
                {Object.values(country.languages).map(language => {
                    return <li key={language}>{language}</li>
                })}
            </ul>

            <img src={country.flags.png} alt={country.name.common + ' flag'} height='20%' width='20%' />

            <Weather country={country} />

        </div>
    )
}

export default CountryInfo