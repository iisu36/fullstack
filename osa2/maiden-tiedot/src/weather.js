import React, { useState, useEffect } from 'react'

import axios from 'axios'

const Weather = ({ country }) => {

    const [weather, setWeather] = useState({})

    useEffect(() => {

        const api_key = process.env.REACT_APP_API_KEY

        axios
            .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`)
            .then(response => {
                setWeather(response.data)
            })
    }, [])

    if (weather.current !== undefined) {
        return (
            <div>
                <h3>Weather in {country.capital}</h3>
                <p><b>temperature:</b> {weather.current.temperature} Celcius</p>
                <img src={weather.current.weather_icons[0]} alt={country.capital + ' weather condition'} />
                <p><b>wind:</b> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
            </div>
        )
    } else return null
}

export default Weather