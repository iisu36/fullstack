import { connect } from "react-redux"
import { addVote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = (props) => {

    const vote = async (anecdote) => {
        const timeOutId = props.notification ? props.notification.timeOutId : 1
        props.addVote(anecdote)
        props.setNotification(`you voted '${anecdote.content}'`, 5, timeOutId)
    }

    return (
        <div>
            {props.anecdotes.map(anecdote =>
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

const mapStateToProps = (state) => {
    const anecdotesFiltered = [...state.anecdotes].filter(anecdote =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
    return {
        anecdotes: anecdotesFiltered.sort((a, b) => b.votes - a.votes),
        notification: state.notification
    }
}

const mapDispatchToProps = {
    setNotification,
    addVote
}

export default connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)