<template>
  <div class="add-prod">
    <app-navbar></app-navbar>
    <div class="container">
      <h1>Ajouter une prod</h1>
      <form class="form" @submit.prevent="submit">
        <div class="form-group">
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Titre"
            autocomplete="off"
            spellcheck="false"
            v-model="prod.title"
          />
          <div class="title-error" v-if="prod.titleError">
            {{ prod.titleError }}
          </div>
        </div>
        <div class="form-group">
          <label for="cover-file"
            >Converture <span class="indicator">(optionnel)</span></label
          >
          <input
            @change="fillCoverFileCustomTxt"
            type="file"
            name="cover-file"
            id="cover-file"
          />
          <button
            type="button"
            @click="triggerCoverFileBtn"
            class="btn cover-file-custom-btn"
          >
            Choisir un fichier
          </button>
          <span class="cover-file-custom-txt">Aucun fichier selectionné</span>
          <div class="cover-file-error" v-if="prod.coverFileError">
            {{ prod.coverFileError }}
          </div>
        </div>
        <div class="form-group">
          <label for="audio-file"
            >Fichier audio <span class="indicator">(.mp3 ou .wav)</span></label
          >
          <input
            @change="fillAudioFileCustomTxt"
            type="file"
            name="audio-file"
            id="audio-file"
          />
          <button
            type="button"
            @click="triggerAudioFileBtn"
            class="btn audio-file-custom-btn"
          >
            Choisir un fichier
          </button>
          <span class="audio-file-custom-txt">Aucun fichier selectionné</span>
          <div class="audio-file-error" v-if="prod.audioFileError">
            {{ prod.audioFileError }}
          </div>
        </div>
        <div class="form-group">
          <label for="tags"
            >Tags <span class="indicator">(optionnel)</span></label
          >
          <input
            type="text"
            name="tags"
            id="tags"
            autocomplete="off"
            spellcheck="false"
            v-model="prod.tags"
          />
        </div>
        <div class="form-group">
          <label for="price">Prix</label>
          <input
            type="number"
            min="0"
            name="price"
            id="price"
            autocomplete="off"
            step="any"
            v-model="prod.price"
            placeholder="Ex: 19,99"
          />
          <div v-if="prod.priceError" class="price-error">
            {{ prod.priceError }}
          </div>
        </div>
        <div class="form-group">
          <label for="max-streams"
            >Streams maximum <span class="indicator">(optionnel)</span></label
          >
          <input
            type="number"
            min="0"
            step="1"
            name="max-streams"
            id="max-streams"
            autocomplete="off"
            v-model="prod.maxStreams"
            placeholder="Illimité"
          />
        </div>
        <div class="d-flex">
          <button class="btn btn--cancel" type="button" @click="$router.go(-1)">
            Annuler
          </button>
          <button class="btn btn--add-prod" type="submit">
            Ajouter la prod
          </button>
        </div>
      </form>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { mapState } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      prod: {
        title: "",
        song: "",
        cover: "",
        tags: [],
        price: "",
        maxStreams: "",
        titleError: "",
        coverFileError: "",
        audioFileError: "",
        priceError: ""
      }
    };
  },
  computed: {
    ...mapState(["user", "jwt"])
  },
  components: {
    "app-navbar": Navbar,
    "app-footer": Footer
  },
  methods: {
    submit() {
      const bodyFormData = new FormData();
      bodyFormData.append("title", this.prod.title);
      bodyFormData.append("song", this.prod.song);
      if (this.prod.song) {
        const realAudioFileBtn = document.getElementById("audio-file");
        const audioFileName = realAudioFileBtn.files[0].name;

        bodyFormData.append("songToDisplay", audioFileName);
      }
      bodyFormData.append("tags", this.prod.tags);
      bodyFormData.append("artist", this.user.username);

      bodyFormData.append("price", Number(this.prod.price).toFixed(2));

      bodyFormData.append("maxStreams", this.prod.maxStreams);

      if (!this.prod.cover) {
        bodyFormData.append("cover", "placeholder.jpg");
      } else {
        const realCoverFileBtn = document.getElementById("cover-file");
        const coverFileName = realCoverFileBtn.files[0].name;
        bodyFormData.append("cover", this.prod.cover);
        bodyFormData.append("coverToDisplay", coverFileName);
      }

      axios({
        method: "post",
        url: "/api/prods",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: this.jwt
        }
      })
        .then(() => {
          this.$router.push("/compte/prods");
        })
        .catch(error => {
          this.prod.audioFileError = error.response.data.errors.song;
          this.prod.titleError = error.response.data.errors.title;
          this.prod.priceError = error.response.data.errors.price;
        });
    },
    triggerAudioFileBtn() {
      document.getElementById("audio-file").click();
    },
    fillAudioFileCustomTxt() {
      const realFileBtn = document.getElementById("audio-file");
      const customTxt = document.querySelector(".audio-file-custom-txt");

      const fileName = realFileBtn.files[0].name;
      customTxt.innerHTML = fileName;

      const file = realFileBtn.files[0];
      this.prod.song = file;
    },
    triggerCoverFileBtn() {
      document.getElementById("cover-file").click();
    },
    fillCoverFileCustomTxt() {
      const realFileBtn = document.getElementById("cover-file");
      const customTxt = document.querySelector(".cover-file-custom-txt");

      const fileName = realFileBtn.files[0].name;
      customTxt.innerHTML = fileName;

      const file = realFileBtn.files[0];
      this.prod.cover = file;
    }
  }
};
</script>

<style lang="scss" scoped>
.add-prod {
  color: $color-white;
  background: linear-gradient(rgba(rgb(0, 0, 0), 0.7), rgba($color-black, 1)),
    url("../assets/img/profile-background.jpg") center center fixed;
  background-size: cover;
  padding: 3rem 6rem;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 320px) {
    padding: 3rem 1rem;
  }
}

.container {
  max-width: 400px;
  margin: 10rem auto;

  h1 {
    font-weight: 400;
  }
}

.form-group {
  margin: 5rem 0;

  label {
    display: block;
    margin-bottom: 1rem;

    .indicator {
      font-size: 1.3rem;
      margin-left: 0.5rem;
    }
  }

  input {
    width: 100%;
  }

  #title,
  #max-streams,
  #price,
  #tags {
    background: none;
    border: none;
    border-bottom: 1px solid $color-white;
    padding: 0 0.5rem 0.5rem 0.5rem;
    color: inherit;
    outline: none;

    &::placeholder {
      color: rgba($color-white, 0.7);
    }
  }

  .title-error,
  .cover-file-error,
  .audio-file-error,
  .price-error {
    margin-top: 1rem;
    color: #ff5367;
    font-size: 1.4rem;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  #audio-file,
  #cover-file {
    display: none;
  }

  .audio-file-custom-btn,
  .cover-file-custom-btn {
    border: 1px solid $color-white;
    padding: 1rem 2rem;
    margin-right: 1.5rem;
    font-size: 1.4rem;
  }

  .audio-file-custom-txt,
  .cover-file-custom-txt {
    font-size: 1.4rem;
  }
}

.btn--cancel,
.btn--add-prod {
  padding: 1rem 3rem;
  font-size: 1.3rem;
  text-transform: uppercase;
  flex: 1;
  font-weight: 500;
}

.btn--cancel {
  border: 1px solid $color-white;
  margin-right: 1rem;
}

.btn--add-prod {
  background: $color-white;
  color: $color-black;
  text-transform: uppercase;
}
</style>
