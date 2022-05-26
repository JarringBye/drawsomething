const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, { cors: true })
server.listen(8090, () => console.log('服务器启动'))

const wordArr = ['猫', '狗', '熊', ' 花', '女孩', '飞机', '汽车', '面条', '尿布', '馒头', '黑丝', '牛奶',' 黑猫警长', '玉米', '鸡', '猴子', '袋鼠']
let hbeat = new Map()
let room = new Map()
let storage = new Map()
let roleMap = new Map()
io.on('connection', (socket) => {
  socket.on('heartbeat', (RoomID) => {
    // console.log('收到心跳')
    hbeat[socket.id] = Date.now()
    setTimeout(function () {
      var now = Date.now()
      if (now - hbeat[socket.id] > 5000) {
        console.log('this socket id will be closed ' + socket.id)
        if (storage.get(RoomID)) {
          // 对storage处理
        }
        socket.leave(RoomID)
        try {
          // this is the most important part
          io.sockets.connected[socket.id].disconnect()
        } catch (error) {
          console.log(error)
        }
      }
      now = null
    }, 6000)
  })
  socket.on('join_room', (message) => {
    const roomID = message.roomID
    if(!room.get(roomID)){
      room.set(roomID,{prepare:[], chair:[]})
      room.get(roomID).chair.push(socket.id)
      socket.join(roomID)
      socket.emit('access',{access:'access'})
      socket.emit('role_number',{
        drawer:roleMap.get(roomID) ? roleMap.get(roomID).drawer.length : 0,
        guesser:roleMap.get(roomID) ? roleMap.get(roomID).guesser.length :0
      })
    }
    else if(room.get(roomID) && room.get(roomID).chair.length <2){
      room.get(roomID).chair.push(socket.id)
      socket.join(roomID)
      socket.emit('access',{access:'access'})
      socket.emit('role_number',{
        drawer:roleMap.get(roomID) ? roleMap.get(roomID).drawer.length : 0,
        guesser:roleMap.get(roomID) ? roleMap.get(roomID).guesser.length :0
      })
    }
    else{
      room.get(roomID).prepare.push(socket.id)
      socket.emit('access',{access:'prevent'})
    }
    console.log(room)
  })
  socket.on('role', (message)=>{
    console.log(roleMap)
    const roomID = message.roomID
    const role = message.role
    socket.join(roomID)
    if(!roleMap.get(roomID)){ //初始化
      roleMap.set(roomID,{number:0,drawer:[],guesser:[]})
    }
    console.log(roleMap)
    if(roleMap.get(roomID).number<2) {
      if(role === 'drawer' && roleMap.get(roomID).drawer.length<1){
        roleMap.get(roomID).number++
        roleMap.get(roomID).drawer.push(socket.id)
        socket.emit('drawer_ok')
        io.sockets.in(roomID).emit('role_number',{
          drawer:roleMap.get(roomID).drawer.length,
          guesser:roleMap.get(roomID).guesser.length
        })
        if(roleMap.get(roomID).number === 2){
          io.sockets.in(roomID).emit('role_full')
        }
      }
      else if(role === 'guesser' && roleMap.get(roomID).guesser.length<1){
        roleMap.get(roomID).number++
        roleMap.get(roomID).guesser.push(socket.id)
        socket.emit('guesser_ok')
        io.sockets.in(roomID).emit('role_number',{
          drawer:roleMap.get(roomID).drawer.length,
          guesser:roleMap.get(roomID).guesser.length
        })
        if(roleMap.get(roomID).number === 2){
          io.sockets.in(roomID).emit('role_full')
        }
      }
    }else{
      io.sockets.in(roomID).emit('role_full')
    }
    console.log(roleMap)

  })
  socket.on('req_title', () => {
    const title = []
    let i = 0
    while(i<4){
      const num = Math.floor(Math.random() * wordArr.length)
      title.push(wordArr[num])
      i++
    }
    socket.emit('res_title', title)
    console.log(storage)
  })
  socket.on('title',(message)=>{
    const titleDx = {
      title: message.title
    }
    storage.set(message.roomID, titleDx)
    console.log(io.sockets.adapter.rooms)
    io.sockets.in(message.roomID).emit('start')
  })
  socket.on('roomid', (roomID) => {
    socket.join(roomID)
  })
  socket.on('data', (message) => {
    console.log(message)
    socket.broadcast.to(message.roomID).emit('data', { point:message.point, color:message.color, line:message.line })
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

app.get('/create', (req, res) => {
  console.log('////')
  const promise = new Promise((resolve) => {
    const arr = []
    for (let i = 0; i < 6; i++) {
      arr[i] = Math.floor(Math.random() * 10).toString()
    }
    while (storage.get(arr.join('')) === '') {
      for (let i = 0; i < 6; i++) {
        arr[i] = Math.floor(Math.random() * 10).toString()
      }
      console.log(arr)
    }
    console.log(arr)
    resolve(arr)
  })
  promise.then((arr) => {
    res.send({ roomID: arr.join('') })
  })
})
