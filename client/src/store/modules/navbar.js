import router from "@/router";

const actions = {
  toggleMobileNavbar() {
    const mobileNavbar = document.querySelector(".mobile-navbar");
    mobileNavbar.classList.toggle("active");
  },

  showSignUpModal({ commit }) {
    const mobileNavbar = document.querySelector(".mobile-navbar");
    mobileNavbar.classList.remove("active");
    const signUpModal = document.querySelector(".sign-up-modal");
    const signUpModalContent = document.querySelector(
      ".sign-up-modal__content"
    );

    signUpModalContent.classList.add(
      "animate__animated",
      "animate__slideInDown",
      "animate__faster"
    );

    signUpModal.classList.add("active");

    if (signUpModal.classList.contains("active")) {
      window.addEventListener("click", e => {
        if (e.target === signUpModal) {
          signUpModal.classList.remove("active");
          commit("signUpModal/resetForm", null, { root: true });
        } else {
          return false;
        }
      });
    }
  },

  showSignInModal({ dispatch }) {
    const mobileNavbar = document.querySelector(".mobile-navbar");
    mobileNavbar.classList.remove("active");
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
          dispatch("signInModal/resetForm", null, { root: true });
        } else {
          return false;
        }
      });
    }
  },

  toggleDropdownMenu(context, e) {
    const currentTarget = e.currentTarget;

    const profileDropdownMenu = document.querySelector(
      ".navbar__user-profile-dropdown-menu"
    );
    const iconChevronDown = document.querySelector(
      ".icon-chevron-down--profile-dropdown-btn"
    );

    currentTarget.classList.toggle("active");

    if (currentTarget.classList.contains("active")) {
      iconChevronDown.style.transform = "rotate(180deg)";
      profileDropdownMenu.style.display = "block";

      window.addEventListener("click", e => {
        if (e.target !== currentTarget) {
          currentTarget.classList.remove("active");
          iconChevronDown.style.transform = "rotate(0)";
          profileDropdownMenu.style.display = "none";
        } else {
          false;
        }
      });
    } else {
      iconChevronDown.style.transform = "rotate(0)";
      profileDropdownMenu.style.display = "none";
    }
  },

  logout({ dispatch }) {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    dispatch("setToken", null, { root: true });
    dispatch("setUser", null, { root: true });
    router.push("/");
  }
};

export default {
  actions,
  namespaced: true
};
