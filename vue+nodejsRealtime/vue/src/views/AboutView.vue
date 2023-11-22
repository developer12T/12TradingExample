<template>
  <div>
    <h1>แจ้งเตือนจาก admin</h1>
    <ul>
      <li v-for="(message, i) in messages" :key="message.id">
        <span>ผู้ประกาศ : {{ message.user }} => {{ message.text }}</span>
      </li>
    </ul>
  </div>
  <div>
    <h1>ข้อมูลรายการที่ต้องอนุมัติ</h1>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Shop ID</th>
        <th>Sale Code</th>
        <th>Balance</th>
        <th>status</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(data, i) in dataOrders" :key="data._id">
        <td>{{ data.id }}</td>
        <td>{{ data.idShop }}</td>
        <td>{{ data.saleCode }}</td>
        <td>{{ data.balance }}</td>
        <td>{{ data.status }}</td>
        <td>
          <button @click="approveStatus(data.id)">Approve</button>
        </td>
      </tr>
      </tbody>
    </table>
    <router-link to="/">กลับไปหน้าหลัก</router-link>
  </div>


  <div v-if="showAlert"
       style="position: fixed; transition: all 0.15s ease-in-out; z-index: 50; inset: 0; display: flex; justify-content: center; align-items: center; background: rgba(0, 0, 0, 0.75);">
    <div
        style="background: white; padding: 1rem; width: 100%; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); display: flex; justify-content: center; flex-direction: column;">
      <div style="display: flex; justify-content: center; margin: 1rem 0;">
        <!-- แปลงเป็น style -->
      </div>
      <span style="margin-left: 1rem; margin-right: 1rem; font-weight: 500; font-size: 1.5rem;">มีรายการใหม่เข้ามา โปรดกดดำเนินการต่อเพื่ออนุมัติ</span>
      <div style="display: flex; justify-content: center; margin-top: 1rem;">
        <button
            style="color: white; background: #3490dc; transition: background 0.3s ease, color 0.3s ease; font-weight: 500; font-size: 0.875rem; border-radius: 9999px; text-align: center; padding: 0.625rem 1.25rem; margin-right: 0.5rem; margin-bottom: 0.5rem; outline: none; border: none; cursor: pointer;"
            type="button" @click="nexts('aa')">
          ดำเนินการต่อ
        </button>
      </div>
    </div>
  </div>

</template>

<script>
import {ref, onMounted} from 'vue';
import io from 'socket.io-client';

export default {
  setup() {
    const dataOrders = ref([]);
    const socket = io('http://localhost:3000');
    const originalDataOrders = ref([]);
    const messages = ref([]);
    const newMessage = ref('');
    const showAlert = ref(false);
    const oldData = ref(0)
    const receiveMessage = (message) => {
      messages.value.push(message);
    };
    const receiveDataOrder = (data) => {
      dataOrders.value = data;
      if (data.length !== oldData.value) {
        if (data.length > oldData.value) {
          showAlert.value = true
        }
        oldData.value = data.length
      }
    };

    onMounted(() => {

      socket.on('message', receiveMessage);
      socket.on('dataOrder', receiveDataOrder);
      fetchDataOrder();
    });

    const fetchDataOrder = async () => {
      try {
        const response = await fetch('http://localhost:3000/getDataOrder');
        const data = await response.json();
        dataOrders.value = data;
        oldData.value = data.length;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const nexts = (vale) => {
      showAlert.value = false
    }

    const approveStatus = async (id) => {
      // ทำสิ่งที่คุณต้องการเมื่อกดปุ่ม Approve
      const response = await fetch('http://localhost:3000/updateStatus', {
        method: 'PUT', // ใช้ HTTP method PUT
        headers: {
          'Content-Type': 'application/json', // ระบุรูปแบบข้อมูลที่ส่งเป็น JSON
        },
        body: JSON.stringify({id: id}), // ส่งค่าในรูปแบบ JSON
      });

      console.log(`Approve ID: ${id}`);
    };

    return {
      approveStatus,
      nexts,
      showAlert,
      messages,
      newMessage,
      dataOrders,
    };
  },
};
</script>

