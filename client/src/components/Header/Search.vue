<template>
  <div class="content-container">
    <div class="content">
      <h1>
        Phrase d'accroche importante pour le référencement
      </h1>
      <form class="searchbar" @submit.prevent="search">
        <div class="d-flex align-items-center">
          <button type="submit">
            <svg class="icon icon-search">
              <use xlink:href="sprite.svg#icon-search"></use>
            </svg>
          </button>
          <input
            type="text"
            name=""
            spellcheck="false"
            class="searchbar-input"
            placeholder="Que recherchez-vous ?"
            v-model="searchValue"
          />
          <button
            @click="showFilterMenu"
            type="button"
            class="btn btn--filter-by"
          >
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
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchValue: null,
      filterBy: "Tous"
    };
  },
  methods: {
    search() {
      const routeConfig = {
        path: "/prods",
        query: { search: this.searchValue }
      };

      this.$router.push(routeConfig);
    },
    setFilter(filter) {
      this.filterBy = filter;
      this.$store.dispatch("prodsList/setFilterBy", filter);
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
        filterMenu.style.transform = "scale(1)";

        window.addEventListener("click", e => {
          e.target !== btnFilter
            ? this.hideFilterMenu(btnFilter, filterMenu, iconChevronDown)
            : false;
        });
      } else {
        iconChevronDown.style.transform = "rotate(0)";
        filterMenu.style.transform = "scale(0)";
      }
    },
    hideFilterMenu(btnFilter, filterMenu, iconChevronDown) {
      btnFilter.classList.remove("active");
      iconChevronDown.style.transform = "rotate(0)";
      filterMenu.style.transform = "scale(0)";
    }
  }
};
</script>

<style lang="scss" scoped>
.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 700px;
    margin: 0 10rem;

    @media (max-width: 1024px) {
      width: 525px;
    }

    @media (max-width: 750px) {
      width: 425px;
    }

    @media (max-width: 680px) {
      margin: 0rem;
      max-width: 100%;
    }

    h1 {
      font-size: 4rem;
      margin-bottom: 2rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.4;

      @media (max-width: 1024px) {
        font-size: 2.8rem;
      }

      @media (max-width: 480px) {
        font-size: 2.4rem;
      }
    }

    .searchbar {
      position: relative;
      background: #fff;
      border-radius: 0.3rem;
      padding: 1rem;
      width: 100%;

      @media (max-width: 480px) {
        padding: 0.5rem;
      }

      &:hover {
        box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1);
      }

      input[type="text"] {
        border: none;
        outline: none;
        border-radius: 0.5rem;
        font-size: 1.8rem;
        margin: 0 0.5rem;
        width: 100%;

        &::placeholder {
          color: rgba($color-black, 0.6);
          font-family: "Roboto", sans-serif;

          @media (max-width: 480px) {
            font-size: 1.4rem;
          }
        }
      }

      .btn--filter-by {
        display: flex;
        align-items: center;
        margin: 0 1rem;
        color: rgba($color: $color-black, $alpha: 1);
        font-size: 1.6rem;
        padding-left: 1rem;
        border-left: 1px solid rgba($color: $color-black, $alpha: 0.2);

        @media (max-width: 480px) {
          font-size: 1.4rem;
        }

        * {
          pointer-events: none;
        }

        .icon-chevron-down--filter-by {
          width: 1.8rem;
          height: 1.8rem;
          fill: rgba($color: $color-black, $alpha: 1);
          margin-left: 0.5rem;
          transition: transform 0.2s ease-in-out;
        }
      }

      .filter-by-menu {
        position: absolute;
        right: 0;
        width: 125px;
        z-index: 101;
        margin-top: 20px;
        transform: scale(0);
        transition: transform 0.1s ease-in-out;
        transform-origin: top;

        ul {
          list-style: none;
          background: $color-white;
          border-radius: 5px;
          padding: 0.5rem 0;

          li {
            font-size: 1.6rem;
            padding: 1rem 2rem;
            cursor: pointer;
            color: $color-black;
            &:hover {
              font-weight: 500;
            }

            @media (max-width: 480px) {
              font-size: 1.4rem;
            }
          }
        }
      }

      button[type="submit"] {
        display: flex;
        background: none;
        border: none;
        outline: none;
        padding: 1rem;
        cursor: pointer;

        .icon-search {
          height: 1.6rem;
          width: 1.6rem;
          fill: rgba($color: $color-black, $alpha: 1);
        }
      }
    }
  }
}
</style>
