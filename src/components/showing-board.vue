<template>
  <div id="showing">
    <div v-if="start !==2">
      <div>
        <p v-if="start === 0">等待画画角色选词</p>
        <p v-if="start === 1">关键词：{{keyword}}</p>
      </div>
      <countdowntimersb :timer="timer" v-if="start === 1"></countdowntimersb>
      <div>
        <canvas id="canvas" width="800" height="500" style="border: 4px solid #999;"></canvas>
      </div>
      <div id="answer-box">
        <span>Answer: </span>
        <input id="answer" type="text" v-model="word">
        <button id="submit" @click="sendword()">提交</button>
      </div>
      <div id = 'result'>
        <p>当前有{{winner}}位玩家猜画正确</p>
      </div>
    </div>
    <displayingresult v-if="start === 2" :answer = 'answer'></displayingresult>
  </div>
</template>

<script>
import io from 'socket.io-client'
import displayingresult from './displaying-result'
const countdowntimersb = () => import('./countdown-timer')

const socket = io('http://127.0.0.1:8090')

export default {
  mounted () {
    setInterval(() => {
      socket.emit('heartbeat', this.roomID)
      // console.log('发送心跳')
    }, 2000)
    socket.emit('roomid', this.roomID)
    console.log(this.roomID)
    this.canvas = document.getElementById('canvas')
    this.cxt = this.canvas.getContext('2d')
    socket.on('start', () => {
      console.log('start')
      this.start = 1
    })
    socket.on('data', (data) => {
      const point = data.point
      const color = data.color
      const line = data.line
      console.log(point)
      const pathObj = point.split(',')
      this.cxt.strokeStyle = color
      this.cxt.lineWidth = line// 样式
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
    socket.on('success', (answer) => {
      this.start = 2
      this.answer = answer
      // alert(keyWord)
    })
  },
  components: {
    countdowntimersb,
    displayingresult
  },
  data () {
    return {
      start: 0,
      canvas: '',
      cxt: '',
      moveToSwitch: 1,
      word: '',
      keyword: '动物',
      roomID: this.$route.params.roomID,
      timer: 60,
      winner: 0,
      answer: ''
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

<style lang="less" scoped>
#showing::before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/roombg.svg') no-repeat;
  background-size: contain;
  filter: blur(5px);
  z-index: -1;
}
#showing {
  width: 100%;
  height: 100%;
  //background: url('../assets/roombg.svg');
  //background-size: contain;
  display: flex;
  flex-direction: column;
  align-items: center;
  #canvas{
    background-color: #fff;
  }
  #answer-box {
    margin: 10px 0;
    button {
      margin-left: 10px;
    }
  }
}
</style>
