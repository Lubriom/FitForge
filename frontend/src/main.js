import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import "aos/dist/aos.css";
import "vue-toastification/dist/index.css";
import Toast from "vue-toastification";
import App from "./App.vue";
import router from "./routes/Router.js";
import AOS from "aos";

const app = createApp(App);

app.use(createPinia());
app.use(Toast);
app.use(router);
app.mount("#app");

AOS.init();
