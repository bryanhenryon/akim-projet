<template>
  <div class="home">
    <app-header></app-header>
    <div class="home__container">
      <app-previews></app-previews>
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header";
import Previews from "../components/Previews";
import Footer from "../components/Footer";

export default {
  components: {
    "app-header": Header,
    "app-previews": Previews,
    "app-footer": Footer
  }
};
</script>

<style lang="scss">
.home {
  color: $color-white;

  &__container {
    padding: 3rem 6rem;

    @media (max-width: 768px) {
      padding: 3rem 2rem;
    }

    @media (max-width: 320px) {
      padding: 3rem 1rem;
    }
  }
}
</style>
