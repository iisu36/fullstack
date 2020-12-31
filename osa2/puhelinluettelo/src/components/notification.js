import React from 'react'

const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
}

const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
}

const Notification = ({ message }) => {

    if (message.text === null) {
        return null
    }

    if (message.error) {
        return (
            <div style={errorStyle} >
                {message.text}
            </div>
        )
    } else {
        return (
            <div style={successStyle} >
                {message.text}
            </div>
        )
    }
}

export default Notification