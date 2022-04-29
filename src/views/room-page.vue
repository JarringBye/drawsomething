<template>
  <div id='board'>
    <button @click='draw' v-if="player<0">我来画</button>
    <button @click='guess' v-if="player<0">我来猜</button>
    <drawingboard v-if="player === 0"></drawingboard>
    <showingboard v-if="player === 1"></showingboard>
  </div>

</template>

<script>
import drawingboard from '../components/drawing-board'
import showingboard from '../components/showing-board'

export default {
  name: 'room-page',
  components: {
    drawingboard,
    showingboard
  },
  data () {
    return { player: '-1' }
  },
  methods: {
    draw () {
      this.player = 0
    },
    guess () {
      this.player = 1
    }
  }
}
</script>

<style scoped>

</style>
