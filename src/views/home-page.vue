<template>

  <div id='homepage'>
    <div>
      <button @click='createRoom'>创建房间</button>
      <br>
      <span>加入房间:</span>
      <input type="text" v-model="roomID">
      <button @click="joinRoom">确认</button>
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
      roomID: ''
    }
  },
  methods: {
    mounted () {
      socket.removeListener('message')
    },
    createRoom () {
    },
    joinRoom () {
      socket.emit('roomid', { roomID: this.roomID })
      this.$router.push({
        path: `/roompage${this.roomID}`
      })
    }
  }
}
</script>

<style lang="less">
body {
  background: #fff;
}
</style>
