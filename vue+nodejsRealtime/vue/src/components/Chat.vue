<template>
  <div>
    <h1>Real-time Notification Sender</h1>
    <input type="text" v-model="newMessage" />
    <button style="margin-left: 5px;" @click="sendMessage">ส่งประกาศ</button>
  </div>
  <div style="margin-top: 10px">
    <router-link to="/notifications" style="background-color: aquamarine;border-radius: 5px;padding: 5px">ไปหน้า sale page</router-link>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import io from 'socket.io-client';
export default {
  setup() {
    const socket = io('http://localhost:3000')
    const messages = ref([]);
    const newMessage = ref('');

    const sendMessage = () => {
      // ส่งข้อความผ่าน Socket.io
      socket.emit('message', { text: newMessage.value, user: 'woraphat' });
      newMessage.value = '';
    };

    onMounted(() => {
      // ใส่การรับข้อมูลจาก Socket.io ในนี้
      socket.on('message', (message) => {
        messages.value.push(message);
      });
    });

    return {
      messages,
      newMessage,
      sendMessage,
    };
  },
};
</script>
