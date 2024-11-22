<script setup>
  import { ref } from "vue";
  import router from "@/router";
  import { Toast } from "vant";

  // 控制弹出框显示
  const showEditNickname = ref(false);
  const showEditSignature = ref(false);

  // 头像，昵称，签名的值
  const avatar = ref("https://example.com/default-avatar.jpg");
  const nickname = ref("约翰史密斯");
  const signature = ref("这个人很懒，没有签名");

  // 控制返回按钮
  const onClickLeft = () => {
    router.back();
  };

  // 编辑头像，昵称，签名的跳转逻辑
  const navigateToEdit = (section) => {
    router.push(`/setting/${section}`);
  };

  // 保存修改的昵称
  const saveNickname = () => {
    Toast.success("昵称已保存：" + nickname.value);
    showEditNickname.value = false;
  };

  // 保存修改的签名
  const saveSignature = () => {
    Toast.success("签名已保存：" + signature.value);
    showEditSignature.value = false;
  };

  // 处理头像上传
  const handleAvatarUpload = (file) => {
    avatar.value = URL.createObjectURL(file); // 使用临时 URL 显示上传的图片
    Toast.success("头像已更新");
  };
</script>

<template>
  <div class="setting">
    <van-nav-bar title="个人资料编辑" left-arrow @click-left="onClickLeft" />

    <van-cell-group>
      <!-- 头像 -->
      <van-cell title="头像" is-link @click="showEditAvatar = true">
        <template #value>
          <img :src="avatar" alt="头像" style="width: 40px; height: 40px; border-radius: 50%" />
        </template>
      </van-cell>

      <!-- 昵称 -->
      <van-cell title="昵称" :value="nickname" is-link @click="showEditNickname = true" />

      <!-- 个人签名 -->
      <van-cell title="个人签名" :value="signature" is-link @click="showEditSignature = true" />
    </van-cell-group>

    <!-- 编辑昵称弹出框 -->
    <van-popup v-model:show="showEditNickname" position="bottom">
      <div class="edit-popup">
        <van-field v-model="nickname" label="编辑昵称" placeholder="请输入昵称" />
        <div class="actions">
          <van-button type="default" @click="showEditNickname = false">取消</van-button>
          <van-button type="primary" @click="saveNickname">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 编辑签名弹出框 -->
    <van-popup v-model:show="showEditSignature" position="bottom">
      <div class="edit-popup">
        <van-field v-model="signature" label="编辑签名" placeholder="请输入签名" />
        <div class="actions">
          <van-button type="default" @click="showEditSignature = false">取消</van-button>
          <van-button type="primary" @click="saveSignature">确定</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 编辑头像弹出框 -->
    <van-popup v-model:show="showEditAvatar" position="bottom">
      <div class="edit-popup">
        <van-uploader v-model="avatar" :max-size="2 * 1024 * 1024" @after-read="handleAvatarUpload" />
        <div class="actions">
          <van-button type="default" @click="showEditAvatar = false">取消</van-button>
          <van-button type="primary" @click="showEditAvatar = false">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
  .setting {
    .van-nav-bar

  {
    font-weight: bold;
    text-align: center;
  }

  .van-cell-group {
    padding: 20px;
  }

  .van-cell {
    font-size: 18px;
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
