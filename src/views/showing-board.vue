<template>
  <div id="showing">
    <canvas id="showing-board" width="800" height="500" style="border: 1px solid #999;"></canvas>
    <div id="answer-box">
      <span>Answer: </span>
      <input id="answer" type="text" v-model="word">
      <button id="submit" @click="sendword()">提交</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

const socket = io('http://127.0.0.1:8090')

export default {
  mounted () {
    socket.emit('roomid', this.roomID)
    console.log(this.roomID)
    this.canvas = document.getElementById('showing-board')
    this.cxt = this.canvas.getContext('2d')
    socket.on('data', (point) => {
      console.log(point)
      const pathObj = point.split('.')
      this.cxt.strokeStyle = '#000' // 样式
      if (this.moveToSwitch) {
        this.cxt.beginPath()
        this.cxt.moveTo(pathObj[0], pathObj[1])
        this.moveToSwitch = 0
      }
      this.cxt.lineTo(pathObj[2], pathObj[3]) // 画路径中
      this.cxt.stroke()
    })
    socket.on('stop', () => {
      this.moveToSwitch = 1
    })
    socket.on('clear', () => {
      this.cxt.clearRect(0, 0, 800, 500)
      this.moveToSwitch = 1
    })
    socket.on('success', (keyWord) => {
      alert(keyWord)
    })
  },
  data () {
    return {
      canvas: '',
      cxt: '',
      moveToSwitch: 1,
      word: '',
      roomID: this.$route.params.roomID
    }
  },
  methods: {
    sendword () {
      console.log(this.word)
      if (this.word) {
        socket.emit('word', {
          word: this.word,
          roomID: this.roomID
        })
      }
    }
  }
}
</script>

<style lang="less">
#showing-board {
  background: lightblue;
}

#answer-box {
  margin: 10px 0;
}
</style>
