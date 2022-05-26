<template>
  <div id = "timer" ref='timer'>
    <p ref='timer'>您还有{{ time }}秒的时间</p>
  </div>
</template>

<script>
export default {
  mounted () {
    console.log(this.timer)
    this.time = this.timer
    const interval = setInterval(() => {
      if (this.time === 0) {
        clearInterval(interval)
        this.finish()
      } else {
        this.time--
      }
    }, 1000)
  },
  name: 'countdown-timer',
  props: ['timer'],
  data () {
    return { time: 100 }
  },
  methods: {
    finish () {
      this.$emit('finish')
    }
  }
}
</script>

<style lang="less" scoped>
  #timer {
    width:100%;
    height:50px;
    display: flex;
    justify-content: center;
    //align-items: center;
    p {
      width: 200px;
      text-align: center;
    }
  }
</style>
