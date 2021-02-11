<template>
  <form @submit.prevent="submit" class="form">
    <div class="form-group">
      <label for="profile-pic-file"
        >Image de profil <span class="indicator">(optionnel)</span></label
      >
      <input
        @change="fillProfilePicFileCustomTxt"
        type="file"
        name="profile-pic-file"
        id="profile-pic-file"
      />
      <button
        @click="triggerProfilePicFileBtn"
        type="button"
        class="btn profile-pic-file-custom-btn"
      >
        Choisir un fichier
      </button>
      <span class="profile-pic-file-custom-txt">Aucun fichier selectionné</span>
    </div>

    <div class="form-group">
      <input
        v-model="email"
        type="text"
        name="update-email"
        id="update-email"
        autocomplete="nope"
        spellcheck="false"
        placeholder="Email"
      />
      <svg class="icon icon-email">
        <use xlink:href="sprite.svg#icon-email"></use>
      </svg>
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        v-model="description"
        name="description"
        id="description"
        autocomplete="off"
        spellcheck="false"
        placeholder="Présentez-vous à la communauté..."
        rows="5"
      >
      </textarea>
    </div>

    <div class="form-group">
      <input
        v-model="soundcloud"
        type="text"
        name="soundcloud"
        id="soundcloud"
        autocomplete="off"
        spellcheck="false"
        placeholder="SoundCloud"
      />
      <svg class="icon icon-soundcloud">
        <use xlink:href="sprite.svg#icon-soundcloud"></use>
      </svg>
    </div>

    <div class="form-group">
      <input
        v-model="instagram"
        type="text"
        name="instagram"
        id="instagram"
        autocomplete="off"
        spellcheck="false"
        placeholder="Instagram"
      />
      <svg class="icon icon-instagram">
        <use xlink:href="sprite.svg#icon-instagram"></use>
      </svg>
    </div>

    <div class="form-group">
      <input
        v-model="youtube"
        type="text"
        name="youtube"
        id="youtube"
        autocomplete="off"
        spellcheck="false"
        placeholder="YouTube"
      />
      <svg class="icon icon-youtube">
        <use xlink:href="sprite.svg#icon-youtube"></use>
      </svg>
    </div>

    <div class="form-group">
      <input
        v-model="twitter"
        type="text"
        name="twitter"
        id="twitter"
        autocomplete="off"
        spellcheck="false"
        placeholder="Twitter"
      />
      <svg class="icon icon-twitter">
        <use xlink:href="sprite.svg#icon-twitter"></use>
      </svg>
    </div>

    <div class="form-group">
      <input
        v-model="facebook"
        type="text"
        name="facebook"
        id="facebook"
        autocomplete="off"
        spellcheck="false"
        placeholder="Facebook"
      />
      <svg class="icon icon-facebook">
        <use xlink:href="sprite.svg#icon-facebook"></use>
      </svg>
    </div>

    <div class="d-flex">
      <button class="btn btn--cancel" type="button" @click="$router.go(-1)">
        Annuler
      </button>
      <button class="btn btn--edit-profile" type="submit">
        Mettre à jour
      </button>
    </div>
  </form>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  data() {
    return {
      profilePicture: "",
      email: "",
      description: "",
      soundcloud: "",
      instagram: "",
      youtube: "",
      twitter: "",
      facebook: ""
    };
  },
  computed: {
    ...mapState(["user", "jwt"])
  },
  methods: {
    submit() {
      const bodyFormData = new FormData();
      bodyFormData.append("profilePicture", this.profilePicture);

      const realProfilePicFileBtn = document.getElementById("profile-pic-file");

      if (realProfilePicFileBtn.files[0]) {
        const profilePicFileName = realProfilePicFileBtn.files[0].name;
        bodyFormData.append("profilePictureToDisplay", profilePicFileName);
      }

      bodyFormData.append("email", this.email);
      bodyFormData.append("description", this.description);
      bodyFormData.append("soundcloud", this.soundcloud);
      bodyFormData.append("instagram", this.instagram);
      bodyFormData.append("youtube", this.youtube);
      bodyFormData.append("twitter", this.twitter);
      bodyFormData.append("facebook", this.facebook);

      axios({
        method: "patch",
        url: "http://localhost:3000/api/users/me" || "/api/users/me",
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: this.jwt
        }
      })
        .then(() => {
          axios.get("http://localhost:3000/api/users/me" || "/api/users/me", {
            headers: {
              "Authorization": this.jwt
            }
          })
          .then(res => {
            const parsedSessionUser = JSON.parse(localStorage.getItem("user"));
            parsedSessionUser.profilePicture = res.data.profilePicture;

            localStorage.setItem("user", JSON.stringify(parsedSessionUser));
            this.$store.dispatch("setUser", JSON.parse(localStorage.getItem("user")));
          }) 
        })
        .then(() => {
          this.$router.push("/profil/" + this.user.username);
        })
        .catch(error => {
          console.log(error);
        });
    },
    triggerProfilePicFileBtn() {
      document.getElementById("profile-pic-file").click();
    },
    fillProfilePicFileCustomTxt() {
      const realProfilePicFileBtn = document.getElementById("profile-pic-file");
      const profilePictureFileCustomTxt = document.querySelector(
        ".profile-pic-file-custom-txt"
      );

      const fileName = realProfilePicFileBtn.files[0].name;
      profilePictureFileCustomTxt.innerHTML = fileName;

      const file = realProfilePicFileBtn.files[0];
      this.profilePicture = file;
    }
  },
  created() {
    axios
      .get("http://localhost:3000/api/users/me" || "/api/users/me", {
        headers: { Authorization: this.jwt }
      })
      .then(res => {
        this.profilePicture = res.data.profilePicture;
        (this.email = res.data.email),
          (this.description = res.data.description),
          (this.soundcloud = res.data.soundcloud),
          (this.instagram = res.data.instagram),
          (this.youtube = res.data.youtube),
          (this.twitter = res.data.twitter),
          (this.facebook = res.data.facebook);

        const profilePictureFileCustomTxt = document.querySelector(
          ".profile-pic-file-custom-txt"
        );

        if (res.data.profilePicture !== "profile-picture-placeholder.png") {
          profilePictureFileCustomTxt.innerHTML =
            res.data.profilePictureToDisplay;
        }
      })
      .catch(e => console.log(e));
  }
};
</script>

<style lang="scss" scoped>
.form-group {
  margin: 5rem 0;
  position: relative;

  label {
    display: block;
    margin-bottom: 1rem;

    .indicator {
      font-size: 1.3rem;
      margin-left: 0.5rem;
    }
  }

  input {
    width: 100%;
  }

  #profile-pic-file {
    display: none;
  }

  .profile-pic-file-custom-btn {
    border: 1px solid $color-white;
    padding: 1rem 2rem;
    margin-right: 1.5rem;
    font-size: 1.4rem;
  }

  .profile-pic-file-custom-txt {
    font-size: 1.4rem;
  }

  #update-email,
  #soundcloud,
  #instagram,
  #youtube,
  #twitter,
  #facebook {
    background: none;
    border: none;
    border-bottom: 1px solid $color-white;
    padding: 0 0.5rem 0.5rem 4rem;
    color: inherit;
    outline: none;

    &::placeholder {
      color: rgba($color-white, 0.7);
    }
  }

  #description {
    font-family: inherit;
    background: none;
    border: none;
    border-bottom: 1px solid $color-white;
    border-top: 1px solid $color-white;
    padding: 1rem;
    color: inherit;
    outline: none;
    resize: vertical;
    width: 100%;

    &::-webkit-scrollbar {
      display: none;
    }

    &::placeholder {
      color: rgba($color-white, 0.7);
    }
  }

  .icon-email,
  .icon-soundcloud,
  .icon-instagram,
  .icon-youtube,
  .icon-twitter,
  .icon-facebook {
    fill: $color-white;
    height: 1.6rem;
    width: 1.6rem;
    position: absolute;
    left: 1rem;
    bottom: 0.7rem;
  }
}

.btn--cancel,
.btn--edit-profile {
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

.btn--edit-profile {
  background: $color-white;
  color: $color-black;
  text-transform: uppercase;
}
</style>
