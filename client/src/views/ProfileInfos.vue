<template>
  <div class="profile-infos">
    <app-navbar></app-navbar>
    <div class="container">
      <div class="profile-navigation">
        <button
          @click="switchToMyInfosComponent"
          class="btn profile-navigation__my-infos active"
        >
          Mes informations
        </button>
        <button
          @click="switchToNewPasswordComponent"
          class="btn profile-navigation__password"
        >
          Mot de passe
        </button>
      </div>
      <component :is="component"></component>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import MyInfos from "../components/ProfileInfos/MyInfos";
import NewPassword from "../components/ProfileInfos/NewPassword";
import Footer from "../components/Footer";
export default {
  data() {
    return {
      component: "app-my-infos"
    };
  },
  components: {
    "app-navbar": Navbar,
    "app-my-infos": MyInfos,
    "app-new-password": NewPassword,
    "app-footer": Footer
  },
  methods: {
    switchToNewPasswordComponent() {
      this.component = "app-new-password";

      const profileNavigationPassword = document.querySelector(
        ".profile-navigation__password"
      );
      profileNavigationPassword.classList.add("active");

      const profileNavigationMyInfos = document.querySelector(
        ".profile-navigation__my-infos"
      );
      profileNavigationMyInfos.classList.remove("active");
    },
    switchToMyInfosComponent() {
      this.component = "app-my-infos";

      const profileNavigationMyInfos = document.querySelector(
        ".profile-navigation__my-infos"
      );
      profileNavigationMyInfos.classList.add("active");

      const profileNavigationPassword = document.querySelector(
        ".profile-navigation__password"
      );
      profileNavigationPassword.classList.remove("active");
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-infos {
  color: $color-white;
  padding: 3rem 6rem;
  background: linear-gradient(rgba(rgb(0, 0, 0), 0.7), rgba($color-black, 1)),
    url("../assets/img/profile-background.jpg") center center fixed;
  background-size: cover;
  padding: 3rem 6rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 320px) {
    padding: 3rem 1rem;
  }
}

.container {
  max-width: 400px;
  margin: 10rem auto;

  h1 {
    font-weight: 400;
  }
}

.profile-navigation {
  display: flex;
  margin-bottom: 5rem;

  &__my-infos,
  &__password {
    font-size: 1.5rem;
    flex: 1;
    border-bottom: 3px solid rgba($color-white, 0.6);
    text-align: center;
    color: rgba($color-white, 0.6);
    text-decoration: none;
    padding-bottom: 1rem;

    &.active {
      color: $color-white;
      border-bottom: 3px solid $color-white;
    }
  }
}
</style>
