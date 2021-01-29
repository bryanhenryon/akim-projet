<template>
  <div class="profile" v-if="user">
    <app-navbar></app-navbar>
    <h1>Profil de {{ user.username }}</h1>
    <form class="new-prod" @submit.prevent="addProd">
      <label for="title">Titre de la prod</label>
      <input type="text" name="title" id="title" v-model="prod.title" />

      <label for="song">Prod (mp3 ou wav)</label>
      <input type="file" name="song" id="song" @change="loadSongFile" />

      <label for="artist">Artiste</label>
      <input type="text" name="artist" id="artist" v-model="prod.artist" />

      <label for="cover">Cover</label>
      <input type="file" name="cover" id="cover" @change="loadCoverFile" />

      <label for="genres">Genres</label>
      <input type="text" name="genres" id="genres" v-model="prod.genres" />

      <label for="price">Prix</label>
      <input type="text" name="price" id="price" v-model="prod.price" />

      <label for="max-streams">Max streams</label>
      <input
        type="number"
        name="max-streams"
        id="max-streams"
        v-model="prod.maxStreams"
      />
      
      <button type="submit">Ajouter la prod</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "../components/Navbar";

export default {
  data() {
    return {
      user: null,
      prod: {
        title: null,
        song: null,
        artist: null,
        cover: null,
        genres: null,
        price: null,
        maxStreams: null
      }
    };
  },
  components: {
    "app-navbar": Navbar
  },
  methods: {
    loadCoverFile(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.prod.cover = files[0];
    },
    loadSongFile(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.prod.song = files[0];
    },
    addProd() {
      const bodyFormData = new FormData();
      bodyFormData.append("title", this.prod.title);
      bodyFormData.append("song", this.prod.song);
      bodyFormData.append("artist", this.prod.artist);
      bodyFormData.append("cover", this.prod.cover);
      bodyFormData.append("genres", this.prod.genres);
      bodyFormData.append("price", this.prod.price);
      bodyFormData.append("maxStreams", this.prod.maxStreams);

      axios({
        method: "post",
        url: "/api/prods",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(function() {
          console.log("Prod ajoutée");
        })
        .catch(function(err) {
          console.log(err);
        });
    }
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

  label {
    display: block;
    margin: 5rem;
  }
}
</style>
