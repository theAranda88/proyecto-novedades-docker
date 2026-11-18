import './style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import Cargando from './components/ui/Cargando.vue';

declare module 'vue' {
  export interface GlobalComponents {
    Cargando: typeof Cargando;
  }
}
import { router } from './router';

const app = createApp(App);

// Pinia primero — el router puede necesitar acceder a stores en los guards
app.use(createPinia());
app.use(router);

app.component('Cargando', Cargando);
app.mount('#app');
