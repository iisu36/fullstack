import React from 'react'

const PersonForm = (props) => {

    return (
        <form>
            <div>
                name: <input value={props.name} onChange={props.handleName} />
            </div>
            <div>
                number: <input value={props.number} onChange={props.handleNumber} />
            </div>
            <div>
                <button type="submit" onClick={props.add} >add</button>
            </div>
        </form>
    )
}

export default PersonForm