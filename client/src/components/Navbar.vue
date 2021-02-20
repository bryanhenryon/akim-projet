<template>
  <nav class="navbar">
    <div class="navbar_link navbar_logo">LOGO / NOM DU SITE</div>
    <div class="navbar_links">
      <router-link :to="{ name: 'Home' }" class="navbar_link navbar_link--home"
        >Accueil</router-link
      >
      <router-link
        :to="{ name: 'Prods' }"
        class="navbar_link navbar_link--see-prods"
        >Parcourir les prods</router-link
      >
    </div>
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
          @click="toggleDropdownMenu"
        >
          <div class="navbar__user-img-container">
            <img
              class="navbar__user-img"
              :src="apiRoot + 'user/profile_picture/' + user.profilePicture"
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
    <button @click="toggleMobileNavbar" class="btn btn--menu">
      <svg class="icon icon-menu">
        <use xlink:href="sprite.svg#icon-menu"></use>
      </svg>
    </button>
    <app-mobile-navbar></app-mobile-navbar>
  </nav>
</template>

<script>
import "animate.css";
import { mapState, mapGetters, mapActions } from "vuex";
import MobileNavbar from "./MobileNavbar";

export default {
  computed: {
    ...mapState(["jwt", "user"]),
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    })
  },
  components: {
    "app-mobile-navbar": MobileNavbar
  },
  methods: {
    ...mapActions({
      toggleMobileNavbar: "navbar/toggleMobileNavbar",
      showSignUpModal: "navbar/showSignUpModal",
      showSignInModal: "navbar/showSignInModal",
      toggleDropdownMenu: "navbar/toggleDropdownMenu",
      logout: "navbar/logout"
    })
  },
  mounted() {
    const navLinks = document.querySelectorAll(".navbar_link");
    const currentLocation = window.location.href.replace(
      /^http[s]?:\/\/.+?\//,
      ""
    );

    for (let navLink of navLinks) {
      if (navLink.getAttribute("href") === "/" + currentLocation) {
        navLink.classList.add("active");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &_logo {
    margin-right: 1rem;
    color: $color-white;
    @media (max-width: 1024px) {
      font-size: 1.8rem;
    }
  }

  &_links {
    display: flex;
    align-items: center;
    @media (max-width: 800px) {
      display: none;
    }
  }

  &_link {
    margin-right: 5rem;
    font-size: 1.6rem;
    letter-spacing: 1px;
  }

  &_link--home,
  &_link--see-prods {
    position: relative;
    color: inherit;
    text-decoration: none;
    transition: 0.2s;
    padding: 1rem 2rem;

    &.active {
      &:before {
        content: "";
        border-bottom: 2px solid $color-white;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        transform: translateY(10px);
      }
    }
  }

  &_buttons {
    @media (max-width: 1400px) {
      display: none;
    }
  }

  .btn--menu {
    display: none;
    padding: 0 !important;

    @media (max-width: 1400px) {
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
    object-fit: cover;
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
