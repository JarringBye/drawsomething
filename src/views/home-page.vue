<template>

  <div id='homepage'>
    <div id='room' v-if='player ==0'>
      <button @click='createRoom'>创建房间</button>
      <br>
      <span>加入房间:</span>
      <input type="text" v-model="roomID">
      <button @click="joinRoom">确认</button>
    </div>

    <div id='choosing-player-mode' v-if='player == 1'>
      <button @click='draw'>我来画</button>
      <button @click='guess'>我来猜</button>
    </div>
  </div>
  <!--  <button v-if='this.player == 2' @click='replay'>重新开始</button>-->
</template>

<script>
import io from 'socket.io-client'

const socket = io('http://127.0.0.1:8090')

export default {
  data: function () {
    return {
      player: 0,
      roomID: '',
      socket: ''
    }
  },
  methods: {
    mounted () {
      socket.removeListener('message')
      this.socket = io('http://127.0.0.1:8090')
    },
    createRoom () {
      this.player = 1
    },
    joinRoom () {
      socket.emit('roomid', { roomID: this.roomID })
      this.player = 1
    },
    draw () {
      this.$router.push({
        path: `/drawingpage${this.roomID}`
      })
      this.player = 1
    },
    guess () {
      this.$router.push({
        path: `/showingpage${this.roomID}`
      })

      this.player = 2
    },
    replay () {
      this.player = 0
      location.reload()
    }
  }
}
</script>

<style lang="less">
body {
  background: #fff;
}
</style>
