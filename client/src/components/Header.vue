<template>
  <header class="header">
    <app-navbar />
    <div class="header-content-wrapper">
      <app-social></app-social>
      <app-search></app-search>
    </div>
    <app-scroll-cta></app-scroll-cta>
  </header>
</template>

<script>
import Navbar from "./Navbar";
import Social from "./Header/Social";
import Search from "./Header/Search";
import ScrollCTA from "./Header/ScrollCTA";

export default {
  components: {
    "app-navbar": Navbar,
    "app-social": Social,
    "app-search": Search,
    "app-scroll-cta": ScrollCTA
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(rgba(rgb(0, 0, 0), 0.2), rgba($color-black, 1)),
    url("../../public/img/header-bg2.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  box-shadow: inset 1rem 3rem 10rem 1rem $color-black;
  padding: 3rem 6rem;

  @media (max-width: 680px) {
    padding: 2rem 2rem;
  }

  .header-content-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    margin: 10rem 0;
  }
}
</style>
