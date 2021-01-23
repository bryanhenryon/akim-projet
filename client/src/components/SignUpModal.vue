<template>
  <div class="sign-up-modal">
    <div
      class="sign-up-modal__content  animate__animated animate__slideInDown animate__faster"
    >
      <button
        class="btn sign-up-modal__close-modal-btn"
        @click="closeSignUpModal"
      >
        <svg class="icon icon-cross">
          <use xlink:href="sprite.svg#icon-cross"></use>
        </svg>
      </button>
      <div class="sign-up-modal__content-wrapper">
        <h2 class="sign-up-modal__header">Inscription</h2>
        <form @submit.prevent="signUp" class="sign-up-modal__form">
          <div class="sign-up-modal__form-group">
            <svg class="icon icon-user">
              <use xlink:href="sprite.svg#icon-user"></use>
            </svg>
            <label for="username" class="sign-up-modal__label">Pseudo</label>
            <input
              type="text"
              name="username"
              id="username"
              class="sign-up-modal__text-input"
              placeholder="Choisissez un pseudo"
              v-model.trim="username"
            />
            <div
              class="sign-up-modal__input-error-message"
              v-if="usernameErrorMessage"
            >
              {{ usernameErrorMessage }}
            </div>
          </div>

          <div class="sign-up-modal__form-group">
            <svg class="icon icon-email">
              <use xlink:href="sprite.svg#icon-email"></use>
            </svg>
            <label for="email" class="sign-up-modal__label">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              class="sign-up-modal__text-input"
              placeholder="Entrez votre email"
              v-model.trim="email"
            />
            <div
              class="sign-up-modal__input-error-message"
              v-if="emailErrorMessage"
            >
              {{ emailErrorMessage }}
            </div>
          </div>

          <div class="sign-up-modal__form-group">
            <svg class="icon icon-lock">
              <use xlink:href="sprite.svg#icon-lock"></use>
            </svg>
            <label for="password" class="sign-up-modal__label"
              >Mot de passe</label
            >
            <input
              type="password"
              name="password"
              id="password"
              class="sign-up-modal__text-input"
              placeholder="Entrez votre mot de passe"
              v-model.trim="password"
            />
            <div
              class="sign-up-modal__input-error-message"
              v-if="passwordErrorMessage"
            >
              {{ passwordErrorMessage }}
            </div>
          </div>

          <div class="sign-up-modal__form-group">
            <svg class="icon icon-lock">
              <use xlink:href="sprite.svg#icon-lock"></use>
            </svg>
            <label for="confirm-password" class="sign-up-modal__label"
              >Confirmer le mot de passe</label
            >
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              class="sign-up-modal__text-input"
              placeholder="Confirmez votre mot de passe"
              v-model.trim="confirmPassword"
            />
            <div
              class="sign-up-modal__input-error-message"
              v-if="confirmPasswordErrorMessage"
            >
              {{ confirmPasswordErrorMessage }}
            </div>
          </div>

          <button type="submit" class="btn sign-up-modal__sign-up-btn">
            S'enregistrer
          </button>
        </form>
        <div class="sign-up-modal__already-registered">
          Déjà un compte ?
          <button
            class="btn sign-up-modal__sign-in-btn"
            @click="showSignInModal"
          >
            Connectez-vous
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "animate.css";
import axios from "axios";
import { mapFields } from "vuex-map-fields";

export default {
  computed: {
    ...mapFields("signUpModal", [
      "username",
      "email",
      "password",
      "confirmPassword",
      "usernameErrorMessage",
      "emailErrorMessage",
      "passwordErrorMessage",
      "confirmPasswordErrorMessage"
    ])
  },
  methods: {
    closeSignUpModal() {
      const signUpModal = document.querySelector(".sign-up-modal");
      signUpModal.classList.remove("active");
      this.$store.commit("signUpModal/resetForm");
    },
    signUp() {
      this.validateUsername();
      this.validateEmail();
      this.validatePassword();
      this.validateConfirmPassword();

      if (
        this.validateUsername() &&
        this.validateEmail() &&
        this.validatePassword() &&
        this.validateConfirmPassword()
      ) {
        axios
          .post("/api/users", {
            username: this.username,
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword
          })
          .then(() => {
            const signUpModal = document.querySelector(".sign-up-modal");
            signUpModal.classList.remove("active");
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    validateUsername() {
      if (this.username === "") {
        this.$store.commit(
          "signUpModal/setUsernameErrorMessage",
          "Veuillez indiquer un pseudo"
        );
        return false;
      } else if (this.username.length > 20) {
        this.$store.commit(
          "signUpModal/setUsernameErrorMessage",
          "Le pseudo doit être de 20 caractères maximum"
        );
        return false;
      } else {
        this.$store.commit("signUpModal/setUsernameErrorMessage", "");
      }

      return true;
    },
    validateEmail() {
      const regex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      const checkedEmail = regex.test(this.email);

      if (this.email === "") {
        this.$store.commit(
          "signUpModal/setEmailErrorMessage",
          "Veuillez indiquer une adresse email"
        );
        return false;
      } else if (!checkedEmail) {
        this.$store.commit(
          "signUpModal/setEmailErrorMessage",
          "L'adresse email indiquée est incorrecte"
        );
        return false;
      } else {
        this.$store.commit("signUpModal/setEmailErrorMessage", "");
      }

      return true;
    },
    validatePassword() {
      if (this.password === "") {
        this.$store.commit(
          "signUpModal/setPasswordErrorMessage",
          "Veuillez indiquer un mot de passe"
        );
        return false;
      } else if (this.password.length < 6) {
        this.$store.commit(
          "signUpModal/setPasswordErrorMessage",
          "Le mot de passe doit être d'au moins 6 caractères"
        );
        return false;
      } else {
        this.$store.commit("signUpModal/setPasswordErrorMessage", "");
      }

      return true;
    },
    validateConfirmPassword() {
      if (this.confirmPassword === "") {
        this.$store.commit(
          "signUpModal/setConfirmPasswordErrorMessage",
          "Veuillez confirmer votre mot de passe"
        );
        return false;
      } else if (this.confirmPassword !== this.password) {
        this.$store.commit(
          "signUpModal/setConfirmPasswordErrorMessage",
          "Les mots de passe ne correspondent pas"
        );
        return false;
      } else {
        this.$store.commit("signUpModal/setConfirmPasswordErrorMessage", "");
      }

      return true;
    },
    showSignInModal() {
      const signInModal = document.querySelector(".sign-in-modal");
      const signUpModal = document.querySelector(".sign-up-modal");

      signInModal.classList.add("active");
      signUpModal.classList.remove("active");

      this.$store.commit("signUpModal/resetForm");

      if (signInModal.classList.contains("active")) {
        window.addEventListener("click", e => {
          if (e.target === signInModal) {
            signInModal.classList.remove("active");
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
.sign-up-modal {
  color: $color-white;
  display: none;
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

    .icon-cross {
      fill: $color-white;
      height: 35px;
      width: 35px;
    }
  }

  &__content {
    margin: 5% auto;
    background: #181818;
    width: 95%;
    max-width: 450px;
    border-radius: 5px;

    @media (max-width: 480px) {
      margin: 0;
      width: 100%;
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
    font-size: 3.6rem;

    margin-bottom: 3rem;
  }

  &__form-group {
    margin: 3rem auto;
    position: relative;
  }

  .icon-user {
    height: 17px;
    width: 17px;
    fill: #474646;
    position: absolute;
    top: 32px;
    left: 10px;
  }

  .icon-email,
  .icon-lock {
    height: 15px;
    width: 15px;
    fill: #474646;
    position: absolute;
    top: 35px;
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

  &__sign-up-btn {
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

  &__already-registered {
    font-size: 1.4rem;
    text-align: center;
  }

  &__sign-in-btn {
    text-decoration: underline;
  }
}
</style>
