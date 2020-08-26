import Vue from "vue";
import Router from "vue-router";
import Index from "./views/Index.vue";
import Dashboard from "./views/Dashboard.vue";
import Design from "./views/Design";
import Login from "./views/Login.vue";
import NotFound from "./views/NotFound.vue";
import Optimization from "./views/Optimization";
import Sql_diagnose from "./views/Sql_diagnose";
import Db_security from "./views/Db_security";
import Dbai from "./views/Dbai";
import Performance from "./views/Performance";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/",
      component: Index,
      children: [
        {
          path: "/dashboard",
          name: "dashboard",
          component: Dashboard
        },
        {
          path: "/design",
          name: "design",
          component: Design
        },
        {
          path: "/optimization",
          name: "optimization",
          component: Optimization
        },
        {
          path: "/sql_diagnose",
          name: "sql_diagnose",
          component: Sql_diagnose
        },
        {
          path: "/db_security",
          name: "db_security",
          component: Db_security
        },
        {
          path: "/dbai",
          name: "dbai",
          component: Dbai
        },
        {
          path: "/performance",
          name: "performance",
          component: Performance
        },
        {
          path: "/404",
          component: NotFound
        }
      ]
    },
    {
      path: "*",
      redirect: { path: "/404" }
    }
  ]
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const LOGINURL = "/login";
  let url, user;

  url = to.path;
  user = sessionStorage.getItem("user");

  if (url === LOGINURL) {
    sessionStorage.removeItem("user");
  }

  // 判断是否登录
  if (!user && url !== LOGINURL) {
    next({ path: LOGINURL });
  } else {
    next();
  }
});

export default router;
