<template>
  <nav class="navbar">
    <div class="navbar_logo">LOGO / NOM DU SITE</div>
    <div class="navbar_buttons">
      <button class="btn btn-buy" @click="showSignUpModal">
        Achète des prods
      </button>
      <button class="btn btn-sell">
        Vends des prods
      </button>
    </div>
    <button class="btn btn--menu">
      <svg class="icon icon-menu">
        <use xlink:href="sprite.svg#icon-menu"></use>
      </svg>
    </button>
  </nav>
</template>

<script>
export default {
  methods: {
    showSignUpModal() {
      const signUpModal = document.querySelector(".sign-up-modal");

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
    padding: 1.2rem 2rem;
    text-transform: uppercase;
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

  .btn-buy {
    margin-right: 5rem;
    background: $color-white;
    color: $color-black;
  }

  .btn-sell {
    background: none;
    color: $color-white;
    border: 1px solid $color-white;
  }
}
</style>
