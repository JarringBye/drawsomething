const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, { cors: true })

server.listen(8090, () => console.log('服务器启动'))
const wordArr = ['Monkey', 'Dog', 'Bear', 'Flower', 'Girl']
let hbeat = new Map()
let storage = new Map()
io.on('connection', (socket) => {
  socket.on('title', (roomID) => {
    const num = Math.floor(Math.random() * wordArr.length)
    socket.emit('title', wordArr[num])
    const titleDx = {
      title: wordArr[num]
    }
    storage.set(roomID, titleDx)
    console.log(storage)
  })
  socket.on('roomid', (roomID) => {
    socket.join(roomID)
  })

  socket.on('data', (message) => {
    console.log(message)
    socket.broadcast.to(message.roomID).emit('data', message.point)
  })

  socket.on('clear', (roomID) => {
    socket.broadcast.to(roomID).emit('clear')
  })

  socket.on('stop', (roomID) => {
    socket.broadcast.to(roomID).emit('stop')
  })

  socket.on('word', (message) => {
    console.log('received: %s', message.word)
    console.log(message.roomID)
    console.log(storage)
    const roomID = message.roomID
    console.log(storage.get(roomID))
    const keyWord = storage.get(roomID).title
    console.log(keyWord)
    if (message.word === keyWord) {
      console.log('correct')
      io.sockets.in(message.roomID).emit('success', keyWord)
    }
  })
})
io.on('disconnect', (socket) => {
  console.log(socket.id)
})
// app.post('/query', (req, res) => {
//   const roomID = req.roomID
//   if(storage.get(roomID)===''){
//
//   }
// })

