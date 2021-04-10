<template>
  <div class="forgotten-password-modal">
    <div class="forgotten-password-modal__content">
      <button
        class="btn forgotten-password-modal__close-modal-btn"
        @click="closeForgottenPasswordModal"
      >
        <svg class="icon icon-cross">
          <use xlink:href="sprite.svg#icon-cross"></use>
        </svg>
      </button>
      <div class="forgotten-password-modal__content-wrapper">
        <h2 class="forgotten-password-modal__header">
          Réinitialiser le mot de passe
        </h2>
        <form
          class="forgotten-password-modal__form"
          @submit.prevent="resetPassword"
        >
          <div class="forgotten-password-modal__form-group">
            <label
              for="forgotten-password-email"
              class="forgotten-password-modal__label"
              >Indiquez votre email afin de recevoir un lien de
              réinitialisation</label
            >
            <svg class="icon icon-email">
              <use xlink:href="sprite.svg#icon-email"></use>
            </svg>
            <input
              type="text"
              name="email"
              id="forgotten-password-email"
              class="forgotten-password-modal__text-input"
              placeholder="Entrez votre email"
              v-model="email"
            />
            <div
              v-if="errorMessage"
              class="forgotten-password-modal__input-error-message"
            >
              {{ errorMessage }}
            </div>
          </div>
          <button
            :disabled="isLoading"
            class="btn forgotten-password-modal__forgotten-password-btn"
          >
            <span v-if="!isLoading">Envoyer</span>
            <app-facebook-spinner v-else></app-facebook-spinner>
          </button>
        </form>

        <div class="forgotten-password-modal__not-registered">
          Pas encore inscris ?
          <button
            class="btn forgotten-password-modal__sign-up-btn"
            @click="showSignUpModal"
          >
            Cliquez-ici !
          </button>
        </div>

        <button
          class="btn forgotten-password-modal__sign-in"
          @click="showSignInModal"
        >
          Se connecter
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import FacebookSpinner from "./spinners/FacebookSpinner";

export default {
  data() {
    return {
      email: "",
      isLoading: false,
      errorMessage: null
    };
  },
  methods: {
    resetForgottenPasswordForm() {
      this.email = "";
      this.errorMessage = "";
    },
    resetPassword() {
      if (this.email === "") {
        return (this.errorMessage = "Veuillez indiquer votre email");
      } else {
        this.errorMessage = "";
      }
    },

    closeForgottenPasswordModal() {
      document
        .querySelector(".forgotten-password-modal")
        .classList.remove("active");
      this.resetForgottenPasswordForm();
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

      this.resetForgottenPasswordForm();

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

    showSignInModal() {
      const signInModal = document.querySelector(".sign-in-modal");
      const signInModalContent = document.querySelector(
        ".sign-in-modal__content"
      );
      const signUpModal = document.querySelector(".sign-up-modal");

      signInModalContent.classList.remove(
        "animate__animated",
        "animate__slideInDown",
        "animate__faster"
      );

      signInModal.classList.add("active");
      signUpModal.classList.remove("active");

      this.resetForgottenPasswordForm();

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
  },
  components: {
    "app-facebook-spinner": FacebookSpinner
  }
};
</script>

<style lang="scss" scoped>
.forgotten-password-modal {
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

  &__form-group {
    margin: 3rem auto;
    position: relative;
  }

  .icon-email {
    height: 15px;
    width: 15px;
    fill: #474646;
    position: absolute;
    top: 57px;
    left: 12px;
  }

  &__label {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 1rem;
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

  &__forgotten-password-btn {
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

  &__sign-in {
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
