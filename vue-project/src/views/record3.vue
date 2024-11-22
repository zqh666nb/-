<script setup></script>

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
        <span>学习记录</span>
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
        <span> what are the classes you normally have in your school. </span>
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
      <div class="rtext1">
        <span> OK, it's my pleasure. </span>

        <div
          class="tags-group"
          style="display: flex; align-items: center; gap: 5px; margin-top: 5px"
        >
          <div class="font1">
            <font class="iconfont icon-zhongyingwen1"></font>
          </div>
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
          <font class="iconfont icon-laba font2"></font>
        </div>
      </div>
      <div class="avatar">
        <img
          src="https://ts1.cn.mm.bing.net/th/id/R-C.a3326dfea8ea5544ebd406b824137ee9?rik=c6C3lRiXIQoEYg"
          alt=""
        />
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
        <span> What do you like to do out doors? </span>
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
        <span> Excuse me.Can you tell me the correct time? </span>
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
      <div class="rtext1">
        <span> Of course,it's 5 o'clock now </span>

        <div
          class="tags-group"
          style="display: flex; align-items: center; gap: 5px; margin-top: 5px"
        >
          <div class="font1">
            <font class="iconfont icon-zhongyingwen1"></font>
          </div>
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
          <font class="iconfont icon-laba font2"></font>
        </div>
      </div>
      <div class="avatar">
        <img
          src="https://ts1.cn.mm.bing.net/th/id/R-C.a3326dfea8ea5544ebd406b824137ee9?rik=c6C3lRiXIQoEYg"
          alt=""
        />
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
        <span> What do you like to do out doors? </span>
        <div class="tags-group">
          <div class="font1">
            <font class="iconfont icon-zhongyingwen1"></font>
          </div>

          <font class="iconfont icon-laba font2"></font>
        </div>
      </div>
    </div>
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
