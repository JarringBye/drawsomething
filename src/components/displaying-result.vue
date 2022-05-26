<template>
  <div id="display-result">
    <div id = "answer">
      <p>游戏结束！</p>
      <p>正确答案：{{answer}}</p>
    </div>
    <table>
      <tr style="border: 1px transparent">
        <td>排名</td>
        <td>玩家id</td>
        <td>分数</td>
      </tr>
      <tr :key = index v-for="(items, index) in results">
        <td>{{index+1}}</td>
        <template v-for="item in items">
          <td :key="item">{{item}}</td>
        </template>
      </tr>
    </table>
    <div id = "continue">
      <button>继续游戏</button>
      <button>回到大厅</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // answer: '熊',
      results: [['JylY5melW8LAqHp2AAQh', 9], ['hL5oQ2BVgbcGecZIAAAX', 7], ['0EDvFUJgS2oQsTs2AAAg', 0]]
    }
  },
  props: ['answer']
}
</script>

<style lang="less" scoped>
#display-result{
  width:800px;
  height:400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    margin-bottom:30px;
    font-size:30px;
  }
  table {
    width: 100%;
    margin-bottom:50px;
    background-color: bisque;
    border-radius: 5px;
    border-collapse: collapse;
    //height: 100%;
  }
  tr {
    border-top: 2px solid #ffffff;
  }
  td {
    width:200px;
    height: 30px;
    margin-right: 20px;
  }
  #continue {
    width: 400px;
    height:60px;
    button {
      margin: 5px
    }
  }
}
</style>
