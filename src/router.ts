import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/vs-cpu",
      name: "vs-cpu",
      component: () => import("./views/VsCpu.vue")
    },
    {
      path: "/vs-friend/:roomNumber",
      component: () => import("./views/VsFriendRoom.vue")
    },
    {
      path: "/vs-friend",
      name: "vs-friend",
      component: () => import("./views/VsFriend.vue")
    }
  ]
});
