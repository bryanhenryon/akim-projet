import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home";
import Prods from "../views/Prods";
import Profile from "../views/Profile";
import MyProds from "../views/MyProds";
import AddProd from "../views/AddProd";
import ProfileInfos from "../views/ProfileInfos";
import NewPassword from "../views/NewPassword";
import store from "../store";

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
  },
  {
    path: "/compte/prods",
    name: "MyProds",
    component: MyProds,
    meta: { requiresAuth: true }
  },
  {
    path: "/compte/prods/ajouter",
    name: "AddProd",
    component: AddProd,
    meta: { requiresAuth: true }
  },
  {
    path: "/compte/infos",
    name: "ProfileInfos",
    component: ProfileInfos,
    meta: { requiresAuth: true }
  },
  {
    path: "/compte/nouveau-mot-de-passe",
    name: "NewPassword",
    component: NewPassword,
    meta: { requiresAuth: true }
  }
];

routes.scrollBehavior = () => {
  return { x: 0, y: 0 };
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.user) {
    next("/");

    const signInModal = document.querySelector(".sign-in-modal");
    const signInModalContent = document.querySelector(
      ".sign-in-modal__content"
    );

    signInModalContent.classList.add(
      "animate__animated",
      "animate__slideInDown",
      "animate__faster"
    );
    signInModal.classList.add("active");

    if (signInModal.classList.contains("active")) {
      window.addEventListener("click", e => {
        if (e.target === signInModal) {
          signInModal.classList.remove("active");
        } else {
          return false;
        }
      });
    }
  } else {
    next();
  }
});

export default router;
