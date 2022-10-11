import { useSelector, useDispatch } from "react-redux"
import { addVote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = (props) => {
    const anecdotes = useSelector(state => {
        const anecdotesFiltered = [...state.anecdotes].filter(anecdote => 
            anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
        return anecdotesFiltered.sort((a, b) => b.votes - a.votes)
    })
    const dispatch = useDispatch()

    const vote = async (anecdote) => {
        dispatch(addVote(anecdote))
        dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList