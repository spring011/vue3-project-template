import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import '@/assets/css/reset.scss';
import 'element-plus/dist/index.css';
import indexPage from './indexPage.vue';
const app = createApp(indexPage);
app.use(ElementPlus, { locale: zhCn });

app.mount('#app');
