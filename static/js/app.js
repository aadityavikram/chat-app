const socket = io()

const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')
const users = document.querySelector('#users')

const info = Qs.parse(location.search, {ignoreQueryPrefix: true})

socket.emit('joined', info.username, info.room)

socket.on('roomUsers', (userList) => {
    users.innerHTML = `
    ${userList.map((user) => `<li style="padding-left: 30%; color: white;">${user.username}</li>`).join('')}
    `
})

const getMessageDiv = (username, message, time, pos) => {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
    <p class="meta" style="text-align:${pos}">${username} <span>${time}</span></p>
    <p class="text" style="text-align:${pos}">
        ${message}
    </p>
    `
    return div
}

socket.on('message', (username, message, time, pos) => {
    console.log(message);
    const messageDiv = getMessageDiv(username, message, time, pos)
    chatMessages.appendChild(messageDiv)
    document.querySelector('#room-name').textContent = info.room
    chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = document.querySelector('#msg')
    socket.emit('chatMessage', msg.value)
    msg.value = ''
    msg.focus()
})