<template>
  <div class="content-container">
    <div class="content">
      <h1>
        Phrase d'accroche importante pour le référencement
      </h1>
      <form class="searchbar" @submit.prevent="search">
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
          placeholder="Rechercher un artiste, un titre ou un genre"
          v-model="searchValue"
        />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchValue: null
    };
  },
  methods: {
    search() {
      const routeConfig = {
        path: "/prods",
        query: { search: this.searchValue }
      };

      this.$router.push(routeConfig);
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
      background: #fff;
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      align-items: center;
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
        font-size: 2rem;
        margin: 0 0.5rem;
        width: 100%;
        letter-spacing: 0.5px;

        &::placeholder {
          color: #a9a9a9;
          font-family: "Roboto", sans-serif;
          font-weight: 300;
          font-size: 1.8rem;

          @media (max-width: 480px) {
            font-size: 1.4rem;
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
        }
      }
    }
  }
}
</style>
