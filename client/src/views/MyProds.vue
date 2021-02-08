<template>
  <div class="my-prods">
    <app-navbar></app-navbar>
    <div
      v-if="prodToDelete"
      class="confirm-modal animate__animated animate__fadeIn animate__faster"
    >
      <div class="confirm-modal__content">
        <h3 class="confirm-modal__title">Supprimer</h3>
        <p class="confirm-modal__info">
          Êtes-vous sûr de vouloir supprimer ce morceau ?
        </p>
        <div class="d-flex align-items-center justify-content-center">
          <img
            class="confirm-modal__prod-img"
            :src="
              'http://localhost:3000/api/prods/images/' + prodToDelete.cover ||
                'api/prods/images/' + prodToDelete.cover
            "
            alt="Couverture du morceau à supprimer"
          />
          <div class="confirm-modal__prod-title">{{ prodToDelete.title }}</div>
          <span class="confirm-modal__prod-format">{{
            prodToDelete.format
          }}</span>
        </div>
        <button class="btn confirm-modal__cancel-btn" @click="hideConfirmModal">
          Annuler
        </button>
        <button
          class="btn confirm-modal__delete-btn"
          @click="deleteProd(prodToDelete)"
        >
          Supprimer
        </button>
      </div>
    </div>
    <div class="my-prods__container">
      <router-link
        v-if="!noProd"
        to="/compte/prods/ajouter"
        class="btn btn--add-prod"
      >
        <svg class="icon icon-plus">
          <use xlink:href="sprite.svg#icon-plus"></use>
        </svg>
        Ajouter une prod
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
      <div v-if="noProd" class="no-prod">
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
      <div v-if="noResult" class="no-result">
        Aucun résultat trouvé
      </div>
      <table class="table" v-for="(prod, index) of prods" :key="index">
        <thead>
          <th>Couverture</th>
          <th>Titre</th>
          <th>Format</th>
          <th>Tags</th>
          <th>Prix</th>
          <th>Streams max</th>
          <th colspan="2">Actions</th>
        </thead>
        <tbody>
          <tr>
            <td data-label="Couverture">
              <img
                :src="
                  'http://localhost:3000/api/prods/images/' + prod.cover ||
                    '/uploads/api/prods/images/' + prod.cover
                "
                alt="Couverture de la prod"
              />
            </td>
            <td data-label="Titre">{{ prod.title }}</td>
            <td data-label="Format">
              <span class="format">{{ prod.format.toUpperCase() }}</span>
            </td>

            <td v-if="prod.tags.length !== 0" data-label="Tags">
              <span v-for="(tag, index) of prod.tags" :key="index">{{
                tag
              }}</span>
            </td>
            <td v-else data-label="Tags">Aucun</td>

            <td data-label="Prix">{{ prod.price }}€</td>
            <td v-if="prod.maxStreams" data-label="Streams max">
              {{ prod.maxStreams }}
            </td>
            <td v-else data-label="Streams max">Illimité</td>
            <td data-action="Action">
              <button class="btn btn--edit">
                Modifier
                <svg class="icon icon-edit">
                  <use xlink:href="sprite.svg#icon-edit"></use>
                </svg>
              </button>
            </td>
            <td>
              <button class="btn btn--delete" @click="showConfirmModal(prod)">
                Supprimer
                <svg class="icon icon-bin">
                  <use xlink:href="sprite.svg#icon-bin"></use>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import "animate.css";
import axios from "axios";
import { mapState } from "vuex";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default {
  data() {
    return {
      prods: null,
      noResult: null,
      noProd: null,
      prodToDelete: null
    };
  },
  computed: {
    ...mapState(["user"])
  },
  components: {
    "app-navbar": Navbar,
    "app-footer": Footer
  },
  methods: {
    fetchUserProds() {
      axios
        .get("http://localhost:3000/api/prods" || "/api/prods")
        .then(res => {
          const prods = res.data;
          const filteredProds = prods.filter(
            prod => prod.artist === this.user.username.toLowerCase()
          );
          this.prods = filteredProds;
          this.prods.length === 0
            ? (this.noProd = true)
            : (this.noProd = false);
        })
        .catch(err => console.log(err));
    },

    deleteProd(prodToDelete) {
      axios
        .delete(
          "http://localhost:3000/api/prods/" + prodToDelete._id ||
            "/api/prods/" + prodToDelete._id
        )
        .then(() => {
          this.hideConfirmModal();
          this.fetchUserProds();
        });
    },
    showConfirmModal(prod) {
      this.prodToDelete = prod;
    },
    hideConfirmModal() {
      const confirmModal = document.querySelector(".confirm-modal");
      confirmModal.classList.remove("active");
      this.prodToDelete = null;
    },
    searchProd(e) {
      const searchValue = e.target.value.toLowerCase();
      axios
        .get(
          "http://localhost:3000/api/prods/" + this.user.username ||
            "/api/prods/" + this.user.username
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
          "http://localhost:3000/api/prods/" + this.user.username ||
            "/api/prods/" + this.user.username
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
          "http://localhost:3000/api/prods/" + this.user.username ||
            "/api/prods/" + this.user.username
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
    }
  },
  created() {
    this.fetchUserProds();
  }
};
</script>

<style lang="scss" scoped>
.my-prods {
  position: relative;
  color: $color-white;
  padding: 3rem 6rem;
  background: linear-gradient(rgba(rgb(0, 0, 0), 0.7), rgba($color-black, 1)),
    url("../assets/img/profile-background.jpg") center center fixed;
  background-size: cover;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 320px) {
    padding: 3rem 1rem;
  }

  &__container {
    max-width: 1350px;
    margin: 10rem auto;

    .btn--add-prod {
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

      .icon-plus {
        height: 15px;
        width: 15px;
        fill: $color-white;
        margin-right: 1rem;
      }
    }
  }
}

.confirm-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba($color-black, 0.9);
  z-index: 1000;
  width: 100%;
  height: 100%;

  &__content {
    margin: 10% auto;
    text-align: center;
    width: 95%;
    max-width: 450px;
    border-radius: 5px;
    padding: 2rem;
    letter-spacing: 0.5px;

    @media (max-width: 480px) {
      margin: 0;
      width: 100%;
    }
  }

  &__title {
    font-size: 2.8rem;
  }

  &__info {
    margin: 1rem 0 3rem 0;
  }

  &__prod-title {
    font-size: 1.4rem;
  }

  &__prod-img {
    height: 70px;
    width: 70px;
    margin-right: 2rem;
    object-fit: cover;
  }

  &__prod-title {
    margin-right: 4rem;
  }

  &__prod-format {
    font-size: 1.2rem;
    background: $color-white;
    color: $color-black;
    padding: 0.5rem 1rem;
    font-weight: bold;
    border-radius: 0.5rem;
    text-transform: uppercase;
  }

  &__cancel-btn,
  &__delete-btn {
    padding: 1rem 2rem;
    border-radius: 5px;
    font-weight: bold;
    letter-spacing: 0.5px;
    margin-top: 5rem;
  }

  &__cancel-btn {
    background: $color-white;
    color: $color-black;
  }

  &__delete-btn {
    background: red;
    margin-left: 3rem;
  }
}

.utils-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5rem;

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

.no-prod {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20rem 0;

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

.no-result {
  text-align: center;
  margin: 20rem 0;
}

.table {
  width: 100%;
  margin: 0 auto 10rem auto;
  text-align: center;
  border-collapse: collapse;

  &,
  tbody,
  tr,
  td {
    @media (max-width: 1024px) {
      display: block;
      width: 100%;
    }
  }

  thead {
    @media (max-width: 1024px) {
      display: none;
    }
  }

  th {
    padding: 0 2rem 1rem 0rem;
  }

  td:last-child {
    padding-right: 0;
  }

  td {
    border-top: 1px solid $color-white;
    padding: 1rem 2rem 0 0rem;

    .format {
      font-size: 1.2rem;
      background: $color-white;
      color: $color-black;
      padding: 0.5rem 1rem;
      font-weight: bold;
      border-radius: 0.5rem;
    }

    .btn--delete,
    .btn--edit {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto 0 auto;
      padding: 1rem 2rem;
      border-radius: 5px;
      font-size: 1.3rem;
      font-weight: 600;

      @media (max-width: 1024px) {
        margin: 0 0 0 auto;
      }
    }

    .btn--delete {
      background: rgb(216, 25, 25);

      .icon-bin {
        height: 15px;
        width: 15px;
        fill: $color-white;
        margin-left: 1rem;
      }
    }

    .btn--edit {
      background: #f0ad4e;

      .icon-edit {
        height: 15px;
        width: 15px;
        fill: $color-white;
        margin-left: 1rem;
      }
    }

    @media (max-width: 1024px) {
      text-align: right;
      padding: 2rem 0 2rem 50%;

      position: relative;
      border: none;

      &::before {
        content: attr(data-label);
        position: absolute;
        left: 0;
        width: 50%;
        padding-left: 15px;
        font-size: 15px;
        font-weight: bold;
        text-align: left;
      }

      &::after {
        content: attr(data-action);
        position: absolute;
        left: 0;
        top: 100%;
        padding-left: 15px;
        font-size: 15px;
        font-weight: bold;
        text-align: left;
      }
    }

    img {
      height: 50px;
      width: 50px;
      object-fit: cover;
    }
  }
}
</style>
