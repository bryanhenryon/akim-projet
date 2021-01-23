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
        <form class="sign-in-modal__form" @submit.prevent="signIn">
          <div class="sign-in-modal__form-group">
            <svg class="icon icon-user">
              <use xlink:href="sprite.svg#icon-user"></use>
            </svg>
            <label for="sign-in-username" class="sign-in-modal__label"
              >Pseudo</label
            >
            <input
              type="text"
              name="username"
              id="sign-in-username"
              class="sign-in-modal__text-input"
              placeholder="Entrez votre pseudo"
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
            />
          </div>
          <button class="btn sign-in-modal__sign-in-btn">Se connecter</button>
        </form>
        <div class="sign-in-modal__not-registered">
          Pas encore inscris ?
          <button class="btn sign-in-modal__sign-up-btn">Cliquez-ici !</button>
        </div>

        <a href="#" class="sign-in-modal__forgotten-password"
          >Mot de passe oublié ?</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import "animate.css";
export default {
    methods: {
        closeSignInModal() {
            document.querySelector(".sign-in-modal").classList.remove("active");
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
