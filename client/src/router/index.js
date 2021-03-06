import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home";
import Prods from "../views/Prods";
import Profile from "../views/Profile";
import MyProds from "../views/MyProds";
import AddProd from "../views/AddProd";
import UpdateProd from "../views/UpdateProd";
import ProfileInfos from "../views/ProfileInfos";
import ProdDetails from "../views/ProdDetails";
import TransactionConfirmation from "../views/TransactionConfirmation";
import LegalNotices from "../views/LegalNotices";
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
    path: "/prod/:id",
    name: "ProdDetails",
    component: ProdDetails
  },
  {
    path: "/profil/:username",
    name: "Profile",
    component: Profile
  },
  {
    path: "/confirmation-transaction",
    name: "TransactionConfirmation",
    component: TransactionConfirmation
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
    path: "/compte/prods/:id",
    name: "UpdateProd",
    component: UpdateProd,
    meta: { requiresAuth: true }
  },
  {
    path: "/compte/infos",
    name: "ProfileInfos",
    component: ProfileInfos,
    meta: { requiresAuth: true }
  },
  {
    path: "/mentions-legales",
    name: "LegalNotices",
    component: LegalNotices
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

routes.scrollBehavior = () => {
  return { x: 0, y: 0 };
};

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);

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
