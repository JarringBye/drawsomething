<template>
  <div id='board'>
    <drawingboard></drawingboard>
    <showingboard></showingboard>
  </div>

</template>

<script>
import drawingboard from './components/drawing-board'
import showingboard from './components/showing-board'

export default {
  name: 'room-page',
  components: {
    drawingboard,
    showingboard
  }
}
</script>

<style scoped>

</style>
