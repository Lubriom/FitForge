import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import "aos/dist/aos.css";
import App from "./App.vue";
import router from "./routes/Router.js";
import AOS from "aos";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");

AOS.init();
