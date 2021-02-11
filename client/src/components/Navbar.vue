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
      <button v-if="!jwt" class="btn btn-sell" @click="showSignUpModal">
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
              :src="'http://localhost:3000/api/user/profile_picture/' + user.profilePicture || '/api/user/profile_picture/' + user.profilePicture"
              alt="Image de profil"
            />
          </div>
          <p v-if="user">{{ user.username }}</p>
          <svg class="icon icon-chevron-down--profile-dropdown-btn">
            <use xlink:href="sprite.svg#icon-chevron-down"></use>
          </svg>
        </button>
        <div class="navbar__user-profile-dropdown-menu" v-if="jwt">
          <ul>
            <router-link :to="'/profil/' + user.username.toLowerCase()">
              <svg class="icon icon-user">
                <use xlink:href="sprite.svg#icon-user"></use>
              </svg>
              Mon profil
            </router-link>
            <router-link to="/compte/infos">
              <svg class="icon icon-user">
                <svg class="icon icon-profile">
                  <use xlink:href="sprite.svg#icon-profile"></use>
                </svg>
              </svg>
              Mes informations
            </router-link>
            <router-link to="/compte/prods">
              <svg class="icon icon-music-notes">
                <use xlink:href="sprite.svg#icon-music-notes"></use>
              </svg>
              Mes prods
            </router-link>
            <li @click="logout">
              <svg class="icon icon-switch">
                <use xlink:href="sprite.svg#icon-switch"></use>
              </svg>
              Déconnexion
            </li>
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
            this.$store.dispatch("signInModal/resetForm");
          } else {
            return false;
          }
        });
      }
    },
    showDropdownMenu(e) {
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
    logout() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
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
    @media (max-width: 960px) {
      display: none;
    }
  }

  .btn--menu {
    display: none;
    padding: 0 !important;

    @media (max-width: 960px) {
      display: block;
    }

    .icon-menu {
      fill: $color-white;
      height: 4rem;
      width: 4rem;
    }
  }
  .btn-buy {
    margin-right: 5rem;
    background: $color-white;
    color: $color-black;
    text-transform: uppercase;
    padding: 1.2rem 2rem;
    transition: 0.2s ease-out;
    letter-spacing: 1px;
    font-size: 1.6rem;

    @media (max-width: 1024px) {
      font-size: 1.4rem;
    }

    &:hover {
      letter-spacing: 2px;
    }
  }

  .btn-sell {
    background: none;
    color: $color-white;
    border: 1px solid $color-white;
    text-transform: uppercase;
    padding: 1.2rem 2rem;
    transition: 0.2s ease-out;
    letter-spacing: 1px;
    font-size: 1.6rem;

    @media (max-width: 1024px) {
      font-size: 1.4rem;
    }

    &:hover {
      letter-spacing: 2px;
    }
  }

  &__sign-in-btn {
    padding: 0;
    margin-right: 5rem;
    font-size: 1.6rem;
    padding: 1.2rem 2rem;
    transition: 0.2s ease-out;
    letter-spacing: 1px;

    &:hover {
      letter-spacing: 2px;
    }

    @media (max-width: 1024px) {
      font-size: 1.4rem;
    }
  }

  &__profile {
    position: relative;
  }

  &__user-profile-dropdown-btn {
    display: flex;
    align-items: center;
    font-size: 1.8rem;

    * {
      pointer-events: none;
    }
  }

  &__user-img {
    width: 100%;
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    margin-right: 1.5rem;
    object-fit:cover;
  }

  .icon-chevron-down--profile-dropdown-btn {
    fill: $color-white;
    height: 2rem;
    width: 2rem;
    margin-left: 0.5rem;
    transition: transform 0.1s ease-in-out;
  }

  &__user-profile-dropdown-menu {
    display: none;
    position: absolute;
    z-index: 100;
    left: -50px;
    right: -10px;
    top: 60px;
    background: #262626;
    border-radius: 0.5rem;

    &::before {
      content: "";
      position: absolute;
      top: -10px;
      left: 70%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #262626;
      background: transparent;
    }

    ul {
      list-style: none;

      margin: 1rem 0;

      a,
      li {
        width: 100%;
        padding: 1rem 2rem;
        font-size: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        color: inherit;
        text-decoration: none;

        .icon-switch,
        .icon-user,
        .icon-music-notes,
        .icon-profile {
          width: 16px;
          height: 16px;
          fill: $color-white;
          margin-right: 10px;
        }

        &:hover {
          font-weight: 500;
        }
      }
    }
  }
}
</style>
