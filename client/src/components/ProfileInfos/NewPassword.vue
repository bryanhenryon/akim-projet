<template>
  <div>
    <app-roller-spinner v-if="isLoading"></app-roller-spinner>
    <form @submit.prevent="submit" class="new-password">
      <div class="form-group">
        <input
          v-model.trim="currentPassword"
          type="password"
          name="current-password"
          id="current-password"
          spellcheck="false"
          placeholder="Mot de passe actuel"
        />
        <div v-if="currentPasswordError" class="current-password-error">
          {{ currentPasswordError }}
        </div>
      </div>
      <div class="form-group">
        <input
          v-model.trim="newPassword"
          type="password"
          name="new-password"
          id="new-password"
          spellcheck="false"
          placeholder="Nouveau mot de passe"
        />
        <div v-if="newPasswordError" class="new-password-error">
          {{ newPasswordError }}
        </div>
      </div>
      <div class="form-group">
        <input
          v-model.trim="confirmNewPassword"
          type="password"
          name="confirm-new-password"
          id="confirm-new-password"
          spellcheck="false"
          placeholder="Confirmer le nouveau mot de passe"
        />
        <div v-if="confirmNewPasswordError" class="confirm-new-password-error">
          {{ confirmNewPasswordError }}
        </div>
      </div>
      <div class="d-flex">
        <button class="btn btn--cancel" type="button" @click="$router.go(-1)">
          Annuler
        </button>
        <button class="btn btn--validate" type="submit">
          Mettre à jour
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapGetters } from "vuex";
import RollerSpinner from "../spinners/RollerSpinner";
export default {
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      currentPasswordError: "",
      newPasswordError: "",
      confirmNewPasswordError: "",
      isLoading: false,
      currentPasswordIsValid: false,
      newPasswordIsValid: false,
      confirmNewPasswordIsValid: false
    };
  },
  computed: {
    ...mapState(["user", "jwt"]),
    ...mapGetters("global", {
      apiRoot: "getApiRoot"
    })
  },
  components: {
    "app-roller-spinner": RollerSpinner
  },
  methods: {
    submit() {
      this.validateForm();

      if (
        this.currentPasswordIsValid &&
        this.newPasswordIsValid &&
        this.confirmNewPasswordIsValid
      ) {
        this.isLoading = true;

        axios
          .patch(
            this.apiRoot + "users/me/new-password",
            {
              currentPassword: this.currentPassword,
              newPassword: this.newPassword
            },
            {
              headers: {
                Authorization: this.jwt
              }
            }
          )
          .then(() => {
            this.isLoading = false;
            this.$router.push("/profil/" + this.user.username);
          })
          .catch(e => {
            this.isLoading = false;
            this.currentPasswordError = e.response.data.password;
          });
      }
    },
    validateForm() {
      if (this.currentPassword === "") {
        this.currentPasswordError =
          "Veuillez indiquer votre mot de passe actuel";
        this.currentPasswordIsValid = false;
      } else {
        this.currentPasswordIsValid = true;
        this.currentPasswordError = "";
      }

      if (this.newPassword === "") {
        this.newPasswordError = "Veuillez indiquer le nouveau mot de passe";
        this.newPasswordIsValid = false;
      } else if (this.newPassword.length < 6) {
        this.newPasswordError =
          "Le mot de passe doit être d'au moins 6 caractères";
        this.newPasswordIsValid = false;
      } else {
        this.newPasswordIsValid = true;
        this.newPasswordError = "";
      }

      if (this.confirmNewPassword === "") {
        this.confirmNewPasswordError =
          "Veuillez confirmer le nouveau mot de passe";
        this.confirmNewPasswordIsValid = false;
      } else if (this.newPassword !== this.confirmNewPassword) {
        this.confirmNewPasswordError = "Les mots de passe ne correspondent pas";
        this.confirmNewPasswordIsValid = false;
      } else {
        this.confirmNewPasswordIsValid = true;
        this.confirmNewPasswordError = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  margin: 5rem 0;
  position: relative;

  #current-password,
  #new-password,
  #confirm-new-password {
    width: 100%;
    background: none;
    border: none;
    border-bottom: 1px solid $color-white;
    padding: 0 0.5rem 0.5rem 1rem;
    color: inherit;
    outline: none;

    &::placeholder {
      color: rgba($color-white, 0.7);
    }
  }

  .current-password-error,
  .new-password-error,
  .confirm-new-password-error {
    margin-top: 1rem;
    color: #ff5367;
    font-size: 1.4rem;
  }
}

.btn--cancel,
.btn--validate {
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

.btn--validate {
  background: $color-white;
  color: $color-black;
  text-transform: uppercase;
}
</style>
