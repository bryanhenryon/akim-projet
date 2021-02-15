<template>
  <div class="update-prod">
    <app-navbar></app-navbar>
    <app-roller-spinner v-if="isLoading"></app-roller-spinner>
    <div class="container">
      <h1>Modifier une prod</h1>
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
        <div class="form-group" data-name="tags-input">
          <label for="tags"
            >Tags <span class="indicator">(optionnel)</span></label
          >
          <div class="tags-container">
            <span v-for="(tag, index) of prod.tags" :key="index" class="tag">
              {{ tag }}
              <button
                @click="removeTag(index)"
                type="button"
                class="btn remove-tag"
              >
                <svg class="icon icon-cross">
                  <use xlink:href="sprite.svg#icon-cross"></use>
                </svg>
              </button>
            </span>
            <input
              type="text"
              id="tags"
              name="tags"
              autocomplete="off"
              spellcheck="false"
              placeholder="Ex: Hip-Hop, Electro, Lo-fi..."
            />
          </div>
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
          <svg class="icon icon-euro">
            <use xlink:href="sprite.svg#icon-euro"></use>
          </svg>
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
            Modifier la prod
          </button>
        </div>
      </form>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapGetters } from "vuex";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RollerSpinner from "../components/spinners/RollerSpinner";
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
      },
      isLoading: false
    };
  },
  computed: {
    ...mapState(["user", "jwt"]),
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    })
  },
  components: {
    "app-navbar": Navbar,
    "app-footer": Footer,
    "app-roller-spinner": RollerSpinner
  },
  methods: {
    submit() {
      this.isLoading = true;
      const bodyFormData = new FormData();
      bodyFormData.append("title", this.prod.title);
      bodyFormData.append("song", this.prod.song);

      const realAudioFileBtn = document.getElementById("audio-file");
      if (realAudioFileBtn.files[0]) {
        const audioFileName = realAudioFileBtn.files[0].name;
        bodyFormData.append("songToDisplay", audioFileName);
      }

      for (let tag of this.prod.tags) {
        bodyFormData.append("tags", tag);
      }

      bodyFormData.append("artist", this.user.username);

      bodyFormData.append("price", Number(this.prod.price).toFixed(2));

      bodyFormData.append("maxStreams", this.prod.maxStreams);

      const realCoverFileBtn = document.getElementById("cover-file");
      if (!this.prod.cover) {
        bodyFormData.append("cover", "placeholder.jpg");
      } else if (realCoverFileBtn.files[0]) {
        const coverFileName = realCoverFileBtn.files[0].name;
        bodyFormData.append("cover", this.prod.cover);
        bodyFormData.append("coverToDisplay", coverFileName);
      }

      axios({
        method: "patch",
        url: this.apiRoot + "prods/" + this.$route.params.id,
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: this.jwt
        }
      })
        .then(() => {
          this.isLoading = false;
          this.$router.push("/compte/prods");
        })
        .catch(error => {
          this.isLoading = false;
          console.log(error);
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
    },
    removeTag(index) {
      this.prod.tags.splice(index, 1);
    }
  },
  mounted() {
    const tagsContainer = document.querySelector(".tags-container");
    const mainInput = document.getElementById("tags");

    mainInput.addEventListener("input", () => {
      let enteredTags = mainInput.value.trim().split(",");
      if (enteredTags.length > 1) {
        enteredTags.forEach(t => {
          if (t.length !== 0) {
            addTag(t);
          }
        });

        mainInput.value = "";
      }
    });

    mainInput.addEventListener("keydown", e => {
      let keyCode = e.which || e.keyCode;
      if (
        keyCode === 8 &&
        mainInput.value.length === 0 &&
        this.prod.tags.length > 0
      ) {
        removeTag(this.prod.tags.length - 1);
      }
    });

    tagsContainer.appendChild(mainInput);

    const addTag = text => {
      this.prod.tags.push(text);
    };

    const removeTag = index => {
      this.prod.tags.splice(index, 1);
    };
  },
  created() {
    axios
      .get(this.apiRoot + "prod/" + this.$route.params.id)
      .then(res => {
        if (res.data.artist === this.user.username) {
          this.prod.title = res.data.title;
          this.prod.song = res.data.song;
          this.prod.cover = res.data.cover;
          this.prod.tags = res.data.tags;
          this.prod.price = res.data.price;
          this.prod.maxStreams = res.data.maxStreams;

          const customAudioTxt = document.querySelector(
            ".audio-file-custom-txt"
          );
          const customCoverTxt = document.querySelector(
            ".cover-file-custom-txt"
          );

          if (res.data.coverToDisplay) {
            customCoverTxt.innerHTML = res.data.coverToDisplay;
          }
          customAudioTxt.innerHTML = res.data.songToDisplay;
        } else {
          this.$router.push("/compte/prods");
        }
      })
      .catch(e => console.log(e));
  }
};
</script>

<style lang="scss" scoped>
.update-prod {
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
  position: relative;

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

  .icon-euro {
    fill: $color-white;
    width: 1.3rem;
    height: 1.3rem;
    position: absolute;
    top: 32px;
    right: 0;
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

  .tags-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    border-bottom: 1px solid $color-white;
    padding: 0 0.5rem 0.5rem 0.5rem;

    .tag {
      font-size: 1.3rem;
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      background: $color-white;
      color: $color-black;
      font-weight: 500;

      .icon-cross {
        height: 1.3rem;
        width: 1.3rem;
        transform: translateY(2px) translateX(2px);
      }
    }

    #tags {
      border-bottom: none;
      padding: 0;
      width: auto;
    }
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
