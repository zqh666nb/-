<script setup>
  import { ref } from "vue";
  import router from "@/router";
  import { Toast } from "vant";

  // 控制弹出框的显示
  const showEditPopup = ref(false);
  const showEditCet6 = ref(false);
  const showEditVocabulary = ref(false);

  // 成绩和词汇量
  const cet4Score = ref(589);
  const cet6Score = ref(486);
  const vocabularyLevel = ref(6200);

  // 返回上一页
  const onClickLeft = () => {
    router.back();
  };

  // 编辑四级成绩
  const saveCet4 = () => {
    Toast.success("四级成绩已更新：" + cet4Score.value);
    showEditPopup.value = false;
  };

  // 编辑六级成绩
  const saveCet6 = () => {
    Toast.success("六级成绩已更新：" + cet6Score.value);
    showEditCet6.value = false;
  };

  // 编辑词汇量水平
  const saveVocabulary = () => {
    Toast.success("词汇量已更新：" + vocabularyLevel.value);
    showEditVocabulary.value = false;
  };
</script>

<template>
  <div class="language">
    <van-nav-bar title="语言水平" left-arrow @click-left="onClickLeft" />
    <van-cell-group>
      <van-cell title="四级成绩" :value="cet4Score" is-link @click="showEditPopup = true" />
      <van-cell title="六级成绩" :value="cet6Score" is-link @click="showEditCet6 = true" />
      <van-cell title="词汇量水平" :value="vocabularyLevel" is-link @click="showEditVocabulary = true" />
    </van-cell-group>

    <!-- 编辑四级成绩弹出框 -->
    <van-popup v-model:show="showEditPopup" position="bottom">
      <div class="edit-popup">
        <van-field v-model="cet4Score" label="编辑四级成绩" placeholder="请输入四级成绩" />
        <div class="actions">
          <van-button type="default" @click="showEditPopup = false">取消</van-button>
          <van-button type="primary" @click="saveCet4">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 编辑六级成绩弹出框 -->
    <van-popup v-model:show="showEditCet6" position="bottom">
      <div class="edit-popup">
        <van-field v-model="cet6Score" label="编辑六级成绩" placeholder="请输入六级成绩" />
        <div class="actions">
          <van-button type="default" @click="showEditCet6 = false">取消</van-button>
          <van-button type="primary" @click="saveCet6">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 编辑词汇量弹出框 -->
    <van-popup v-model:show="showEditVocabulary" position="bottom">
      <div class="edit-popup">
        <van-field v-model="vocabularyLevel" label="编辑词汇量" placeholder="请输入词汇量" />
        <div class="actions">
          <van-button type="default" @click="showEditVocabulary = false">取消</van-button>
          <van-button type="primary" @click="saveVocabulary">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
  .language {
    .van-nav-bar

  {
    font-weight: bold;
    text-align: center;
  }

  .van-cell-group {
    padding: 50px;
  }

  .van-cell {
    font-size: 20px;
  }

  .edit-popup {
    padding: 20px;
    background-color: #fff;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  }
</style>
