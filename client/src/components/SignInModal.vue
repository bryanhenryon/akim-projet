<template>
  <div class="sign-in-modal">
    <div class="sign-in-modal__content">
      <button
        class="btn sign-in-modal__close-modal-btn"
        @click="closeSignInModal"
      >
        <svg class="icon icon-cross">
          <use xlink:href="sprite.svg#icon-cross"></use>
        </svg>
      </button>
      <div class="sign-in-modal__content-wrapper">
        <h2 class="sign-in-modal__header">Connexion</h2>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div
          v-if="passwordSuccessfullyReset && !errorMessage"
          class="password-successfully-reset"
        >
          Votre mot de passe a correctement été modifié, vous pouvez à présent
          vous connecter
        </div>
        <form class="sign-in-modal__form" @submit.prevent="signIn">
          <div class="sign-in-modal__form-group">
            <svg class="icon icon-email">
              <use xlink:href="sprite.svg#icon-email"></use>
            </svg>
            <label for="sign-in-email" class="sign-in-modal__label"
              >Email</label
            >
            <input
              type="text"
              name="email"
              id="sign-in-email"
              class="sign-in-modal__text-input"
              placeholder="Entrez votre email"
              v-model="email"
            />
          </div>

          <div class="sign-in-modal__form-group">
            <svg class="icon icon-lock">
              <use xlink:href="sprite.svg#icon-lock"></use>
            </svg>
            <label for="sign-in-password" class="sign-in-modal__label"
              >Mot de passe</label
            >
            <input
              type="password"
              name="password"
              id="sign-in-password"
              class="sign-in-modal__text-input"
              placeholder="Entrez votre mot de passe"
              v-model="password"
            />
          </div>
          <button
            :disabled="isLoading"
            class="btn sign-in-modal__sign-in-btn"
            @click="signIn"
          >
            <span v-if="!isLoading">Se connecter</span>
            <app-facebook-spinner v-else></app-facebook-spinner>
          </button>
        </form>
        <div class="sign-in-modal__not-registered">
          Pas encore inscris ?
          <button
            class="btn sign-in-modal__sign-up-btn"
            @click="showSignUpModal"
          >
            Cliquez-ici !
          </button>
        </div>

        <button
          class="btn sign-in-modal__forgotten-password"
          @click="showForgottenPasswordModal"
        >
          Mot de passe oublié ?
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import FacebookSpinner from "./spinners/FacebookSpinner";
import { mapFields } from "vuex-map-fields";
import { mapGetters } from "vuex";
import axios from "axios";
import "animate.css";
export default {
  data() {
    return {
      isLoading: false
    };
  },
  components: {
    "app-facebook-spinner": FacebookSpinner
  },
  computed: {
    ...mapGetters("signInModal", {
      errorMessage: "getErrorMessage",
      passwordSuccessfullyReset: "getPasswordSuccessfullyReset"
    }),
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    }),
    ...mapFields("signInModal", ["email", "password"])
  },
  methods: {
    signIn() {
      this.isLoading = true;
      axios
        .post(this.apiRoot + "users/login", {
          email: this.email,
          password: this.password
        })
        .then(res => {
          this.isLoading = false;
          this.$store.dispatch("signInModal/resetForm");

          localStorage.setItem("jwt", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          this.$store.dispatch("setToken", localStorage.getItem("jwt"));
          this.$store.dispatch(
            "setUser",
            JSON.parse(localStorage.getItem("user"))
          );

          const signInModal = document.querySelector(".sign-in-modal");
          signInModal.classList.remove("active");
        })
        .catch(error => {
          this.isLoading = false;
          this.$store.dispatch(
            "signInModal/setErrorMessage",
            error.response.data.error
          );
        });
    },
    closeSignInModal() {
      document.querySelector(".sign-in-modal").classList.remove("active");
      this.$store.dispatch("signInModal/resetForm");
      this.$store.dispatch("signInModal/setPasswordSuccessfullyResetToFalse");
    },
    showSignUpModal() {
      const signUpModal = document.querySelector(".sign-up-modal");
      const signUpModalContent = document.querySelector(
        ".sign-up-modal__content"
      );
      const signInModal = document.querySelector(".sign-in-modal");

      signUpModalContent.classList.remove(
        "animate__animated",
        "animate__slideInDown",
        "animate__faster"
      );

      signInModal.classList.remove("active");
      signUpModal.classList.add("active");

      this.$store.dispatch("signInModal/resetForm");

      if (signUpModal.classList.contains("active")) {
        window.addEventListener("click", e => {
          if (e.target === signUpModal) {
            signUpModal.classList.remove("active");
          } else {
            return false;
          }
        });
      }
    },
    showForgottenPasswordModal() {
      const forgottenPasswordModal = document.querySelector(
        ".forgotten-password-modal"
      );
      forgottenPasswordModal.classList.add("active");

      const signInModal = document.querySelector(".sign-in-modal");
      signInModal.classList.remove("active");
      this.$store.dispatch("signInModal/resetForm");

      if (forgottenPasswordModal.classList.contains("active")) {
        window.addEventListener("click", e => {
          if (e.target === forgottenPasswordModal) {
            forgottenPasswordModal.classList.remove("active");
          } else {
            return false;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sign-in-modal {
  display: none;
  color: $color-white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8);

  &.active {
    display: block;
  }

  &__close-modal-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    padding: 1rem;
  }

  .icon-cross {
    fill: $color-white;
    height: 35px;
    width: 35px;
  }

  .icon-lock {
    height: 15px;
    width: 15px;
    fill: #474646;
    position: absolute;
    top: 35px;
    left: 10px;
  }

  &__content {
    margin: 10% auto;
    background: #181818;
    width: 95%;
    max-width: 450px;
    border-radius: 5px;

    @media (max-width: 480px) {
      max-width: 100%;
    }
  }

  &__content-wrapper {
    width: 100%;
    margin: 0 auto;
    max-width: 400px;
    padding: 0 3rem 3rem 3rem;

    @media (max-width: 350px) {
      padding: 0 1.5rem 3rem 1.5rem;
    }
  }

  &__header {
    font-size: 3.2rem;
    margin-bottom: 3rem;
  }

  .error-message {
    background-color: #f2dede;
    border-color: #ebccd1;
    color: #a94442;
    padding: 15px;
    border: 1px solid transparent;
    border-radius: 4px;
    text-align: center;
  }

  .password-successfully-reset {
    background-color: #c9f9d5;
    border-color: #ebccd1;
    color: #4f8c5d;
    padding: 15px;
    border: 1px solid transparent;
    border-radius: 4px;
    text-align: center;
  }

  &__form-group {
    margin: 3rem auto;
    position: relative;
  }

  .icon-email {
    height: 15px;
    width: 15px;
    fill: #474646;
    position: absolute;
    top: 34px;
    left: 10px;
  }

  &__label {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  &__text-input {
    border-radius: 2px;
    border: none;
    outline: none;
    padding: 1rem 4rem;
    margin: 0 auto;
    width: 100%;
    letter-spacing: 0.2px;
    font-size: 1.4rem;
    font-family: "Roboto";
  }

  &__input-error-message {
    color: #ff5367;
    font-size: 1.4rem;
    margin: 5px 0;
  }

  &__sign-in-btn {
    background: #ff3a51;
    color: $color-white;
    width: 100%;
    font-size: 1.4rem;
    padding: 1.5rem 3rem;
    margin-bottom: 3rem;
    border-radius: 5px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__not-registered {
    font-size: 1.4rem;
    text-align: center;
  }

  &__sign-up-btn {
    text-decoration: underline;
  }

  &__forgotten-password {
    font-size: 1.4rem;
    text-align: center;
    margin: 0 auto;
    margin-top: 2rem;
    display: block;
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
