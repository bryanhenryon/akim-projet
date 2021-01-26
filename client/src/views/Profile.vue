<template>
  <div class="profile" v-if="user">
    <app-navbar></app-navbar>
    <h1>Profil de {{ user.username }}</h1>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "../components/Navbar";

export default {
  data() {
    return {
      user: null
    };
  },
  components: {
    "app-navbar": Navbar
  },
  created() {
    axios
      .get("/api/users/" + this.$route.params.username)
      .then(res => {
        if (res.data === null) this.$router.push("/"); // rediriger vers page 404
        this.user = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss" scoped>
.profile {
  color: $color-white;

  padding: 3rem 6rem;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 320px) {
    padding: 3rem 1rem;
  }

  h1 {
    margin: 20rem 0;
    text-align: center;
  }
}
</style>
