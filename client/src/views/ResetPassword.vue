<template>
  <div class="reset-password">
    <app-navbar />
    <app-roller-spinner v-if="isLoading"></app-roller-spinner>
    <div class="container">
      <h1>Nouveau mot de passe</h1>
      <form @submit.prevent="setNewPassword" class="reset-password__form">
        <div class="reset-password__form-group">
          <label for="new-password">Nouveau mot de passe</label>
          <input
            v-model="newPassword"
            type="password"
            id="new-password"
            placeholder="Entrez votre nouveau mot de passe"
          />
          <div class="reset-password__new-password-error">
            {{ newPasswordError }}
          </div>
        </div>
        <div class="reset-password__form-group">
          <label for="new-password-confirm"
            >Confirmation du nouveau mot de passe</label
          >
          <input
            v-model="newPasswordConfirm"
            type="password"
            id="new-password-confirm"
            placeholder="Confirmez votre nouveau mot de passe"
          />
          <div class="reset-password__new-password-confirm-error">
            {{ newPasswordConfirmError }}
          </div>
        </div>
        <button class="btn reset-password__change-password-btn">
          Valider
        </button>
      </form>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import RollerSpinner from "../components/spinners/RollerSpinner";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default {
  data() {
    return {
      isLoading: false,
      userToUpdatePassword: null,
      newPassword: "",
      newPasswordConfirm: "",
      newPasswordError: "",
      newPasswordConfirmError: ""
    };
  },
  computed: {
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    })
  },
  methods: {
    async setNewPassword() {
      this.validateNewPassword();
      this.validateNewPasswordConfirm();

      if (this.validateNewPassword() && this.validateNewPasswordConfirm()) {
        try {
          this.isLoading = true;

          await axios.patch(
            this.apiRoot +
              `reset-user-password/${this.userToUpdatePassword._id}`,
            {
              newPassword: this.newPassword
            }
          );

          this.isLoading = false;

          this.$router.push("/");

          const signInModal = document.querySelector(".sign-in-modal");
          const signInModalContent = document.querySelector(
            ".sign-in-modal__content"
          );

          signInModalContent.classList.add(
            "animate__animated",
            "animate__slideInDown",
            "animate__faster"
          );
          signInModal.classList.add("active");

          if (signInModal.classList.contains("active")) {
            window.addEventListener("click", e => {
              if (e.target === signInModal) {
                signInModal.classList.remove("active");
                this.$store.dispatch(
                  "signInModal/setPasswordSuccessfullyResetToFalse"
                );
              } else {
                return false;
              }
            });
          }

          this.$store.dispatch(
            "signInModal/setPasswordSuccessfullyResetToTrue"
          );
        } catch (error) {
          console.log(error);
        }
      }
    },
    validateNewPassword() {
      if (this.newPassword === "") {
        this.newPasswordError = "Veuillez indiquer votre nouveau mot de passe";
        return false;
      } else if (this.newPassword.length < 6) {
        this.newPasswordError =
          "Le mot de passe doit être d'au moins 6 caractères";
        return false;
      } else {
        this.newPasswordError = "";
      }
      return true;
    },
    validateNewPasswordConfirm() {
      if (this.newPasswordConfirm !== this.newPassword) {
        this.newPasswordConfirmError = "Les mots de passe ne correspondent pas";
        return false;
      } else {
        this.newPasswordConfirmError = "";
      }
      return true;
    }
  },
  components: {
    "app-navbar": Navbar,
    "app-footer": Footer,
    "app-roller-spinner": RollerSpinner
  },
  async created() {
    try {
      const res = await axios.post(this.apiRoot + "check-reset-token/:token", {
        token: this.$route.params.token
      });

      if (
        res.data.name === "JsonWebTokenError" ||
        res.data.name === "TokenExpiredError"
      ) {
        window.location.href = "/";
      }

      this.userToUpdatePassword = res.data;
    } catch {
      window.location.href = "/";
    }
  }
};
</script>

<style lang="scss" scoped>
.reset-password {
  color: $color-white;
  padding: 0 6rem;
  min-height: 100vh;
  background: linear-gradient(rgba(rgb(0, 0, 0), 0.7), rgba($color-black, 1)),
    url("../assets/img/profile-background.jpg") center center fixed;
  background-size: cover;

  @media (max-width: 768px) {
    padding: 0 2rem;
  }

  @media (max-width: 320px) {
    padding: 0 1rem;
  }

  &__form-group {
    margin-bottom: 5rem;

    label {
      display: block;
      margin-bottom: 1rem;
    }

    input {
      width: 100%;
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
  }

  &__new-password-error,
  &__new-password-confirm-error {
    margin-top: 1rem;
    color: #ff5367;
    font-size: 1.4rem;
  }

  &__change-password-btn {
    padding: 1rem 3rem;
    font-size: 1.3rem;
    flex: 1;
    font-weight: 500;
    background: $color-white;
    color: $color-black;
    text-transform: uppercase;
  }
}

.container {
  max-width: 400px;
  margin: 10rem auto;

  h1 {
    font-weight: 400;
    margin-bottom: 5rem;
  }
}
</style>
