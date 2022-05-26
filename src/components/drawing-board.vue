<template>
  <div id="drawing">
    <choosingtopic v-if = "start === 0" :topics="topics" @refresh="refresh" @finish="finish" @choosed = "choosed"></choosingtopic>
    <div class="start" v-if="start === 1">
      <p>题目：{{title}}</p>
      <countdowntimerdb :timer="timer" @finish="finish"></countdowntimerdb>
      <div>
        <canvas
          id="canvas"
          width="800"
          height="500"
          style = "border:4px solid #999"
          @mousedown="drawBegin($event)"
          @mouseup="drawEnd"
          @mousemove="drawing($event)"
          @mouseleave="drawEnd"
        ></canvas>
      </div>
      <div>
<!--        <button id="btn" @click="clearCanvas()">清空画布</button>-->
        <div class="model">
          <img src="../assets/clear.svg" alt="画笔样式" @click = "clearCanvas">
        </div>
        <div  id = "line" class="model">
          <img src="../assets/line.svg" alt="画笔样式">
          <div id = "line_btn">
            <button @click = "changeLine">1px</button>
            <button @click = "changeLine">5px</button>
            <button @click = "changeLine">10px</button>
            <button @click = "changeLine">15px</button>
          </div>
        </div>
        <div id="color" class="model">
          <img src="../assets/paint.svg" alt="画笔样式">
          <div id = "color_btn">
            <button @click = changeColor style="color:black">黑色</button>
            <button @click = changeColor style="color:red">红色</button>
            <button @click = changeColor style="color:yellow">黄色</button>
            <button @click = changeColor style="color:blue">蓝色</button>
            <button @click = changeColor style="color:white">橡皮</button>
          </div>
        </div>
      </div>
    </div>
    <displayingresult v-if="start === 2" :answer = "answer"></displayingresult>
  </div>
</template>

<script>
import io from 'socket.io-client'
import choosingtopic from './choosing-topic'
import displayingresult from './displaying-result'
const countdowntimerdb = () => import('./countdown-timer')

const socket = io('http://127.0.0.1:8090')

export default {
  mounted () {
    socket.emit('roomid', this.roomID)
    socket.emit('req_title')
    socket.on('res_title', (title) => { this.topics = title })
    socket.on('start', () => {
      console.log('start:' + this.start)
      this.start = 1
      this.$nextTick(() => {
        this.init()
      })
    })
    socket.on('success', (answer) => {
      // alert(keyWord)
      this.answer = answer
      this.start = 2
    })
    setInterval(() => {
      socket.emit('heartbeat', this.roomID)
      // console.log('发送心跳')
    }, 2000)

    window.addEventListener('scroll', this.handleScroll) // 监听页面滚动
  },
  components: {
    countdowntimerdb,
    choosingtopic,
    displayingresult
  },
  data () {
    return {
      title: '',
      el: '',
      canvas: document.getElementById('canvas'),
      cxt: '',
      stage_info: '',
      path: '',
      couldDraw: false,
      roomID: this.$route.params.roomID,
      timer: 60,
      topics: ['1', '2', '3', '4'],
      start: 0,
      answer: ''
    }
  },
  methods: {
    init () {
      this.el = 'canvas'
      this.canvas = document.getElementById(this.el)
      this.cxt = this.canvas.getContext('2d')
      this.stage_info = this.canvas.getBoundingClientRect()
      this.path = {
        beginX: 0,
        beginY: 0,
        endX: 0,
        endY: 0
      }
      this.couldDraw = false
      socket.emit('roomid', this.roomID)
      console.log(this.roomID)
    },
    drawBegin (e) {
      this.stage_info = this.canvas.getBoundingClientRect() // 解决父子组件渲染顺序导致rect问题
      window.getSelection()
        ? window.getSelection().removeAllRanges()
        : document.selection.empty()
      // this.cxt.strokeStyle = '#000' // 默认路径颜色样式
      this.cxt.beginPath()
      this.cxt.moveTo(
        e.clientX - this.stage_info.left,
        e.clientY - this.stage_info.top
      )
      console.log(e.clientX, this.stage_info)
      this.path.beginX = e.clientX - this.stage_info.left
      this.path.beginY = e.clientY - this.stage_info.top
      this.couldDraw = true
    },
    drawing (e) {
      if (this.couldDraw) {
        this.cxt.lineTo(
          e.clientX - this.stage_info.left,
          e.clientY - this.stage_info.top
        )
        this.path.endX = e.clientX - this.stage_info.left
        this.path.endY = e.clientY - this.stage_info.top
        // console.log(this.path.beginX, this.path.beginY, this.path.endX, this.path.endY)
        console.log(e.clientY, this.canvas.getBoundingClientRect(), this.stage_info)
        socket.emit('data', {
          roomID: this.roomID,
          point:
            this.path.beginX +
            ',' +
            this.path.beginY +
            ',' +
            this.path.endX +
            ',' +
            this.path.endY,
          color: this.cxt.strokeStyle,
          line: this.cxt.lineWidth
        })
        this.cxt.stroke()
      }
    },
    drawEnd () {
      console.log('end')
      this.couldDraw = false
      socket.emit('stop', this.roomID)
    },
    clearCanvas () {
      this.cxt.clearRect(0, 0, 800, 500)
      socket.emit('clear', this.roomID)
    },
    changeLine (e) {
      const line = Number(e.target.innerText.split('px')[0])
      console.log(line)
      this.cxt.lineWidth = line
      console.log(this.cxt)
    },
    changeColor (e) {
      const color = e.target.style.color
      console.log(color)
      this.cxt.strokeStyle = color
    },
    refresh () {
      socket.emit('req_title')
    },
    finish () {
      this.start = 1
    },
    choosed (topic) {
      this.title = topic
      socket.emit('title', { roomID: this.roomID, title: this.title })
    }
  }
}
</script>

<style lang="less" scoped>
#drawing::before{
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
#drawing {
  font-size:18px;
  font-weight:bold;
  //background: url('../assets/roombg.svg');
  //background-size: contain;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  .start {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #line_btn {
    visibility: hidden;
  }
  #color_btn {
    visibility: hidden;
  }
  #canvas {
    background: #fff;
    cursor: default;
  }
  #keyword-box {
    margin: 10px 0;
  }
  .model {
    margin: 10px 20px;
    float: left;
    width:100px;
    height:100px;
  }
  #color:hover #color_btn{
    visibility: visible;
  }
  #line:hover #line_btn{
    visibility: visible;
  }
  img {
    width: 28px;
    height: 28px;
  }
  displaying-result {
    flex: 1;
    text-align: right;
  }
}

</style>
