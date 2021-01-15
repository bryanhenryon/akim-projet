<template>
  <div class="home">
    <app-header></app-header>
    <app-previews></app-previews>
    <app-footer></app-footer>
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
}
</style>
