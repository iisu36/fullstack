import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (notification === null) {
    return null
  }

  const style = {
    color: notification.type === 'alert' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  }

  return (
    <div id="notification" style={style}>
      {notification.message}
    </div>
  )
}

export default Notification
