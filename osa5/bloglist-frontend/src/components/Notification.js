const Notification = ({ message }) => {

  if (message === null) {
    return null
  }

  return (
    <div className={message.color}>
      {message.text}
    </div>
  )
}

export default Notification