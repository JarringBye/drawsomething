<template>
  <div id = "topics" ref="topics">
    <countdowntimerct :timer='timer' @finish = "finish"></countdowntimerct>
    <button class="topic" @click = "choose">{{ topics[0] }}</button>
    <button class="topic" @click = "choose">{{ topics[1] }}</button>
    <button class="topic" @click = "choose">{{ topics[2] }}</button>
    <button class="topic" @click = "choose">{{ topics[3] }}</button>
    <p>请选择题目</p>
    <button class="refresh" @click="refresh">换一组</button>
  </div>
</template>

<script>
const countdowntimerct = () => import('./countdown-timer')

export default {
  name: 'choosing-topic',
  components: {
    countdowntimerct
  },
  props: ['topics'],
  data () {
    return {
      timer: 30
    }
  },
  methods: {
    refresh () {
      this.$emit('refresh')
    },
    finish () {
      this.$emit('finish')
    },
    choose (e) {
      // console.log(e.target.innerText)
      this.$emit('choosed', e.target.innerText)
    }
  }
}
</script>

<style lang="less" scoped>
  #topics {
    width:400px;
    height:300px;
    border:1px solid;
    border-radius: 5px;
    background: #fff;
    p{
      font-size:20px;
      font-weight:bold;
    }
  };
  .topic {
    display:inline-block;
    width:150px;
    height:40px;
    margin: 10px;
  }
</style>
