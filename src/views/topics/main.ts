import { createApp } from 'vue';
import router from './router/index';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { createPinia } from 'pinia';
import '@/assets/css/reset.scss';
import 'element-plus/dist/index.css';
import TopicsEntry from './TopicsEntry.vue';
const app = createApp(TopicsEntry);
app.use(ElementPlus, { locale: zhCn });
app.use(router);
app.use(createPinia());

app.mount('#app');
