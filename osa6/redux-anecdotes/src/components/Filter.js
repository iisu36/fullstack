import { connect } from "react-redux"
import { filterAnecdotes } from "../reducers/filterReducer"

const Filter = (props) => {
    const handleChange = (event) => {
        props.filterAnecdotes(event.target.value)
    }

    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} value={props.filter}/>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        filter: state.filter
    }
}

const mapDispatchToProps = {
    filterAnecdotes
}

const connectedFilter = connect(mapStateToProps, mapDispatchToProps)(Filter)

export default connectedFilter