<template>
  <div id="drawing">
    <canvas id="canvas" width="800" height="500" @mousedown="drawBegin($event)" @mouseup="drawEnd()"
            @mousemove="drawing($event)"></canvas>
    <div id="keyword-box">
      <span>Keyword:{{ this.title }} </span>
      <span id="keyword"></span>
    </div>
    <button id="btn" @click="clearCanvas()">清空画布</button>
  </div>
</template>

<script>
import io from 'socket.io-client'

const socket = io('http://127.0.0.1:8090')

export default {
  mounted () {
    // socket.removeListener('message')
    this.init()
    socket.on('success', (keyWord) => {
      alert(keyWord)
    })
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
      roomID: this.$route.params.roomID
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
      socket.emit('title', this.roomID)
      socket.on('title', (title) => {
        console.log(title)
        this.title = title
      })
    },
    drawBegin (e) { // 路径开始
      window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
      this.cxt.strokeStyle = '#000' // 路径样式
      this.cxt.beginPath()
      this.cxt.moveTo(
        e.clientX - this.stage_info.left,
        e.clientY - this.stage_info.top
      )

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

        socket.emit('data', {
          roomID: this.roomID,
          point: (this.path.beginX + '.' + this.path.beginY + '.' + this.path.endX + '.' + this.path.endY)
        })

        this.cxt.stroke()
      }
    },

    drawEnd () {
      this.couldDraw = false
      socket.emit('stop', this.roomID)
    },

    clearCanvas () {
      this.cxt.clearRect(0, 0, 800, 500)
      socket.emit('clear', this.roomID)
    }
  }

}
</script>

<style lang="less">
#drawing {
  border: 1px solid #999;
  width: 1000px;
  height: 800px;
}

#canvas {
  background: pink;
  cursor: default;
}

#keyword-box {
  margin: 10px 0;
}
</style>
