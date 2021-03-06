<template>
  <footer class="footer">
    &copy; {{ copyrightYear }} Setbon Akim &mdash;
    <router-link to="/mentions-legales" class="legal-notices-link"
      >Mentions légales</router-link
    >
  </footer>
</template>

<script>
export default {
  data() {
    return {
      copyrightYear: new Date().getFullYear()
    };
  }
};
</script>

<style lang="scss" scoped>
.footer {
  text-align: center;
  margin: 5rem auto 3rem auto;
  font-size: 1.4rem;

  .legal-notices-link {
    color: $color-white;
  }
}
</style>
