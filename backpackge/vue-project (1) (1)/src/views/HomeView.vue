<script setup>
import { ref } from 'vue'

// 弹出层 设置
const show = ref(false)
const showPopup = () => {
  show.value = true
}

// 弹出层 翻译
const show2 = ref(false)
const showPopup2 = () => {
  show2.value = true
}

// 弹出层 点击说话
const show3 = ref(false)
const showPopup3 = () => {
  show3.value = true
}

// 滑动条
const onChange = value => console.log('当前值：' + value) // 使用 console.log() 替代 showToast
const value = ref(50)
</script>

<template>
  <main>
    <div class="header">
      <div class="avatar">
        <router-link to="/user">
          <img
            src="https://gd-hbimg.huaban.com/fbfc77d24b09f19eda0a2757262929647dc41525278a-06aA6p_fw658"
            alt=""
          />
        </router-link>
      </div>
      <div class="title">
        <span>SPEAK WITH AI</span>
      </div>
      <div></div>
    </div>
    <div class="content">
      <div class="avatar">
        <img
          src="https://ts1.cn.mm.bing.net/th/id/R-C.a3326dfea8ea5544ebd406b824137ee9?rik=c6C3lRiXIQoEYg"
          alt=""
        />
      </div>
      <div class="rtext">
        <span> Do you have a favorite board game? </span>
        <div class="tags-group">
          <div class="font1">
            <font class="iconfont icon-zhongyingwen1"></font>
          </div>

          <font class="iconfont icon-laba font2"></font>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="avatar">
        <img
          src="https://ts1.cn.mm.bing.net/th/id/R-C.a3326dfea8ea5544ebd406b824137ee9?rik=c6C3lRiXIQoEYg"
          alt=""
        />
      </div>
      <div class="rtext">
        <span> Do you have a favorite board game? </span>
        <div class="tags-group">
          <div class="font1">
            <font class="iconfont icon-zhongyingwen1"></font>
          </div>

          <font class="iconfont icon-laba font2"></font>
        </div>
      </div>
    </div>

    <div
      class="content"
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <!-- 文本内容部分 -->
      <div class="rtext1">
        <!-- 用户的文本内容 -->
        <span> Do you have a favorite board game? </span>

        <!-- 标签组部分 -->
        <div
          class="tags-group"
          style="display: flex; align-items: center; gap: 5px; margin-top: 5px"
        >
          <!-- 语言图标 -->
          <div class="font1">
            <font class="iconfont icon-zhongyingwen1"></font>
          </div>
          <!-- 口语纠错与评分按钮 -->
          <button
            style="
              padding: 0;
              border: none;
              background: none;
              font-size: calc(1em - 2px);
              cursor: pointer;
            "
          >
            口语纠错与评分
          </button>
          <!-- 扬声器图标 -->
          <font class="iconfont icon-laba font2"></font>
        </div>
      </div>
      <!-- 头像部分 -->
      <div class="avatar">
        <!-- 头像图片 -->
        <img
          src="https://ts1.cn.mm.bing.net/th/id/R-C.a3326dfea8ea5544ebd406b824137ee9?rik=c6C3lRiXIQoEYg"
          alt=""
        />
      </div>
    </div>

    <div class="bottom">
      <div class="tags">
        <span>示例回答</span>
        <span @click="showPopup2">翻译</span>
        <span @click="showPopup">场景选择</span>
      </div>
      <button class="btn-bottom" @click="showPopup3">
        <font class="iconfont icon-yuyin1"></font>
        点击说话
      </button>
    </div>

    <!-- 弹出层 场景选择 -->
    <van-popup
      v-model:show="show"
      position="bottom"
      :style="{ padding: '20px' }"
    >
      <span class="title">场景选择</span>
      <div class="setting">
        <span class="title">场景选择</span>
        <div class="row">
          <span class="active">偶遇</span>
          <span class="active">餐厅</span>
          <span class="active">课堂</span>
        </div>
      </div>
    </van-popup>

    <!-- 弹出层 翻译 -->
    <van-popup
      v-model:show="show2"
      position="bottom"
      :style="{ padding: '20px' }"
    >
      <div class="translation">
        <div class="close">
          <span class="icon" @click="show2 = false">关闭</span>
        </div>
        <textarea
          class="textarea"
          placeholder="请输入中文,Al熊熊火速翻译中..."
          rows="10"
        ></textarea>
        <div class="btn-group">
          <div class="l">
            <span>跟读对话</span>
          </div>
          <div class="r">
            <span>翻译</span>
            <span>发送</span>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 弹出层 点击说话 -->
    <van-popup
      v-model:show="show3"
      position="bottom"
      :style="{ padding: '20px' }"
    >
      <div class="translation">
        <div class="close">
          <span class="icon" @click="show3 = false">X</span>
        </div>

        <div class="btn-group">
          <div class="l">
            <span>确认发送</span>
          </div>
          <div class="r">
            <span>暂停</span>
            <span>重录</span>
          </div>
        </div>
      </div>
    </van-popup>
  </main>
</template>

<style scoped lang="less">
img {
  width: 100%;
  height: 100%;
}

.header {
  width: 100%;
  display: grid;
  //justify-content: space-between;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #f0f0f0;

  > .avatar {
    border-radius: 999px;
    overflow: hidden;
    width: 70px;
    height: 70px;
  }

  .title {
    margin: auto;
    font-size: 30px;

    span {
      font-weight: 600;
    }
  }
}

.content {
  display: flex;
  font-size: 40px;
  padding: 20px;

  > .avatar {
    border-radius: 999px;
    overflow: hidden;
    width: 80px;
    height: 80px;
  }

  .rtext {
    margin: auto;
    margin-left: 20px;
    background: #f3f3f3;
    padding: 20px;
    border-radius: 0% 40px 40px 40px;

    .tags-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;

      .font1 {
        width: 70px;
        height: 50px;
        display: flex;
        align-content: center;
        justify-content: center;

        background: white;
        border-radius: 20px;
        overflow: hidden;
      }

      .font2 {
        font-size: 40px;
        color: #727272;
      }
    }
  }

  .rtext1 {
    margin: auto;
    margin-right: 20px;
    background: #f3f3f3;
    padding: 20px;
    border-radius: 40px 0% 40px 40px;

    .tags-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 10px 0;

      .font1 {
        width: 70px;
        height: 50px;
        display: flex;
        align-content: center;
        justify-content: center;

        background: white;
        border-radius: 20px;
        overflow: hidden;
      }

      .font2 {
        font-size: 40px;
        color: #727272;
      }
    }
  }
}

.bottom {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  //background: red;
  z-index: 9;
  padding: 20px;
  box-shadow: 0px 0px 20px #efefef;
  display: flex;
  flex-direction: column;

  .tags {
    font-size: 30px;
    //font-weight: 500;
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;

    .active {
      background: #fee37c;
    }

    span {
      margin: auto;
      background: #f3f3f3;
      margin: auto;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 20px;
    }
  }

  .btn-bottom {
    width: 100%;
    height: 100px;
    // border: none;
    border: 2px solid black;
    border-radius: 20px;
    background: #f3f3f3;
    font-size: 40px;

    .iconfont {
      font-size: 40px;
    }
  }
}

.van-popup {
  border-radius: 40px 40px 0 0;
  background: #fefefe;

  > .title {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 40px;
    font-weight: 600;
  }

  //设置
  > .setting {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 1px 1px 20px #e9e9e9;
    display: flex;
    flex-direction: column;

    > * {
      //padding: 20px;
      margin: 20px 0;
    }

    > .title {
      font-size: 40px;
      font-weight: 600;
      line-height: 80px;
    }

    > .row {
      > span {
        margin-right: 20px;
        font-size: 30px;
        display: inline-block;
        border: 1px solid #eee;
        padding: 10px 60px;
        border-radius: 20px;
      }

      > .active {
        border: 4px solid #000000;
      }
    }
  }

  //翻译
  > .translation {
    > .close {
      width: 100%;
      display: flex;
      justify-content: right;

      .icon {
      }
    }

    > .textarea {
      border: 0;
      font-size: 30px;
    }

    > .btn-group {
      display: flex;
      justify-content: space-between;

      span {
        display: inline-block;
        font-size: 30px;
        background: #f3f3f3;
        padding: 10px 20px;
        border-radius: 20px;
      }

      > .r {
        :last-child {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
