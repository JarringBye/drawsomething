<template>
  <div id="homepage">
    <div id="header">
      <p>你画我猜小游戏</p>
    </div>
    <div id="container">
      <div class="container-left">
        <img src="../assets/home.svg" alt="homepic">
      </div>
      <div class="container-right">
        <div class="login-title">
          <p>加入房间｜Join The Room</p>
        </div>
        <div class="login-input">
          <p>
            <span style="font-weight:bold">房间号  </span>
            <input type="text" class="input-ele" v-model="roomID" @keyup.enter="joinRoom">
          </p>
          <button @click="joinRoom" :disabled='!this.hasInput'>加入</button>
        </div>
        <div id="create">
          <a href ='#' @click="createRoom">还没有房间号？点击创建房间</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import io from 'socket.io-client'

// const socket = io('http://127.0.0.1:8090')

export default {
  data: function () {
    return {
      roomID: ''
    }
  },
  computed: {
    hasInput () {
      return Boolean(this.roomID.length === 6 && !isNaN(Number(this.roomID)))
    }
  },
  methods: {
    createRoom () {
      this.$axios.get('/apis/create').then((response) => {
        console.log(response.data.roomID, typeof (response.data.roomID))
        this.roomID = response.data.roomID
        this.$router.push({
          path: `/roompage${this.roomID}`
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    joinRoom () {
      // socket.emit('roomid', { roomID: this.roomID })
      if (this.hasInput) {
        this.$router.push({
          path: `/roompage${this.roomID}`
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
/*p {*/
/*  margin: 0;*/
/*}*/
#homepage {
  width: 100vw;
  height: 100vh;
  //background: url('../assets/homebg.svg') no-repeat;
  //background-size: contain;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#header {
  margin-top: 20px;
  margin-bottom: 30px;
  p {
    font-size: 40px;
    font-weight: bold;
  }
}
#homepage::before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('../assets/homebg.svg') no-repeat;
  background-size: contain;
  filter: blur(5px);
  z-index: -1;
}

#container {
  filter: opacity(80%);
  width: 800px;
  height: 500px;
  background-color: white;
  border-radius: 2%;
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  .container-left {
    width: 400px;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container-right {
    width: 400px;
    height: 400px;
    overflow: hidden
  }

  .login-title {
    font-size: 20px;
    font-weight: bold;
    width: 400px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-title > p {
    width: 200px;
    height: 50px;
  }

  .login-input {
    width: 400px;
    height: 200px;
  }

  .login-input p {
    margin-top: 50px;
  }

  .input-ele {
    width: 200px;
    height: 30px;
    border: solid;
    border-radius: 5px;
    font-size: 18px;
  }

  img {
    width: 300px;
    height: 300px;
    display: block;
  }

  .login-input button {
    width: 100px;
    height: 40px;
    display: block;
    margin-left: 125px;
    margin-top: 30px;
    color: inherit;
    border: solid;
    border-radius: 5px;
    font-weight: bold;
  }

  button:disabled {
    color: inherit;
    opacity: 0.6;
    cursor: not-allowed;
  }

  #create {
    width: 300px;
    height: 40px;
    margin-left: 60px;
    font-size: 14px;
    a :link {
      color: #2c3e50;
    };
    a :hover {
      color: pink;
    }
  }
  box-shadow: 8px 8px 8px rgba(200,200,200,0.5) ;
}
</style>
