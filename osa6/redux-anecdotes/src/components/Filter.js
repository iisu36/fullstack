import { useSelector, useDispatch } from "react-redux"
import { filterAnecdotes } from "../reducers/filterReducer"

const Filter = () => {
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()
    const handleChange = (event) => {
        dispatch(filterAnecdotes(event.target.value))
    }

    const style = {
        marginBottom: 10
    }

    return (
        <div style={style}>
            filter <input onChange={handleChange} value={filter}/>
        </div>
    )
}

export default Filter