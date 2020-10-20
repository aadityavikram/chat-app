const users = []

const userJoin = (id, username, room) => {
    const user = {id, username, room}
    users.push(user)
    return user
}

const userLeave = (id) => {
    const idx = users.findIndex((user) => user.id === id)
    if (idx != -1) {
        return users.splice(idx, 1)[0]
    }
}

const getCurrentUser = (id) => {
    return users.find((user) => user.id === id)
}

const roomUsers = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {userJoin, userLeave, getCurrentUser, roomUsers}