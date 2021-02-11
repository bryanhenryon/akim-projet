<template>
  <section class="prods">
    <app-navbar />
    <app-prods-list></app-prods-list>
    <app-player></app-player>
    <app-footer></app-footer>
  </section>
</template>

<script>
import Navbar from "../components/Navbar";
import ProdsList from "../components/ProdsList";
import Player from "../components/Player";
import Footer from "../components/Footer";

export default {
  components: {
    "app-navbar": Navbar,
    "app-prods-list": ProdsList,
    "app-player": Player,
    "app-footer": Footer
  }
};
</script>

<style lang="scss" scoped>
.prods {
  color: $color-white;
  padding: 3rem 6rem;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 320px) {
    padding: 3rem 1rem;
  }
}
</style>
