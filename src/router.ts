import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashoard/Dashboard.vue";
import Entries from "@/views/Dashoard/Entries.vue";
// import Dashboard from "./layouts/dashboard.vue";
// import Login from "./layouts/login.vue";
// import Calculate from "./views/Calculate.vue";
// import Settings from "./views/Settings.vue";
// import ResetPassword from "./views/ResetPassword.vue";
// import RequestPassword from "./views/RequestPassword.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    // {
    //   path: "/reset-password",
    //   name: "ResetPassword",
    //   component: ResetPassword,
    // },
    // {
    //   path: "/request-password",
    //   name: "RequestPassword",
    //   component: RequestPassword,
    // },
    {
      path: "/",
      component: Dashboard,
      children: [
        {
          path: "/",
          name: "Entries",
          component: Entries,
        },
        // {
        //   path: "/calculate",
        //   name: "Calculate",
        //   component: Calculate,
        // },
        // {
        //   path: "/settings",
        //   name: "Settings",
        //   component: Settings,
        // },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
});

export default router;
