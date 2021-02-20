<template>
  <div class="mobile-navbar">
    <div class="mobile-navbar__content">
      <div class="d-flex justify-content-end w-100">
        <button @click="toggleMobileNavbar" class="btn">
          <svg class="icon icon-cross">
            <use xlink:href="sprite.svg#icon-cross"></use>
          </svg>
        </button>
      </div>
      <div class="mobile-navbar__main-content">
        <div class="navbar_links">
          <div v-if="jwt" class="navbar__user-img-container">
            <img
              class="navbar__user-img"
              :src="apiRoot + 'user/profile_picture/' + user.profilePicture"
              alt="Image de profil"
            />
          </div>
          <router-link
            :to="{ name: 'Home' }"
            class="navbar_link navbar_link--home active"
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
            <div class="navbar__user-profile-dropdown-menu" v-if="jwt">
              <ul>
                <router-link :to="'/profil/' + user.username.toLowerCase()">
                  <svg class="icon icon-user">
                    <use xlink:href="sprite.svg#icon-user"></use>
                  </svg>
                  Mon profil
                </router-link>
                <router-link to="/compte/infos">
                  <svg class="icon icon-profile">
                    <use xlink:href="sprite.svg#icon-profile"></use>
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
      </div>
      <div>
        <app-social class="mobile"></app-social>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Social from "./Header/Social";

export default {
  computed: {
    ...mapState(["jwt", "user"]),
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    })
  },
  methods: {
    ...mapActions({
      toggleMobileNavbar: "navbar/toggleMobileNavbar",
      showSignUpModal: "navbar/showSignUpModal",
      showSignInModal: "navbar/showSignInModal",
      logout: "navbar/logout"
    })
  },
  components: {
    "app-social": Social
  }
};
</script>

<style lang="scss" scoped>
.mobile-navbar {
  background: rgba($color: $color-black, $alpha: 0.9);
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: transform 0.2s ease-in-out;
  transform: translateY(-100vh);

  &.active {
    transform: translateY(0);
  }

  @media (min-width: 1400px) {
    display: none;
    transform: translateY(-100vh);
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100vh;

    padding: 3rem;

    .icon-cross {
      fill: $color-white;
      height: 3.6rem;
      width: 3.6rem;
    }
  }

  &__main-content {
    overflow: auto;
    margin: 2rem 0;
    width: 100%;
    max-width: 300px;

    .navbar_links {
      display: flex;
      align-items: center;
      flex-direction: column;

      &::after {
        content: "";
        height: 1px;
        width: 50px;
        background: $color-white;
        opacity: 0.8;
        margin: 5rem 0;
      }

      .navbar_link {
        margin-bottom: 5rem;
      }

      .navbar_link--home,
      .navbar_link--see-prods {
        position: relative;
        color: inherit;
        text-decoration: none;
      }

      .navbar_link:last-child {
        margin-bottom: 0rem;
      }

      .navbar__user-img {
        width: 100%;
        border-radius: 50%;
        width: 8rem;
        height: 8rem;
        margin-bottom: 3rem;

        object-fit: cover;
      }
    }

    .navbar_buttons {
      display: flex;
      flex-direction: column;
      align-items: center;

      .navbar__sign-in-btn {
        padding: 0;
        font-size: 1.6rem;
        padding: 1.2rem 2rem;
        transition: 0.2s ease-out;
        letter-spacing: 1px;
        margin-bottom: 3rem;

        &:hover {
          letter-spacing: 2px;
        }

        @media (max-width: 1024px) {
          font-size: 1.4rem;
        }
      }

      .btn-buy {
        background: $color-white;
        color: $color-black;
        text-transform: uppercase;
        padding: 1.2rem 2rem;
        transition: 0.2s ease-out;
        letter-spacing: 1px;
        font-size: 1.6rem;
        margin-bottom: 3rem;

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

      .navbar__user-profile-dropdown-menu {
        ul {
          list-style: none;
          a,
          li {
            text-align: center;
            width: 100%;
            margin-bottom: 5rem;
            font-size: 1.6rem;
            cursor: pointer;
            display: block;
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
  }
}
</style>
