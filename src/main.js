import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueScrollTo from "vue-scrollto";

import prototypes from "./services/prototypes";
import isMobile from "./services/isMobile.js";

Vue.use(prototypes);
Vue.use(VueScrollTo);
Vue.use(isMobile);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
