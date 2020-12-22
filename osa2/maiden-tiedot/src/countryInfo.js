import React from 'react'
import Weather from './weather'

const CountryInfo = ({ country }) => {

    return (
        <div>

            <h1>{country.name}</h1>
            <p>capital {country.capital}</p>
            <p>population {country.population}</p>
            <h3>languages</h3>

            <ul>
                {country.languages.map(language => {
                    return <li key={language.name}>{language.name}</li>
                })}
            </ul>

            <img src={country.flag} alt={country.name + ' flag'} height='20%' width='20%' />

            <Weather country={country} />

        </div>
    )
}

export default CountryInfo