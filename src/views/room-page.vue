<template>
  <div id='board'>
    <div class="room-head" @click = "copyText()">
      <p>点击可复制当前房间号：{{roomID}}</p>
    </div>
    <div class="prepare" v-if="access === 0">房间人员已满请等待</div>
    <div class="room-content" v-if = "access === 1 && full ===0">
      <p>选择您的角色</p>
      <div class="room-father">
        <div class="room-son">
          <p>我想画画</p>
          <div id="drawer" class ="btn" @click='draw'></div>
          <p>画画角色人数：{{drawer}}</p>
        </div>
        <div class="room-son">
          <p>我想猜画</p>
          <div id="guesser" class="btn" @click='guess'></div>
          <p>猜画角色人数：{{guesser}}</p>
        </div>
      </div>
    </div>
    <drawingboard v-if="full === 1 && player === 0"></drawingboard>
    <showingboard v-if="full === 1 && player === 1"></showingboard>
  </div>

</template>

<script>
import drawingboard from '../components/drawing-board'
import showingboard from '../components/showing-board'
import io from 'socket.io-client'

const socket = io('http://127.0.0.1:8090')
export default {
  mounted () {
    socket.emit('join_room', { roomID: this.roomID })
    socket.on('access', (message) => {
      if (message.access === 'access') {
        this.access = 1
      } else {
        this.access = 0
      }
    })
    socket.on('role_number', (message) => {
      this.drawer = message.drawer
      this.guesser = message.guesser
    })
    socket.on('role_full', () => {
      this.full = 1
      console.log(this.full, this.player)
    })
    socket.on('drawer_ok', () => {
      this.player = 0
    })
    socket.on('guesser_ok', () => {
      this.player = 1
    })

    // window.addEventListener('beforeunload', this.beforeUnloadHandler, false)
  },
  // destroyed () {
  //   window.removeEventListener('beforeunload', this.beforeUnloadHandler, false)
  // },

  name: 'room-page',
  components: {
    drawingboard,
    showingboard
  },
  data () {
    return {
      player: -1,
      roomID: this.$route.params.roomID,
      role: '',
      access: 0,
      full: 0,
      drawer: 0,
      guesser: 0
    }
  },
  methods: {
    copyText () {
      console.log('copy')
      this.$nextTick(() => {
        const text = this.roomID
        const newInput = document.createElement('input')
        newInput.value = text
        document.body.appendChild(newInput)
        newInput.select()
        document.execCommand('Copy')
      })
      // this.$message.success('复制成功')
    },
    // beforeUnloadHandler (e) {
    //   e.returnValue = '确认要离开此页面？' // 此处返回任意字符串，不返回null即可，不能修改默认提示内容
    // },
    draw () {
      socket.emit('role', {
        roomID: this.roomID,
        role: 'drawer'
      })
    },
    guess () {
      socket.emit('role', {
        roomID: this.roomID,
        role: 'guesser'
      })
    }
  }
}
</script>

<style lang="less" scoped>
//#board::before{
//  content: '';
//  position: absolute;
//  top: 0;
//  left: 0;
//  width: 100vw;
//  height: 100vh;
//  background: url('../assets/homebg.svg') no-repeat;
//  background-size: contain;
//  filter: blur(5px);
//  z-index: -1;
//}
#board {
    //background: url('../assets/homebg.svg') no-repeat;
    //background-size: contain;
    font-size: 18px;
    font-weight: bold;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  .room-head {
    height: 60px;
    margin-top: 20px;
    margin-bottom: 5px;
  }
  .room-head>p:hover {
    box-shadow: 0 0 8px mediumpurple ;
    border: 1px transparent;
    border-radius: 5px;
    cursor: pointer
  }
  .room-content {
    width: 800px;
    height: 500px;
    background-color: white;
    border-radius: 2%;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    >p {
      font-size: 30px;
      font-weight: bold;
    }
    .room-father {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .room-son {
      width: 300px;
      height: 300px;
      margin: 25px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  #drawer {
    background: url('../assets/draw.svg') no-repeat center;
    background-size: contain;
  }
  #guesser {
    background: url('../assets/guess.svg') no-repeat center;
    background-size: contain;
  }
  .btn {
    width: 200px;
    height: 200px;
    font-size: 20px;
    border: 1px transparent;
    border-radius: 10px;
  }
  .btn:hover {
    box-shadow: 0 0 10px mediumpurple;
  }
  //.btn:active {
  //  background-color:bisque;
  //}
  //.btn:focus {
  //  background-color:bisque;
  //}
}

</style>
