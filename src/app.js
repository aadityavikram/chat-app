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
    socket.on('joined', (username, room) => {
        const currentUser = userJoin(socket.id, username, room)
        socket.join(currentUser.room)
        socket.emit('message', '', 'Welcome!', moment().format('h:mm a'), undefined)
        socket.broadcast.to(currentUser.room).emit('message', '', currentUser.username + ' has joined the chat!', moment().format('h:mm a'), undefined)
        io.to(currentUser.room).emit('roomUsers', roomUsers(currentUser.room))
    })
    socket.on('chatMessage', (msg) => {
        const currentUser = getCurrentUser(socket.id)
        socket.emit('message', currentUser.username, msg, moment().format('h:mm a'), 'right')
        socket.broadcast.to(currentUser.room).emit('message', currentUser.username, msg, moment().format('h:mm a'), 'left')
    })
    socket.on('disconnect', () => {
        const currentUser = userLeave(socket.id)
        if (currentUser) {
            io.to(currentUser.room).emit('message', '', currentUser.username + ' has left the chat!', moment().format('h:mm a'), undefined)
            io.to(currentUser.room).emit('roomUsers', roomUsers(currentUser.room))
        }
    })
})

const serverStartMessage = () => {
    console.log('Server up and running at port', port)
}

server.listen(port, serverStartMessage)