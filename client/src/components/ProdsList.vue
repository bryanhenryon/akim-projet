<template>
  <div class="prods-list">
    <h1 class="title">Prods</h1>
    <div class="utils-container">
      <div class="searchbar">
        <div class="d-flex align-items-center">
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
            placeholder="Rechercher"
            @keyup="searchProd"
          />
          <button @click="showFilterMenu" class="btn btn--filter-by">
            <span class="filter-by-indicator">{{ filterBy }}</span>
            <svg class="icon icon-chevron-down--filter-by">
              <use xlink:href="sprite.svg#icon-chevron-down"></use>
            </svg>
          </button>
        </div>
        <div class="filter-by-menu">
          <ul>
            <li @click="setFilter('Tous')">Tous</li>
            <li @click="setFilter('Titres')">Titres</li>
            <li @click="setFilter('Artistes')">Artistes</li>
            <li @click="setFilter('Tags')">Tags</li>
          </ul>
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
            <!-- <li>Les meilleures ventes</li> -->
            <li @click="sortByLatest">Les plus récents</li>
            <li @click="sortByOldest">Les plus anciens</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="cards">
      <div class="no-results" v-if="noResults && !noProds">
        <div>Aucun résultat</div>
        <button
          v-if="!noProds"
          class="btn btn--clear-filters"
          @click="clearFilters"
        >
          Retirer les filtres
        </button>
      </div>
      <div class="no-prods" v-if="noProds">
        <div>Aucune prod n'a encore été ajoutée</div>
      </div>
      <div class="card" v-for="(prod, index) of prods" :key="index">
        <div class="image">
          <img
            :src="apiRoot + 'prods/images/' + prod.cover"
            draggable="false"
            alt="Couverture du morceau"
          />
          <button class="btn btn--play" @click="play(index, $event)">
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
              {{ kFormatter(prod.maxStreams) }}
            </div>
            <div v-else class="max-streams">Max streams: illimité</div>
            <span class="format">{{ prod.format.toUpperCase() }}</span>
          </div>
          <router-link :to="'/prod/' + prod._id" class="btn btn--buy">
            <span>{{ prod.price }}€</span>
            <svg class="icon icon-shopping-cart">
              <use xlink:href="sprite.svg#icon-shopping-cart"></use>
            </svg>
          </router-link>
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
      noResults: false,
      noProds: null
    };
  },
  computed: {
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    }),
    ...mapGetters("prodsList", {
      filterBy: "getFilterBy"
    }),
    ...mapGetters("player", {
      songVolume: "getSongVolume"
    })
  },
  methods: {
    kFormatter(num) {
      return Math.abs(num) > 999
        ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
        : Math.sign(num) * Math.abs(num);
    },
    setFilter(filter) {
      const searchValue = document
        .querySelector(".searchbar-input")
        .value.toLowerCase();
      this.$store.dispatch("prodsList/setFilterBy", filter);

      axios
        .get(this.apiRoot + "prods")
        .then(res => {
          const prods = res.data;

          const filteredProds = prods.filter(data => {
            switch (this.filterBy) {
              case "Tous":
                return (
                  data.title.toLowerCase().includes(searchValue) ||
                  data.artist.toLowerCase().includes(searchValue) ||
                  data.tags
                    .toString()
                    .toLowerCase()
                    .includes(searchValue)
                );
              case "Titres":
                return data.title.toLowerCase().includes(searchValue);
              case "Artistes":
                return data.artist.toLowerCase().includes(searchValue);
              case "Tags":
                return data.tags
                  .toString()
                  .toLowerCase()
                  .includes(searchValue);
            }
          });
          document.querySelector(".filter-by-indicator").textContent = filter;

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
    showFilterMenu() {
      const btnFilter = document.querySelector(".btn--filter-by");
      const filterMenu = document.querySelector(".filter-by-menu");
      const iconChevronDown = document.querySelector(
        ".icon-chevron-down--filter-by"
      );

      btnFilter.classList.toggle("active");

      if (btnFilter.classList.contains("active")) {
        iconChevronDown.style.transform = "rotate(180deg)";
        filterMenu.style.display = "block";

        window.addEventListener("click", e => {
          e.target !== btnFilter
            ? this.hideFilterMenu(btnFilter, filterMenu, iconChevronDown)
            : false;
        });
      } else {
        iconChevronDown.style.transform = "rotate(0)";
        filterMenu.style.display = "none";
      }
    },
    hideFilterMenu(btnFilter, filterMenu, iconChevronDown) {
      btnFilter.classList.remove("active");
      iconChevronDown.style.transform = "rotate(0)";
      filterMenu.style.display = "none";
    },
    clearFilters() {
      this.$router.replace({ search: null });
      this.$store.dispatch("prodsList/setFilterBy", "Tous");
      document.querySelector(".searchbar-input").value = "";
      axios
        .get(this.apiRoot + "prods")
        .then(res => {
          const prods = res.data;
          prods.length === 0
            ? (this.noResults = true)
            : (this.noResults = false);
          this.prods = prods;
        })
        .catch(e => console.log(e));
    },
    searchProd(e) {
      const searchValue = e.target.value.trim().toLowerCase();
      axios
        .get(this.apiRoot + "prods")
        .then(res => {
          const prods = res.data;

          const filteredProds = prods.filter(data => {
            switch (this.filterBy) {
              case "Tous":
                return (
                  data.title.toLowerCase().includes(searchValue) ||
                  data.artist.toLowerCase().includes(searchValue) ||
                  data.tags
                    .toString()
                    .toLowerCase()
                    .includes(searchValue)
                );
              case "Titres":
                return data.title.toLowerCase().includes(searchValue);
              case "Artistes":
                return data.artist.toLowerCase().includes(searchValue);
              case "Tags":
                return data.tags
                  .toString()
                  .toLowerCase()
                  .includes(searchValue);
            }
          });

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
    sortByLatest() {
      axios
        .get(this.apiRoot + "prods")
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
        .get(this.apiRoot + "prods")
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
    play(index, $event) {
      document.querySelector(".player").classList.add("playing");
      document.querySelector(".btn--play2").classList.add("playing");

      const audio = $event.currentTarget.nextSibling;
      audio.volume = this.songVolume;
      const allBtn = document.querySelectorAll(".btn--play");
      const isPlaying = $event.currentTarget.classList.contains("active");

      for (const btn of allBtn) {
        if (btn.classList.contains("active")) {
          btn.classList.remove("active");
          btn.nextSibling.pause();
        }

        if (btn !== $event.currentTarget) {
          btn.nextSibling.currentTime = 0;
        }
      }

      if (isPlaying) {
        $event.currentTarget.classList.remove("active");
        document.querySelector(".btn--play2").classList.remove("playing");
        audio.pause();
      } else {
        $event.currentTarget.classList.add("active");
        audio.play();

        if (
          document.querySelector(".btn--sound").classList.contains("active")
        ) {
          audio.muted = true;
        }
      }

      const card = $event.currentTarget.parentElement.parentElement;
      const artist = card.querySelector(".author").textContent;
      const title = card.querySelector(".title").textContent;
      const targetIndex = index;

      const playingSong = {
        target: $event.currentTarget,
        targetIndex: targetIndex,
        artist: artist,
        title: title,
        image: $event.currentTarget.previousSibling.src,
        audio: audio
      };

      this.$store.dispatch("player/playingSong", playingSong);

      const currentTarg = $event.currentTarget;
      audio.addEventListener("ended", () => {
        document.querySelector(".btn--play2").classList.remove("playing");
        currentTarg.classList.remove("active");
      });
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

        if (this.$route.query.search) {
          const filteredProds = prods.filter(data => {
            switch (this.filterBy) {
              case "Tous":
                return (
                  data.title.toLowerCase().includes(this.$route.query.search) ||
                  data.artist
                    .toLowerCase()
                    .includes(this.$route.query.search) ||
                  data.tags
                    .toString()
                    .toLowerCase()
                    .includes(this.$route.query.search)
                );
              case "Titres":
                return data.title
                  .toLowerCase()
                  .includes(this.$route.query.search);
              case "Artistes":
                return data.artist
                  .toLowerCase()
                  .includes(this.$route.query.search);
              case "Tags":
                return data.tags
                  .toString()
                  .toLowerCase()
                  .includes(this.$route.query.search);
            }
          });

          filteredProds.length === 0
            ? (this.noResults = true)
            : (this.noResults = false);
          this.prods = filteredProds;
          return;
        } else {
          prods.length === 0
            ? (this.noResults = true)
            : (this.noResults = false);
          this.prods = prods;
        }

        if (prods.length === 0) {
          this.noProds = true;
        } else {
          this.noProds = false;
        }
      })
      .catch(error => {
        console.log(error);
      });
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

.searchbar {
  position: relative;
  border-radius: 2px;
  background: #262626;
  padding: 0 1rem;
  width: 400px;

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
      fill: $color-white;
    }
  }
}

.btn--filter-by {
  display: flex;
  align-items: center;
  margin: 0 1rem;
  font-size: 1.3rem;

  * {
    pointer-events: none;
  }

  .icon-chevron-down--filter-by {
    width: 1.6rem;
    height: 1.6rem;
    fill: $color-white;
    margin-left: 0.5rem;
    transition: transform 0.2s ease-in-out;
  }
}

.filter-by-menu {
  position: absolute;
  right: 0;
  width: 125px;
  z-index: 101;
  display: none;

  ul {
    list-style: none;
    background: #262626;
    border-radius: 0 0 2px 2px;
    padding: 0.5rem 0;

    li {
      font-size: 1.4rem;
      padding: 1rem 2rem;
      cursor: pointer;

      &:hover {
        font-weight: 500;
      }
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

  @media (max-width: 768px) {
    justify-content: center;
  }

  .no-results,
  .no-prods {
    margin-top: 10rem;
    width: 100%;
    text-align: center;

    .btn--clear-filters {
      background: none;
      color: $color-white;
      border: 1px solid $color-white;
      text-transform: uppercase;
      padding: 1.2rem 2rem;
      transition: 0.2s ease-out;
      letter-spacing: 1px;
      font-size: 1.2rem;
      margin-top: 2rem;

      &:hover {
        letter-spacing: 2px;
      }
    }
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
        text-decoration: none;

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
