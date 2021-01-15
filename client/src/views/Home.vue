<template>
  <div class="home">
    <app-header></app-header>
    <app-previews></app-previews>
  </div>
</template>

<script>
import Header from "../components/Header";
import Previews from "../components/Previews";
export default {
  components: {
    "app-header": Header,
    "app-previews": Previews
  }
};
</script>

<style lang="scss">
.home {
  color: $color-white;
}
</style>
