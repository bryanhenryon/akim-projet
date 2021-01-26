<template>
  <nav class="navbar">
    <div class="navbar_logo">LOGO / NOM DU SITE</div>
    <div class="navbar_buttons">
      <button
        v-if="!jwt"
        class="btn navbar__sign-in-btn"
        @click="showSignInModal"
      >
        Se connnecter
      </button>
      <button v-if="!jwt" class="btn btn-buy" @click="showSignUpModal">
        Achète des prods
      </button>
      <button v-if="!jwt" class="btn btn-sell">
        Vends des prods
      </button>
      <div class="navbar__profile">
        <button
          v-if="jwt"
          class="btn navbar__user-profile-dropdown-btn"
          @click="showDropdownMenu"
        >
          <div class="navbar__user-img-container">
            <img
              class="navbar__user-img"
              src="https://www.randomlists.com/img/people/winston_churchill.webp"
              alt="Image de profil"
            />
          </div>
          <p v-if="user">{{ user.username }}</p>
          <svg class="icon icon-chevron-down">
            <use xlink:href="sprite.svg#icon-chevron-down"></use>
          </svg>
        </button>
        <div class="navbar__user-profile-dropdown-menu" v-if="jwt">
          <ul>
            <li>
              <router-link :to="'/profil/' + user.username.toLowerCase()"
                >Profil</router-link
              >
            </li>
            <li @click="logout">Déconnexion</li>
          </ul>
        </div>
      </div>
    </div>
    <button class="btn btn--menu">
      <svg class="icon icon-menu">
        <use xlink:href="sprite.svg#icon-menu"></use>
      </svg>
    </button>
  </nav>
</template>

<script>
import "animate.css";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["jwt", "user"])
  },
  methods: {
    showSignUpModal() {
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
            this.$store.commit("signUpModal/resetForm");
          } else {
            return false;
          }
        });
      }
    },
    showSignInModal() {
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
    },
    showDropdownMenu() {
      const profileBtn = document.querySelector(
        ".navbar__user-profile-dropdown-btn"
      );
      const profileDropdownMenu = document.querySelector(
        ".navbar__user-profile-dropdown-menu"
      );
      const iconChevronDown = document.querySelector(".icon-chevron-down");

      profileBtn.classList.toggle("active");

      if (profileBtn.classList.contains("active")) {
        iconChevronDown.style.transform = "rotate(180deg)";
        profileDropdownMenu.style.display = "block";

        // window.addEventListener("click", e => {
        //   if (e.target !== profileBtn) {
        //     console.log("ça déconne ici");
        //     profileBtn.classList.remove("active");
        //     iconChevronDown.style.transform = "rotate(0)";
        //     profileDropdownMenu.style.display = "none";
        //   } else {
        //     false;
        //   }
        // });

        // Ne pas oublier de fixer la flèche qui reste vers le haut quand on clique sur déconnexion
      } else {
        iconChevronDown.style.transform = "rotate(0)";
        profileDropdownMenu.style.display = "none";
      }
    },
    logout() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      this.$store.commit("setToken", null);
      this.$store.commit("setUser", null);
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 2rem;

  &_logo {
    margin-right: 1rem;
    color: $color-white;
    @media (max-width: 1024px) {
      font-size: 1.8rem;
    }
  }

  &_buttons {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .btn--menu {
    display: none;
    padding: 0 !important;

    @media (max-width: 768px) {
      display: block;
    }

    .icon-menu {
      fill: $color-white;
      height: 4rem;
      width: 4rem;
    }
  }

  .btn {
    transition: 0.2s ease-out;
    letter-spacing: 1px;
    font-size: 1.6rem;

    @media (max-width: 1024px) {
      font-size: 1.4rem;
    }
  }

  .btn:hover {
    letter-spacing: 2px;
  }

  &__sign-in-btn {
    margin-right: 5rem;
  }

  .btn-buy {
    margin-right: 5rem;
    background: $color-white;
    color: $color-black;
    text-transform: uppercase;
    padding: 1.2rem 2rem;
  }

  .btn-sell {
    background: none;
    color: $color-white;
    border: 1px solid $color-white;
    text-transform: uppercase;
    padding: 1.2rem 2rem;
  }

  &__sign-in-btn {
    padding: 0;
  }

  &__profile {
    position: relative;
  }

  &__user-profile-dropdown-btn {
    display: flex;
    align-items: center;
    font-size: 1.8rem;

    &:hover {
      letter-spacing: 1px;
    }
  }

  &__user-img {
    width: 100%;
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    margin-right: 1.5rem;
  }

  .icon-chevron-down {
    fill: $color-white;
    height: 2rem;
    width: 2rem;
    margin-left: 0.5rem;
  }

  &__user-profile-dropdown-menu {
    display: none;
    position: absolute;
    z-index: 100;
    left: -10px;
    right: -10px;
    top: 60px;
    background: #262626;
    border-radius: 0.5rem;

    ul {
      list-style: none;

      margin: 1rem 0;

      li {
        width: 100%;
        padding: 1rem 2rem;
        font-size: 1.5rem;
        cursor: pointer;

        &:hover {
          font-weight: 500;
        }
      }
    }
  }
}
</style>
