<script setup>
  import router from "@/router";
  import { ref } from "vue";

  // 返回上一页
  const onClickLeft = () => {
    router.back();
  };

  // 模拟学习记录数据，每条记录添加一个 route 属性
  const learningRecords = ref([
    { date: "23 4月", time: "08:30", message: "Hey, friend! How are you today? Excuse me. Can you tell...", response: "...", route: "/record1" },
    { date: "22 5月", time: "21:25", message: "Will you have dinner with me tonight?", response: "OK, it's my pleasure.", route: "/record2" },
    { date: "22 6月", time: "17:34", message: "What are the classes you normally...", response: "Our school has math, physics...", route: "/record3" }
  ]);

  // 点击记录跳转到相应页面
  const onClickRecord = (route) => {
    router.push(route);
  };

</script>

<template>
  <div class="learning-record">
    <van-nav-bar title="学习记录" left-arrow @click-left="onClickLeft" />
    <div class="record-list">
      <div v-for="(record, index) in learningRecords"
           :key="index"
           class="record"
           @click="onClickRecord(record.route)">
        <div class="record-header">
          <span class="date">{{ record.date }}</span>
          <span class="time">{{ record.time }}</span>
        </div>
        <div class="record-content">
          <div class="message">{{ record.message }}</div>
          <div class="response">{{ record.response }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .learning-record {
    .van-nav-bar

  {
    font-weight: bold;
    text-align: center;
  }

  .record-list {
    padding: 20px;
  }

  .record {
    margin-bottom: 15px;
    padding: 15px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    cursor: pointer; /* 添加指针样式，表示可点击 */
  }

  .record-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #888;
  }

  .record-content {
    margin-top: 10px;
  }

  .message {
    color: #7f6ff1;
    font-size: 16px;
  }

  .response {
    color: #b3b3b3;
    font-size: 14px;
  }
  }
</style>
