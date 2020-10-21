const path = require('path')
const http = require('http')
const moment = require('moment')
const express = require('express')
const socketio = require('socket.io')
const {userJoin, userLeave, getCurrentUser, roomUsers} = require('./users.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, '../static')))

const port = process.env.PORT || 3000

io.on('connection', (socket) => {
    console.log('New Connection!')
    // moment().format('h:mm a') --> add this to 3rd params of every message call to get timestamps
    socket.on('joined', (username, room) => {
        const currentUser = userJoin(socket.id, username, room)
        socket.join(currentUser.room)
        socket.emit('message', 'VikBot', 'Welcome!', '', 'center')
        socket.broadcast.to(currentUser.room).emit('message', 'VikBot', currentUser.username + ' has joined the chat!', '', 'center')
        io.to(currentUser.room).emit('roomUsers', roomUsers(currentUser.room))
    })
    socket.on('chatMessage', (msg) => {
        const currentUser = getCurrentUser(socket.id)
        socket.emit('message', currentUser.username, msg, 'A', 'right')
        socket.broadcast.to(currentUser.room).emit('message', currentUser.username, msg, '', 'left')
    })
    socket.on('disconnect', () => {
        const currentUser = userLeave(socket.id)
        if (currentUser) {
            io.to(currentUser.room).emit('message', 'VikBot', currentUser.username + ' has left the chat!', '', 'center')
            io.to(currentUser.room).emit('roomUsers', roomUsers(currentUser.room))
        }
    })
})

const serverStartMessage = () => {
    console.log('Server up and running at port', port)
}

server.listen(port, serverStartMessage)