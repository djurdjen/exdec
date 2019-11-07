import Vue from "vue";
import Router from "vue-router";
import Dashboard from "./layouts/dashboard.vue";
import Login from "./layouts/login.vue";
import Calculate from "./views/Calculate.vue";
import Entries from "./views/Entries.vue";
import Settings from "./views/Settings.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/",
      component: Dashboard,
      children: [
        {
          path: "/",
          name: "Entries",
          component: Entries
        },
        {
          path: "/calculate",
          name: "Calculate",
          component: Calculate
        },
        {
          path: "/settings",
          name: "Settings",
          component: Settings
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
});

export default router;
