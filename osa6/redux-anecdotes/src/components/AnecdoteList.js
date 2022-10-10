import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import { voteNotification } from "../reducers/notificationReducer"

const AnecdoteList = (props) => {
    const anecdotes = useSelector(state => {
        const anecdotesFiltered = [...state.anecdotes].filter(anecdote => 
            anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
        return anecdotesFiltered.sort((a, b) => b.votes - a.votes)
    })
    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(voteAnecdote(anecdote.id))
        dispatch(voteNotification(anecdote.content))
        setTimeout(() => {
            dispatch(voteNotification(null))
        }, 5000);
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