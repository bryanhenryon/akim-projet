<template>
  <div class="prods-list">
    <h1 class="title">Prods</h1>
    <div class="utils-container">
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
            placeholder="Rechercher un morceau ou un artiste"
            @keyup="searchProd"
          />
        </div>
        <button class="btn btn--filter" @click="showFilterModal">
          Filtrer
          <svg class="icon icon-funnel">
            <use xlink:href="sprite.svg#icon-funnel"></use>
          </svg>
        </button>
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
    <div class="filter-modal">
      <div
        class="filter-modal-content animate__animated animate__zoomIn animate__faster"
      >
        <button class="btn btn--close-modal" @click="closeFilterModal">
          <svg class="icon icon-cross">
            <use xlink:href="sprite.svg#icon-cross"></use>
          </svg>
        </button>
        <div class="filter-modal-genre">
          <h3 class="filter-modal-genre__title">Genres</h3>
          <label for="all">
            <input
              type="radio"
              class="genre-radio"
              name="genre"
              id="all"
              checked
              value="all"
            />
            Tous
          </label>
          <label for="hip-hop">
            <input
              type="radio"
              class="genre-radio"
              name="genre"
              id="hip-hop"
              value="hip-hop"
            />
            Hip Hop
          </label>
          <label for="pop">
            <input
              type="radio"
              class="genre-radio"
              name="genre"
              id="pop"
              value="pop"
            />
            Pop
          </label>
          <label for="rnb">
            <input
              type="radio"
              class="genre-radio"
              name="genre"
              id="rnb"
              value="rnb"
            />
            R&B
          </label>
          <label for="rock">
            <input
              type="radio"
              class="genre-radio"
              name="genre"
              id="rock"
              value="rock"
            />
            Rock
          </label>
          <button class="btn btn--apply-filter" @click="applyFilter">
            Appliquer
          </button>
        </div>
      </div>
    </div>
    <div class="cards">
      <div class="no-results" v-if="noResults">
        Aucun résultat trouvé
      </div>
      <div class="card" v-for="(prod, index) of prods" :key="index">
        <div class="image">
          <img
            :src="apiRoot + 'prods/images/' + prod.cover"
            draggable="false"
            alt="Couverture du morceau"
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
  </div>
</template>

<script>
import axios from "axios";
import "animate.css";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      prods: null,
      noResults: false
    };
  },
  computed: {
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    })
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
          e.target !== btnSortBy
            ? this.hideDropdownMenu(btnSortBy, dropdownMenu, iconChevronDown)
            : false;
        });
      } else {
        iconChevronDown.style.transform = "rotate(0)";
        dropdownMenu.style.display = "none";
      }
    },
    hideDropdownMenu(btnSortBy, dropdownMenu, iconChevronDown) {
      btnSortBy.classList.remove("active");
      iconChevronDown.style.transform = "rotate(0)";
      dropdownMenu.style.display = "none";
    },
    hideModal() {
      const filterModal = document.querySelector(".filter-modal");
      filterModal.classList.remove("active");
    },
    searchProd(e) {
      const searchValue = e.target.value.toLowerCase();
      axios
        .get(this.apiRoot + "prods")
        .then(res => {
          const prods = res.data;

          const filteredProds = prods.filter(
            data =>
              data.title.toLowerCase().includes(searchValue) ||
              data.artist.toLowerCase().includes(searchValue)
          );

          if (filteredProds.length === 0) {
            (this.noResults = true),
              document.querySelector(".player").classList.remove("playing");
          } else {
            this.noResults = false;
          }

          this.prods = filteredProds;
        })
        .catch(error => {
          console.log(error);
        });
    },
    showFilterModal() {
      const filterModal = document.querySelector(".filter-modal");
      filterModal.classList.add("active");

      if (filterModal.classList.contains("active")) {
        window.addEventListener("click", e => {
          e.target == filterModal ? this.hideModal() : false;
        });
      }
    },
    applyFilter() {
      this.closeFilterModal();

      const radios = document.querySelectorAll(".genre-radio");
      for (const radio of radios) {
        if (radio.checked) {
          if (radio.value !== "all") {
            axios
              .get(this.apiRoot + "prods", {
                params: {
                  search: this.searchParams
                }
              })
              .then(res => {
                const prods = res.data;
                const filteredProds = prods.filter(prod =>
                  prod.tags.includes(radio.value)
                );

                this.prods = filteredProds;

                if (filteredProds.length === 0) {
                  this.noResults = true;
                  document.querySelector(".player").classList.remove("playing");
                } else {
                  this.noResults = false;
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            axios
              .get(this.apiRoot + "prods")
              .then(res => {
                const prods = res.data;
                prods.length === 0
                  ? (this.noResults = true)
                  : (this.noResults = false);
                this.prods = prods;
              })
              .catch(error => {
                console.log(error);
              });
          }
        }
      }
    },
    closeFilterModal() {
      const filterModal = document.querySelector(".filter-modal");
      filterModal.classList.remove("active");
    },
    sortByLatest() {
      axios
        .get(this.apiRoot + "prods")
        .then(res => {
          const prods = res.data;
          prods.length === 0
            ? (this.noResults = true)
            : (this.noResults = false);
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
        .get(this.apiRoot + "prods")
        .then(res => {
          const prods = res.data;
          prods.length === 0
            ? (this.noResults = true)
            : (this.noResults = false);
          const sortedProds = prods.sort((a, b) =>
            a.createdAt > b.createdAt ? 1 : -1
          );
          this.prods = sortedProds;
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
      .get(this.apiRoot + "prods", {
        params: {
          search: this.$route.query.search
        }
      })
      .then(res => {
        const prods = res.data;
        prods.length === 0 ? (this.noResults = true) : (this.noResults = false);
        this.prods = prods;
      })
      .catch(error => {
        console.log(error);
      });
  },
  mounted() {
    const searchbarInput = document.querySelector(".searchbar-input");
    window.addEventListener("resize", () => {
      if (window.innerWidth < 520) {
        searchbarInput.placeholder = "Rechercher";
      } else {
        searchbarInput.placeholder = "Rechercher un morceau ou un artiste";
      }
    });

    if (window.innerWidth < 520) {
      searchbarInput.placeholder = "Rechercher";
    }
  }
};
</script>

<style lang="scss" scoped>
.prods-list {
  max-width: 1600px;
  margin: 10rem auto;

  @media (max-width: 768px) {
    margin: 5rem auto;
  }

  .title {
    font-size: 4.2rem;
    margin-bottom: 3rem;

    @media (max-width: 1024px) {
      font-size: 2.8rem;
    }

    @media (max-width: 480px) {
      font-size: 2.4rem;
    }
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

.search-filter {
  display: flex;
  align-items: center;

  .btn--filter {
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: $color-black;
    padding: 1rem 2rem;
    letter-spacing: 1px;
    font-size: 1.4rem;
    border-radius: 2px;
    width: 150px;
    font-weight: 500;
    background: #262626;
    color: $color-white;

    .icon-funnel {
      fill: $color-white;
      width: 1.6rem;
      height: 1.6rem;
      margin-left: 1rem;
    }
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

.filter-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8);

  &.active {
    display: block;
  }

  .filter-modal-content {
    margin: 10% auto;
    background: #262626;
    width: 95%;
    max-width: 400px;
    border-radius: 5px;
    padding: 0.5rem;

    .btn--close-modal {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: auto;
      padding: 1rem;

      .icon-cross {
        fill: $color-white;
        height: 25px;
        width: 25px;
      }
    }

    .filter-modal-genre {
      &__title {
        font-size: 2.8rem;
        margin-bottom: 1.5rem;
      }
      padding: 0 2rem 1rem 2rem;

      label {
        display: flex;
        align-items: center;
        padding: 1.5rem 0;
        letter-spacing: 0.5px;
        cursor: pointer;

        input[type="radio"] {
          margin-right: 1rem;

          &:after {
            width: 15px;
            height: 15px;
            border-radius: 15px;
            top: -2px;
            left: -1px;
            position: relative;
            background-color: #d1d3d1;
            content: "";
            display: inline-block;
            visibility: visible;
            border: 2px solid white;
          }
        }

        input[type="radio"]:checked:after {
          width: 15px;
          height: 15px;
          border-radius: 15px;
          top: -2px;
          left: -1px;
          position: relative;
          background-color: #ff3a51;
          content: "";
          display: inline-block;
          visibility: visible;
          border: 2px solid white;
        }
      }

      .btn--apply-filter {
        background: #ff3a51;
        color: $color-white;
        padding: 1rem 3rem;
        margin-top: 1.5rem;
        border-radius: 5px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  }
}

.cards {
  display: flex;
  flex-wrap: wrap;

  .no-results {
    margin-top: 10rem;
    width: 100%;
    text-align: center;
  }

  .card {
    border-radius: 3px;
    width: 250px;
    margin: 4rem 3rem;
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
</style>
