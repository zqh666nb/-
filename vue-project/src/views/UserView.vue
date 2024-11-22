<script setup>
  import router from "@/router"
  import { ref } from "vue";

  const onClickLeft = function () {
    router.push("/")
  }

  // 弹出层 设置
  const show = ref(false)
  const showPopup = () => {
    show.value = true;
  }

  // 语言水平跳转
  const navigateToLanguageLevel = () => {
    router.push("/language");
  }

  // 个人设置跳转
  const navigateToSetting = () => {
    router.push("/setting");
  }

  // 学习记录跳转
  const navigateToLearningrecord = () => {
    router.push("/record");  // 确保跳转到 /record 页面
  }

</script>

<template>
  <div class="user">
    <van-nav-bar title="SPEAR WITH AI" left-arrow @click-left="onClickLeft" />
    <div class="container">
      <img class="avatar" src="https://th.bing.com/th/id/OIP.0nBldIjGjWl-cX9GCo9W4wAAAA?rs=1&pid=ImgDetMain" alt="">
      <span class="name">用户名 asdkfasdf </span>
      <span class="count">个性签名：</span>
    </div>
    <div class="list">
      <span class="text">不限次数、帮助你更加强化的练习 </span>
      <van-cell-group>
        <van-cell title="语言水平" is-link @click="navigateToLanguageLevel" />
        <van-cell title="学习记录" is-link @click="navigateToLearningrecord" />  <!-- 学习记录跳转 -->
        <van-cell title="个人设置" is-link @click="navigateToSetting" />
      </van-cell-group>
    </div>
  </div>
  <van-popup v-model:show="show" position="bottom" :style="{ padding: '20px' }">
    <span class="title">我的英语成绩</span>
    <div class="text">
      <span>
        99.9
      </span>
    </div>
  </van-popup>
</template>

<style scoped lang="less">
  img {
    width: 100%;
    height: 100%;
  }

  .user {
    >.container

  {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 40px 0 70px 0;
    background: #d2ff9a;
    >.avatar

  {
    width: 160px;
    height: 160px;
    overflow: hidden;
    border-radius: 50%;
  }

  > .name {
    margin-top: 20px;
    font-size: 40px;
  }

  > .count {
    font-size: 30px;
  }

  }

  > .list {
    padding: 20px;
    .text

  {
    font-size: 30px;
  }

  > .van-cell-group {
    margin-top: 20px;
    padding: 10px;
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 0 40px rgba(234, 234, 234, .4);
  }

  }
  }

  .van-popup {
    border-radius: 40px 40px 0 0;
    background: #fefefe;
    >.title

  {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 40px;
    font-weight: 600;
  }

  > .text {
    font-size: 80px;
    text-align: center;
    line-height: 300px;
  }
  }
</style>
