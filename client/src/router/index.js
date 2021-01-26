import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Prods from "../views/Prods.vue";
import Profile from "../views/Profile.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/prods",
    name: "Prods",
    component: Prods
  },
  {
    path: "/profil/:username",
    name: "Profile",
    component: Profile
  }
];

// routes.scrollBehavior = () => {
//   return { x: 0, y: 0 }
// }

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
