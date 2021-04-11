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
import NotFound from "../views/NotFound";
import store from "../store";
import ResetPassword from "../views/ResetPassword";

const siteName = "Streamaker";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: `Accueil | ${siteName}`
    }
  },
  {
    path: "/prods",
    name: "Prods",
    component: Prods,
    meta: {
      title: `Prods | ${siteName}`
    }
  },
  {
    path: "/prod/:id",
    name: "ProdDetails",
    component: ProdDetails,
    meta: {
      title: `Détails | ${siteName}`
    }
  },
  {
    path: "/profil/:username",
    name: "Profile",
    component: Profile,
    meta: {
      title: `Profil | ${siteName}`
    }
  },
  {
    path: "/confirmation-transaction",
    name: "TransactionConfirmation",
    component: TransactionConfirmation,
    meta: {
      title: `Merci de votre achat ! | ${siteName}`
    }
  },
  {
    path: "/compte/prods",
    name: "MyProds",
    component: MyProds,
    meta: {
      requiresAuth: true,
      title: `Mes prods | ${siteName}`
    }
  },
  {
    path: "/compte/prods/ajouter",
    name: "AddProd",
    component: AddProd,
    meta: { requiresAuth: true, title: `Ajouter une prod | ${siteName}` }
  },
  {
    path: "/compte/prods/:id",
    name: "UpdateProd",
    component: UpdateProd,
    meta: {
      requiresAuth: true,
      title: `Modifier une prod | ${siteName}`
    }
  },
  {
    path: "/compte/infos",
    name: "ProfileInfos",
    component: ProfileInfos,
    meta: {
      requiresAuth: true,
      title: `Mes informations | ${siteName}`
    }
  },
  {
    path: "/mentions-legales",
    name: "LegalNotices",
    component: LegalNotices,
    meta: {
      title: `Mentions légales | ${siteName}`
    }
  },
  {
    path: "/nouveau-mot-de-passe/:token",
    name: "ResetPassword",
    component: ResetPassword,
    meta: {
      title: `Nouveau mot de passe | ${siteName}`
    }
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: `Page non trouvée | ${siteName}`
    }
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
  document.title = to.meta.title;

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
