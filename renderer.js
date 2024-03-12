const NOTIFICATION_TITLE = 'Title'
  const NOTIFICATION_BODY = 'Notification from the Electron. Click to log to console.'
  const CLICK_MESSAGE = 'Notification clicked!'
  
  new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
    .onclick = () => { document.getElementById('output').innerText = CLICK_MESSAGE }
// // close app
// function closeApp(e) {
//   e.preventDefault()
//   ipc.send('close')
// }

// document.getElementById("closeBtn").addEventListener("click", closeApp);
  