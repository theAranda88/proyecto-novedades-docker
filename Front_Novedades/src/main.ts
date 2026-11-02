import './style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';

const app = createApp(App);

// Pinia primero — el router puede necesitar acceder a stores en los guards
app.use(createPinia());
app.use(router);

app.mount('#app');
