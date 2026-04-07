import { createRouter, createWebHistory } from "vue-router"

import Home from "../views/Home.vue"
import Map from "../views/Map.vue"
import About from "../views/About.vue"
import TickInfo from "../views/TickInfo.vue"
import TickHistory from "../views/TickHistory.vue"
import Signup from "../views/Signup.vue"
import Login from "../views/Login.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/map",
      component: Map
    },
    {
      path: "/about",
      component: About
    },
    {
        path: "/tickinfo",
        component: TickInfo
    },
    {
        path: "/Login",
        component: Login
    },
    {
        path: "/Signup",
        component: Signup
    },
    {
        path: "/tickHistory",
        component: TickHistory
    }
  ]
})

export default router