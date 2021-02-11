<template>
  <div class="profile" v-if="user">
    <app-navbar></app-navbar>
    <div class="container">
      <img
        class="profile__image"
        :src="
            '/api/user/profile_picture/' + user.profilePicture
        "
        alt="Image de profil"
      />
      <div class="profile__username">{{ user.username }}</div>
      <div class="profile__member-since">
        Membre depuis le {{ accountCreationDate }}
      </div>
      <p v-if="user.description" class="profile__description">
        {{ user.description }}
      </p>
      <ul class="profile__social-links">
        <li v-if="user.soundcloud" class="profile__social-link">
          <a :href="user.soundcloud" target="_blank" rel="noopener">
            <svg class="icon icon-soundcloud">
              <use xlink:href="sprite.svg#icon-soundcloud"></use>
            </svg>
          </a>
        </li>
        <li v-if="user.instagram" class="profile__social-link">
          <a :href="user.instagram" target="_blank" rel="noopener">
            <svg class="icon icon-instagram">
              <use xlink:href="sprite.svg#icon-instagram"></use>
            </svg>
          </a>
        </li>
        <li v-if="user.youtube" class="profile__social-link">
          <a :href="user.youtube" target="_blank" rel="noopener">
            <svg class="icon icon-youtube">
              <use xlink:href="sprite.svg#icon-youtube"></use>
            </svg>
          </a>
        </li>
        <li v-if="user.twitter" class="profile__social-link">
          <a :href="user.twitter" target="_blank" rel="noopener">
            <svg class="icon icon-twitter">
              <use xlink:href="sprite.svg#icon-twitter"></use>
            </svg>
          </a>
        </li>
        <li v-if="user.facebook" class="profile__social-link">
          <a :href="user.facebook" target="_blank" rel="noopener">
            <svg class="icon icon-facebook">
              <use xlink:href="sprite.svg#icon-facebook"></use>
            </svg>
          </a>
        </li>
      </ul>

      <div
        v-if="sessionUser && user.username === sessionUser.username"
        class="profile__my-infos"
      >
        <router-link to="/compte/infos">Modifier mes informations</router-link>
      </div>
    </div>
    <div v-if="!noProd" class="mt-10">
      <router-link
        v-if="!noProd && sessionUser && user.username === sessionUser.username"
        to="/compte/prods"
        class="btn btn--manage-prods"
        >Gérer mes prods
      </router-link>
      <div v-if="!noProd" class="utils-container">
        <div class="search-filter">
          <div class="searchbar">
            <button class="btn btn--search">
              <svg class="icon icon-search">
                <use xlink:href="sprite.svg#icon-search"></use>
              </svg>
            </button>
            <input
              type="text"
              name=""
              spellcheck="false"
              class="searchbar-input"
              placeholder="Rechercher un morceau"
              @keyup="searchProd"
            />
          </div>
        </div>
        <div class="sort-by">
          <button class="btn btn--sort-by" @click="showDropdownMenu">
            Trier par
            <svg class="icon icon-chevron-down">
              <use xlink:href="sprite.svg#icon-chevron-down"></use>
            </svg>
          </button>
          <div class="sort-by-content ">
            <ul>
              <li>Les meilleures ventes</li>
              <li @click="sortByLatest">Les plus récents</li>
              <li @click="sortByOldest">Les plus anciens</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="cards">
      <div class="no-result" v-if="noResult">
        Aucun résultat
      </div>
      <div
        class="no-result"
        v-if="
          (noProd && sessionUser && user.username !== sessionUser.username) ||
            (noProd && !sessionUser)
        "
      >
        {{ user.username }} n'a aucune prod à présenter pour le moment
      </div>
      <div
        class="no-prod"
        v-if="noProd && sessionUser && user.username === sessionUser.username"
      >
        <p class="no-prod__message">
          Vous n'avez aucune prod à présenter pour le moment
        </p>
        <router-link to="/compte/prods/ajouter" class="btn btn--add-prod">
          <svg class="icon icon-plus">
            <use xlink:href="sprite.svg#icon-plus"></use>
          </svg>
          Ajouter une prod
        </router-link>
      </div>
      <div class="card" v-for="(prod, index) of prods" :key="index">
        <div class="image">
          <img
            :src="
                '/api/prods/images/' + prod.cover
            "
            draggable="false"
            alt="Couverture de la prod"
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
              :src="
                  '/api/prods/song/' + prod.song
              "
              type="audio/mpeg"
            />
            <source
              :src="
                  '/api/prods/song/' + prod.song
              "
              type="audio/wav"
            />
          </audio>
        </div>
        <div class="bottom">
          <div class="infos">
            <div class="title">
              {{ prod.title }}
            </div>
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
          <button class="btn btn--buy" @click="buyProd">
            <span>{{ prod.price }}€</span>
            <svg class="icon icon-shopping-cart">
              <use xlink:href="sprite.svg#icon-shopping-cart"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <app-player></app-player>
    <app-footer></app-footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import Navbar from "../components/Navbar";
import Player from "../components/Player";
import Footer from "../components/Footer";

export default {
  components: {
    "app-navbar": Navbar,
    "app-player": Player,
    "app-footer": Footer
  },
  data() {
    return {
      user: "",
      prods: null,
      noProd: null,
      noResult: null
    };
  },
  computed: {
    ...mapState({
      sessionUser: "user"
    }),
    accountCreationDate() {
      const date = new Date(this.user.createdAt);
      return (
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
      );
    }
  },
  methods: {
    showDropdownMenu() {
      const btnSortBy = document.querySelector(".btn--sort-by");
      const dropdownMenu = document.querySelector(".sort-by-content");
      const iconChevronDown = document.querySelector(".icon-chevron-down");

      btnSortBy.classList.toggle("active");

      if (btnSortBy.classList.contains("active")) {
        iconChevronDown.style.transform = "rotate(180deg)";
        dropdownMenu.style.display = "block";

        window.addEventListener("click", e => {
          e.target !== btnSortBy ? this.hideDropdownMenu() : false;
        });
      } else {
        iconChevronDown.style.transform = "rotate(0)";
        dropdownMenu.style.display = "none";
      }
    },
    hideDropdownMenu() {
      const btnSortBy = document.querySelector(".btn--sort-by");
      const dropdownMenu = document.querySelector(".sort-by-content");
      const iconChevronDown = document.querySelector(".icon-chevron-down");

      btnSortBy.classList.remove("active");
      iconChevronDown.style.transform = "rotate(0)";
      dropdownMenu.style.display = "none";
    },
    sortByLatest() {
      axios
        .get(
            "/api/prods/" + this.$route.params.username
        )
        .then(res => {
          const prods = res.data;
          const sortedProds = prods.sort((a, b) =>
            b.createdAt > a.createdAt ? 1 : -1
          );
          this.prods = sortedProds;
        })
        .catch(error => {
          console.log(error);
        });
    },
    sortByOldest() {
      axios
        .get(
            "/api/prods/" + this.$route.params.username
        )
        .then(res => {
          const prods = res.data;
          const sortedProds = prods.sort((a, b) =>
            a.createdAt > b.createdAt ? 1 : -1
          );
          this.prods = sortedProds;
        })
        .catch(error => {
          console.log(error);
        });
    },
    searchProd(e) {
      const searchValue = e.target.value.toLowerCase();
      axios
        .get(
            "/api/prods/" + this.$route.params.username
        )
        .then(res => {
          const prods = res.data;

          const filteredProds = prods.filter(data =>
            data.title.toLowerCase().includes(searchValue)
          );

          if (filteredProds.length === 0) {
            (this.noResult = true),
              document.querySelector(".player").classList.remove("playing");
          } else {
            this.noResult = false;
          }

          this.prods = filteredProds;
        })
        .catch(error => {
          console.log(error);
        });
    },
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
      .get(
          "/api/users/" + this.$route.params.username
      )
      .then(res => (this.user = res.data))
      .catch(err => console.log(err));

    axios
      .get(
          "/api/prods/" + this.$route.params.username
      )
      .then(res => {
        const prods = res.data;
        prods.length === 0 ? (this.noProd = true) : (this.noProd = false);
        this.prods = prods;
      })
      .catch(error => console.log(error));
  }
};
</script>

<style lang="scss" scoped>
.profile {
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

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 500px;
    margin: 5rem auto 0 auto;
  }

  &__image {
    height: 175px;
    width: 175px;
    border-radius: 50%;
    margin-bottom: 1rem;
    object-fit: cover;
  }

  &__username {
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  &__member-since {
    margin-bottom: 1rem;
    font-style: italic;
    font-size: 1.4rem;
  }

  &__description {
    margin-bottom: 2rem;
  }

  &__social-links {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
  }

  &__social-link a {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    margin-right: 3rem;

    .icon-soundcloud,
    .icon-instagram,
    .icon-youtube,
    .icon-twitter,
    .icon-facebook {
      fill: $color-white;
      width: 18px;
      height: 18px;
    }
  }

  &__social-link:last-child a {
    margin-right: 0;
  }

  &__my-infos {
    margin-top: 3rem;

    a {
      color: inherit;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: letter-spacing 0.2s ease-in-out;
      border: 1px solid $color-white;
      padding: 1.5rem 2rem;
      font-size: 1.3rem;
      display: block;

      &:hover {
        letter-spacing: 2px;
      }
    }
  }

  .btn--manage-prods {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $color-white;
    padding: 1.5rem 2rem;
    text-decoration: none;
    font-size: 1.2rem;
    margin-bottom: 3rem;
    letter-spacing: 1px;
    transition: letter-spacing 0.2s ease-in-out;
    text-transform: uppercase;

    &:hover {
      letter-spacing: 2px;
    }
  }

  .utils-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 1024px) {
      display: block;
    }
  }

  .searchbar {
    border-radius: 2px;
    display: flex;
    align-items: center;
    width: 500px;
    background: #262626;
    padding: 0 1rem;
    margin-right: 2rem;

    @media (max-width: 1150px) {
      width: 300px;
    }

    @media (max-width: 1024px) {
      width: 100%;
    }

    input[type="text"] {
      border: none;
      outline: none;
      font-size: 1.5rem;
      margin: 0 0.5rem;
      letter-spacing: 0.5px;
      width: 100%;
      background: #262626;
      color: #f4f4f4;
      padding: 1.3rem 0;
      height: 45px;

      &::placeholder {
        color: #d4d3d3;
        font-family: "Roboto", sans-serif;
        font-size: 1.5rem;

        @media (max-width: 480px) {
          font-size: 1.4rem;
        }
      }
    }

    .btn--search {
      display: flex;
      background: none;
      border: none;
      outline: none;
      padding: 1rem;
      cursor: pointer;

      .icon-search {
        height: 1.6rem;
        width: 1.6rem;
        fill: #ccc;
      }
    }
  }

  .sort-by {
    position: relative;

    .btn--sort-by {
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: $color-white;
      color: $color-black;
      padding: 1rem 2rem;
      letter-spacing: 1px;
      font-size: 1.4rem;
      border-radius: 2px;
      width: 300px;
      font-weight: 500;
      background: #262626;
      color: $color-white;

      * {
        pointer-events: none;
      }

      @media (max-width: 1024px) {
        margin-top: 2rem;
        width: 100%;
      }

      .icon-chevron-down {
        height: 2rem;
        width: 2rem;
        fill: $color-white;
        transition: transform 0.2s ease-in-out;
      }
    }

    &-content {
      display: none;
      position: absolute;
      z-index: 100;
      left: 0;
      right: 0;
      background: #262626;
      border-radius: 0 0 2px 2px;

      ul {
        list-style: none;

        margin: 1rem 0;

        li {
          width: 100%;
          padding: 1rem 2rem;
          font-size: 1.5rem;
          cursor: pointer;

          &:hover {
            font-weight: 500;
          }
        }
      }
    }
  }
  .cards {
    display: flex;
    flex-wrap: wrap;

    .no-result {
      margin: 10rem 0;
      width: 100%;
      text-align: center;
    }

    .no-prod {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin: 10rem 0;

      &__message {
        margin-bottom: 3rem;
        text-align: center;
      }

      .btn--add-prod {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid $color-white;
        padding: 1.5rem 2rem;
        text-decoration: none;
        font-size: 1.3rem;

        letter-spacing: 1px;
        transition: letter-spacing 0.2s ease-in-out;
        text-transform: uppercase;

        &:hover {
          letter-spacing: 2px;
        }

        .icon-plus {
          height: 20px;
          width: 20px;
          fill: $color-white;
          margin-right: 0.5rem;
          margin-left: -5px;
        }
      }
    }

    .card {
      border-radius: 3px;
      width: 250px;
      margin: 4rem 3rem;
      word-break:break-word;

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

          .author-profile-link {
            color: $color-white;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
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
}
</style>
