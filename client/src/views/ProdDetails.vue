<template>
  <div class="prod-details">
    <app-navbar></app-navbar>
    <div class="container">
      <div class="cover-infos-wrapper" v-if="prod">
        <div class="image-wrapper">
          <img
            :src="apiRoot + 'prods/images/' + prod.cover"
            alt="Couverture de la prod"
          />
        </div>
        <div class="infos-buy">
          <h1 class="infos__title">{{ prod.title }}</h1>
          <ul class="infos">
            <li class="infos__artist">
              Artiste :
              <router-link :to="'/profil/' + prod.artist">{{
                prod.artist
              }}</router-link>
            </li>
            <li class="infos__creation">Ajoutée le : {{ prodCreationDate }}</li>
            <li>
              Format :
              <span class="infos__format">{{ prod.format.toUpperCase() }}</span>
            </li>
            <li v-if="prod.tags.length !== 0" class="infos__tags">
              Tags :
              <span v-for="(tag, index) of prod.tags" :key="index">{{
                tag
              }}</span>
            </li>
            <li v-else class="infos__tags">Tags : Aucun</li>
            <li v-if="prod.maxStreams" class="infos__max-streams">
              Max streams : {{ prod.maxStreams }}
            </li>
            <li v-else class="infos__max-streams">Max streams : illimité</li>
            <li class="infos__price">Prix : {{ prod.price }}€</li>
          </ul>
          <div ref="paypal" class="paypal"></div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default {
  data() {
    return {
      prod: null,
      loaded: false,
      product: {
        price: null,
        description: "description!!!"
      }
    };
  },
  components: {
    "app-navbar": Navbar,
    "app-footer": Footer
  },
  computed: {
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    }),
    prodCreationDate() {
      const date = new Date(this.prod.createdAt);
      return (
        date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
      );
    }
  },
  methods: {
    setLoaded() {
      this.loaded = true;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: this.product.description,
                  amount: {
                    value: this.product.price
                  }
                }
              ]
            });
          },
          onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
              alert(
                "Transaction completed by " + details.payer.name.given_name
              );
            });
          }
        })
        .render(".paypal")
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
  },
  async mounted() {
    const script = document.createElement("script");
    script.src =
      "https://www.paypal.com/sdk/js?client-id=ARrBwGf7HfFOGXrvKTj6-oncPpq_l9ZRkBz4iGfi3KKH2FjvmZaheUK-hesVULH2uTMe2g-9CdEQqbDJ&disable-funding=credit,card";
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  created() {
    axios
      .get(this.apiRoot + "prod/" + this.$route.params.id)
      .then(res => {
        this.prod = res.data;
        this.product.price = res.data.price;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss" scoped>
.prod-details {
  color: $color-white;
  padding: 3rem 6rem;
  min-height: 100vh;
  background: linear-gradient(rgba(rgb(0, 0, 0), 0.7), rgba($color-black, 1)),
    url("../assets/img/profile-background.jpg") center center fixed;
  background-size: cover;

  @media (max-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (max-width: 320px) {
    padding: 3rem 2rem;
  }
}

.container {
  max-width: 600px;
  margin: 10rem auto;

  @media (max-width: 768px) {
    margin: 5rem auto;
  }
}

.cover-infos-wrapper {
  display: flex;

  @media (max-width: 768px) {
    display: block;
    max-width: 300px;

    margin: 0 auto;
  }
}

.image-wrapper {
  height: 300px;
  margin-right: 5rem;
  flex: 1;
  @media (max-width: 768px) {
    margin-right: 0;
    height: 250px;
    margin-bottom: 1rem;
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}

.infos-buy {
  flex: 1;
  h1 {
    margin-bottom: 2rem;
  }

  .infos {
    list-style: none;
    margin-bottom: 2rem;

    li {
      margin-bottom: 1.2rem;

      a {
        color: inherit;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__format {
      font-size: 1.2rem;
      background: $color-white;
      color: $color-black;
      padding: 0.5rem 1rem;
      margin-left: 0.5rem;
      font-weight: bold;
      border-radius: 0.5rem;
    }

    &__tags span {
      font-size: 1.2rem;
      padding: 0.5rem 1rem;
      background: #262626;
      border-radius: 0.5rem;
      display: inline-block;
      margin: 0.5rem;
      color: $color-white;
    }
  }
}
</style>
