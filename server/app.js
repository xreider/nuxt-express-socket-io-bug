const { createVerify } = require('crypto')
const express = require('express')
const app = express()
const users = require('./users')()
const server = require('http').createServer(app)
express.json()
express.urlencoded({extended: true})

// const options = {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true
//   }
// };
// const io = require('socket.io')(server, options)

const m = (name, text, id) => ({name, text, id})

const io = require('socket.io')(server, {
  allowEIO3: true // false by default. Let nuxt-socket-io (v2) works with socket.io (v3)
})

// io.sockets.on('connection', socket => {
io.on('connection', socket => {

  socket.on('userJoined', (data, cb) => {
    if (!data.name || !data.room) {
      return cb('Data is incorrect')
    }
    socket.join(data.room)
    users.remove(socket.id)
    users.add({
      id: socket.id,
      name: data.name,
      room: data.room
    })

    cb({userId: socket.id})
    io.to(data.room).emit('updateUsers', users.getByRoom(data.room))
    socket.emit('newMessage', m('admin', `Welcome, ${data.name}!`))
    socket.broadcast
      .to(data.room)
      .emit('newMessage', m('admin', `User ${data.name} came in!`))
  })

  socket.on('createMessage', (data, cb) => {
    if (!data.text) {
      return cb('Text cannot be empty')
    }
    const user = users.get(data.id)
    if (user) {
      io.to(user.room).emit('newMessage', m(user.name, data.text, data.id) )
    }
    cb()
  })

  socket.on('userLeft', (id, cb) => {
    const user = users.remove(id)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit('newMessage', m('admin', `User ${user.name} left!`))
    }
    cb()
  })

  socket.on('disconnect', () => {
    const user = users.remove(socket.id)
    if (user) {
      io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
      io.to(user.room).emit('newMessage', m('admin', `User ${user.name} left!`))
    }
  })
})

module.exports = {
  app, server
}
