import { createApp } from "vue";
import App from "./App.vue";
import { primeVuePlugin } from "./plugins/prime_vue";

const app = createApp(App);

app.use(primeVuePlugin);

app.mount("#app");
