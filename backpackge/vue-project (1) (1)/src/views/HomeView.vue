<script setup>
import { ref } from 'vue'

// 控制弹出层显示
const show = ref(false)
const showPopup = () => {
  show.value = true
}

const show2 = ref(false)
const showPopup2 = () => {
  show2.value = true
}

const show3 = ref(false)
const showPopup3 = () => {
  show3.value = true
}

// 滑动条
const onChange = value => console.log('当前值：' + value)
const value = ref(50)

// 录音功能
let mediaRecorder
let audioChunks = []
const isRecording = ref(false)

// 开始录音
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.start()
    isRecording.value = true

    // 收集音频数据
    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data)
    }
  } catch (error) {
    console.error('录音失败:', error)
  }
}

const stopRecording = () => {
  mediaRecorder.stop()
  isRecording.value = false

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })

    // 创建 FormData 用于上传
    const formData = new FormData()
    formData.append('file', audioBlob, 'recording.wav')

    // 上传音频文件到后端
    try {
      const response = await fetch(
        'http://localhost:8080/api/recordings/upload',
        {
          method: 'POST',
          body: formData,
        },
      )

      const result = await response.text()
      console.log(result)
    } catch (error) {
      console.error('上传录音失败:', error)
    }

    // 清空录音数据
    audioChunks = []
  }
}
</script>

<template>
  <main>
    <!-- 页面内容 -->
    <div class="bottom">
      <button class="btn-bottom" @click="showPopup3">
        <font class="iconfont icon-yuyin1"></font>
        点击说话
      </button>
    </div>

    <!-- 弹出层：录音 -->
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
            <button @click="startRecording" :disabled="isRecording">
              开始录音
            </button>
            <button @click="stopRecording" :disabled="!isRecording">
              停止录音并下载
            </button>
          </div>
        </div>
      </div>
    </van-popup>
  </main>
</template>

<style scoped lang="less">
/* 样式保持不变 */
img {
  width: 100%;
  height: 100%;
}

.header {
  width: 100%;
  display: grid;
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
  z-index: 9;
  padding: 20px;
  box-shadow: 0px 0px 20px #efefef;
  display: flex;
  flex-direction: column;

  .tags {
    font-size: 30px;
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

  .translation {
    > .close {
      width: 100%;
      display: flex;
      justify-content: right;
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
    }
  }
}
</style>
