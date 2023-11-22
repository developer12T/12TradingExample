import { createApp } from 'vue';
import App from './App.vue';
import router from './router'
const app = createApp(App);

 
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

app.use(router)
app.config.globalProperties.$socket = socket;
app.mount('#app');

