import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueScrollTo from "vue-scrollto";

import prototypes from "./services/prototypes";

Vue.use(prototypes);
Vue.use(VueScrollTo);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
