<template>
  <section class="previews">
    <div class="section-title">
      <h2 class="news">Derniers ajouts</h2>
      <router-link to="/prods" class="btn btn--see-all">Tout voir</router-link>
    </div>
    <div class="cards">
      <div class="no-results" v-if="noResults">
        Aucune prod n'a encore été ajoutée
      </div>
      <div class="card" v-for="(prod, index) of latestProds" :key="index">
        <div class="image">
          <img
            :src="apiRoot + 'prods/images/' + prod.cover"
            draggable="false"
            alt=""
          />
          <button class="btn btn--play" @click="play">
            <svg class="icon icon-controller-play">
              <use xlink:href="sprite.svg#icon-controller-play"></use>
            </svg>
            <svg class="icon icon-pause">
              <use xlink:href="sprite.svg#icon-pause"></use>
            </svg>
          </button>
          <audio class="audio">
            <source
              :src="apiRoot + 'prods/song/' + prod.song"
              type="audio/mpeg"
            />
            <source
              :src="apiRoot + 'prods/song/' + prod.song"
              type="audio/wav"
            />
          </audio>
        </div>
        <div class="bottom">
          <div class="infos">
            <div class="title">{{ prod.title }}</div>
            <div class="author">
              <router-link
                class="author-profile-link"
                :to="'/profil/' + prod.artist.toLowerCase()"
                >{{ prod.artist }}</router-link
              >
            </div>
            <div v-if="prod.maxStreams" class="max-streams">
              Max streams:
              {{ prod.maxStreams.replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
            </div>
            <div v-else class="max-streams">Max streams: illimité</div>
            <span class="format">{{ prod.format.toUpperCase() }}</span>
          </div>
          <button class="btn btn--buy">
            <span>{{ prod.price }}€</span>
            <svg class="icon icon-shopping-cart">
              <use xlink:href="sprite.svg#icon-shopping-cart"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <router-link to="/prods" class="btn btn--see-all--secondary"
      >Tout voir</router-link
    >
    <app-player></app-player>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import Player from "../components/Player";

export default {
  data() {
    return {
      latestProds: null,
      noResults: null
    };
  },
  computed: {
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    })
  },
  components: {
    "app-player": Player
  },
  methods: {
    play(e) {
      document.querySelector(".player").classList.add("playing");
      document.querySelector(".btn--play2").classList.add("playing");

      const audio = e.currentTarget.nextSibling;
      const allBtn = document.querySelectorAll(".btn--play");
      const isPlaying = e.currentTarget.classList.contains("active");

      for (const btn of allBtn) {
        if (btn.classList.contains("active")) {
          btn.classList.remove("active");
          btn.nextSibling.pause();
        }

        if (btn !== e.currentTarget) {
          btn.nextSibling.currentTime = 0;
        }
      }

      if (isPlaying) {
        e.currentTarget.classList.remove("active");
        document.querySelector(".btn--play2").classList.remove("playing");
        audio.pause();
      } else {
        e.currentTarget.classList.add("active");
        audio.play();
        if (
          document.querySelector(".btn--sound").classList.contains("active")
        ) {
          audio.muted = true;
        }
      }
    }
  },
  created() {
    axios
      .get(this.apiRoot + "prods")
      .then(res => {
        const data = res.data;
        data.length === 0 ? (this.noResults = true) : (this.noResults = false);
        const sortedData = data.sort((a, b) =>
          b.createdAt > a.createdAt ? 1 : -1
        );
        const slicedData = sortedData.slice(0, 5);
        this.latestProds = slicedData;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style lang="scss" scoped>
.previews {
  margin-top: 8rem;

  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 480px) {
      justify-content: center;
      text-align: center;
    }

    .news {
      @media (max-width: 1024px) {
        font-size: 2.8rem;
      }
      @media (max-width: 480px) {
        font-size: 2.4rem;
      }
    }
    .btn--see-all {
      border: 1px solid $color-white;
      padding: 1.2rem 2rem;
      text-transform: uppercase;
      font-size: 1.4rem;
      letter-spacing: 1px;
      transition: 0.2s ease-out;
      text-decoration: none;

      @media (max-width: 480px) {
        display: none;

        .btn--see-all--secondary {
          display: block;
        }
      }

      &:hover {
        letter-spacing: 2px;
      }
    }
  }

  .news {
    font-size: 3.6rem;
    letter-spacing: 0.5px;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;

    .no-results {
      margin: 10rem 0;
      width: 100%;
      text-align: center;
    }

    .card {
      border-radius: 3px;
      width: 250px;
      margin: 4rem 2rem;
      word-break: break-word;

      .image {
        border-radius: 2px;
        transition: 0.1s ease-in-out;
        position: relative;
        height: 250px;

        &:hover {
          .btn--play {
            display: block;
            background: rgba($color: #000, $alpha: 0.7);

            &.active {
              .icon-controller-play {
                display: none;
              }

              .icon-pause {
                display: inline;
              }
            }
          }
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .btn--play {
          display: none;
          width: 100%;
          border: none;
          background: none;
          outline: none;
          cursor: pointer;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          .icon-controller-play,
          .icon-pause {
            fill: $color-white;
            width: 100%;
            height: 10rem;
            width: 10rem;
          }

          .icon-pause {
            display: none;
          }
        }
      }

      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1rem;

        .infos {
          margin-right: 1rem;

          .title {
            font-weight: 500;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
          }

          .author {
            font-size: 1.4rem;
            margin-bottom: 0.5rem;

            &:hover {
              text-decoration: underline;
            }
          }

          .max-streams {
            font-size: 1.3rem;
            letter-spacing: 0.5px;
            margin-bottom: 1rem;
          }

          .format {
            font-size: 1.2rem;
            background: $color-white;
            color: $color-black;
            padding: 0.5rem 1rem;
            font-weight: bold;
            border-radius: 0.5rem;
          }

          .author-profile-link {
            color: $color-white;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .btn--buy {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          background: rgb(216, 25, 25);
          font-weight: 600;

          padding: 1rem 2rem;
          border-radius: 5px;
          font-size: 1.3rem;
          transition: 0.2s ease-in-out;
          flex-shrink: 0;
          align-self: start;

          &:hover {
            background: lighten(rgb(216, 25, 25), 5%);
          }

          .icon-shopping-cart {
            height: 1.5rem;
            width: 1.5rem;
            fill: $color-white;
            margin-left: 8px;
          }
        }
      }
    }
  }

  .btn--see-all--secondary {
    display: none;
    border: 1px solid $color-white;
    padding: 1.2rem 2rem;
    text-transform: uppercase;
    font-size: 1.4rem;
    letter-spacing: 1px;
    transition: 0.2s ease-out;
    text-decoration: none;
    text-align: center;

    @media (max-width: 480px) {
      display: block;
    }
  }
}
</style>
