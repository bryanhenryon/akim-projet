<template>
  <div class="transaction-confirmation">
    <app-navbar></app-navbar>
    <div class="container">
      <div class="transaction-confirmation__main-message">
        <h1>
          Merci de votre achat !
        </h1>
        <div class="transaction-confirmation__download-info">
          Le téléchargement de la prod devrait bientôt se lancer
        </div>
      </div>

      <div class="transaction-confirmation__secondary-message">
        <div>
          Si le téléchargement ne se lance pas, cliquez sur le bouton ci-dessous
          :
        </div>
        <a
          v-if="purchasedSong"
          class="transaction-confirmation__download-song"
          :href="apiRoot + 'prods/song/' + purchasedSong.songName"
          :download="purchasedSong.originalSongName"
        >
          <span>Télécharger</span>
          <svg class="icon icon-file_download">
            <use xlink:href="sprite.svg#icon-file_download"></use>
          </svg>
        </a>
      </div>

      <div class="transaction-confirmation__get-help">
        Pour toute question concernant votre achat, veuillez contacter le
        propriétaire du site à l'adresse
        <a href="mailto:akim.beats@gmail.com">akim.beats@gmail.com</a> ou au
        <a href="tel:+33689315166">06 89 31 51 66</a>
      </div>

      <div class="transaction-confirmation__see-you-soon">À bientôt !</div>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default {
  computed: {
    ...mapGetters({
      successfulTransaction: "getSuccessfulTransaction",
      purchasedSong: "getPurchasedSong"
    }),
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    })
  },
  components: {
    "app-navbar": Navbar,
    "app-footer": Footer
  },
  created() {
    if (!this.purchasedSong) {
      this.$router.push("/");
      return;
    }
  },
  mounted() {
    const downloadSong = document.querySelector(
      ".transaction-confirmation__download-song"
    );
    if (downloadSong) {
      downloadSong.click();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.successfulTransaction) {
        vm.$router.push("/");
        return;
      }

      vm.$store.dispatch("setSuccessfulTransaction", false);
    });
  }
};
</script>

<style lang="scss" scoped>
.transaction-confirmation {
  display: flex;
  flex-direction: column;
  color: $color-white;
  background: linear-gradient(rgba(rgb(0, 0, 0), 0.7), rgba($color-black, 1)),
    url("../assets/img/profile-background.jpg") center center fixed;
  background-size: cover;
  padding: 0 6rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 0 2rem;
  }

  @media (max-width: 320px) {
    padding: 0 1rem;
  }

  .container {
    flex: 1;
  }

  &__main-message {
    margin-bottom: 5rem;
    h1 {
      margin-bottom: 1rem;

      @media (max-width: 480px) {
        font-size: 2rem;
      }
    }
  }

  &__download-info {
    @media (max-width: 480px) {
      font-size: 1.4rem;
    }
  }

  &__secondary-message {
    margin-bottom: 2rem;
    @media (max-width: 480px) {
      font-size: 1.4rem;
    }

    a {
      display: inline-flex;
      align-items: center;
      padding: 1rem 3rem;
      font-weight: 500;
      border-radius: 5px;
      margin: 2rem 0;
      text-decoration: none;
      color: $color-black;
      background: $color-white;
      transition: transform 0.1s ease-in-out;

      @media (max-width: 480px) {
        font-size: 1.4rem;
      }

      &:hover {
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(-1px);
      }

      .icon-file_download {
        height: 2.4rem;
        width: 2.4rem;
        margin-left: 0.5rem;

        @media (max-width: 480px) {
          height: 2.2rem;
          width: 2.2rem;
        }
      }
    }
  }

  &__get-help {
    margin-bottom: 2rem;

    @media (max-width: 480px) {
      font-size: 1.4rem;
    }

    a {
      color: inherit;
    }
  }

  &__see-you-soon {
    @media (max-width: 480px) {
      font-size: 1.4rem;
    }
  }
}

.container {
  max-width: 600px;
  margin: 10rem auto;
  text-align: center;

  @media (max-width: 768px) {
    margin: 5rem auto;
  }
}
</style>
