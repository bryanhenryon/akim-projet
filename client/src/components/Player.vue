<template>
  <div class="player">
    <div class="utils">
      <div class="track-infos">
        <div class="track-infos__image">
          <img
            v-if="song"
            :src="song.image"
            alt="Couverture du morceau"
            draggable="false"
          />
        </div>
        <div class="track-infos__container">
          <div v-if="song" class="track-infos__track-name">
            {{ song.title }}
          </div>
          <router-link
            :to="'/profil/' + song.artist"
            v-if="song"
            class="track-infos__artist-name"
          >
            {{ song.artist }}
          </router-link>
        </div>
      </div>
      <div class="controller">
        <button class="btn btn--previous-track" @click="previous">
          <svg class="icon icon-controller-jump-to-start">
            <use xlink:href="sprite.svg#icon-controller-jump-to-start"></use>
          </svg>
        </button>
        <button class="btn btn--play2" @click="play">
          <svg class="icon icon-controller-play">
            <use xlink:href="sprite.svg#icon-controller-play"></use>
          </svg>
          <svg class="icon icon-pause">
            <use xlink:href="sprite.svg#icon-pause"></use>
          </svg>
        </button>
        <button class="btn btn--next-track" @click="next">
          <svg class="icon icon-controller-next">
            <use xlink:href="sprite.svg#icon-controller-next"></use>
          </svg>
        </button>
        <button class="btn btn--loop" @click="loop">
          <svg class="icon icon-loop">
            <use xlink:href="sprite.svg#icon-loop"></use>
          </svg>
        </button>
      </div>
      <div class="sound">
        <button class="btn btn--sound" @click="mute">
          <svg class="icon icon-volume-medium">
            <use xlink:href="sprite.svg#icon-volume-medium"></use>
          </svg>
          <svg class="icon icon-volume-mute2">
            <use xlink:href="sprite.svg#icon-volume-mute2"></use>
          </svg>
        </button>
        <input
          v-model="songVolume"
          type="range"
          class="volume"
          name="volume"
          min="0.0"
          max="1.0"
          step="any"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      songVolume: null
    };
  },
  watch: {
    songVolume() {
      const soundBtn = document.querySelector(".btn--sound");
      this.song.target.nextSibling.volume = this.songVolume;
      this.$store.dispatch("player/setSongVolume", this.songVolume);

      if (this.song.target.nextSibling.volume === 0) {
        this.song.target.nextSibling.muted = true;
        soundBtn.classList.add("active");
      } else {
        this.song.target.nextSibling.muted = false;
        soundBtn.classList.remove("active");
      }
    }
  },
  computed: {
    ...mapGetters({
      song: "player/getPlayingSong",
      songVolume2: "player/getSongVolume"
    })
  },
  methods: {
    play() {
      const isPlaying = this.song.target.classList.contains("active");
      if (isPlaying) {
        this.song.target.classList.remove("active");
        document.querySelector(".btn--play2").classList.remove("playing");
        this.song.target.nextSibling.pause();
      } else {
        this.song.target.classList.add("active");
        this.song.target.nextSibling.play();
        document.querySelector(".btn--play2").classList.add("playing");
      }
    },
    loop() {
      const loopBtn = document.querySelector(".btn--loop");
      loopBtn.classList.toggle("active");

      if (loopBtn.classList.contains("active")) {
        this.song.target.nextSibling.loop = true;
      } else {
        this.song.target.nextSibling.loop = false;
      }
    },
    mute() {
      const soundBtn = document.querySelector(".btn--sound");
      soundBtn.classList.toggle("active");

      if (soundBtn.classList.contains("active")) {
        this.song.target.nextSibling.muted = true;
      } else {
        this.song.target.nextSibling.muted = false;
      }
    },
    previous() {
      document.querySelector(".btn--play2").classList.add("playing");

      if (this.song.targetIndex === 0) {
        this.song.targetIndex =
          document.querySelectorAll(".btn--play").length - 1;
      } else {
        this.song.targetIndex = this.song.targetIndex - 1;
      }

      const nextIndex = this.song.targetIndex;
      const nextTarget = document.querySelectorAll(".btn--play")[nextIndex];
      const nextCard = nextTarget.parentElement.parentElement;

      const audio = nextTarget.nextSibling;
      const card = nextCard;
      const artist = card.querySelector(".author").textContent;
      const title = card.querySelector(".title").textContent;

      audio.volume = this.songVolume2;

      const playButtons = document.querySelectorAll(".btn--play");
      for (const playButton of playButtons) {
        if (playButton.classList.contains("active")) {
          playButton.classList.remove("active");
          playButton.nextSibling.pause();
        }

        if (playButton !== nextTarget) {
          playButton.nextSibling.currentTime = 0;
        }
      }

      const isPlaying = nextTarget.classList.contains("active");

      if (isPlaying) {
        nextTarget.remove("active");
        audio.pause();
        this.song.target.nextSibling.muted = true;
      } else {
        nextTarget.classList.add("active");
        audio.play();
        this.song.target.nextSibling.muted = false;
        if (
          document.querySelector(".btn--sound").classList.contains("active")
        ) {
          audio.muted = true;
        }
      }

      const playingSong = {
        target: nextTarget,
        targetIndex: nextIndex,
        artist: artist,
        title: title,
        image: nextTarget.previousSibling.src,
        audio: audio
      };

      this.$store.dispatch("player/playingSong", playingSong);
    },
    next() {
      document.querySelector(".btn--play2").classList.add("playing");

      if (
        this.song.targetIndex ===
        document.querySelectorAll(".btn--play").length - 1
      ) {
        this.song.targetIndex = 0;
      } else {
        this.song.targetIndex = this.song.targetIndex + 1;
      }

      const nextIndex = this.song.targetIndex;
      const nextTarget = document.querySelectorAll(".btn--play")[nextIndex];
      const nextCard = nextTarget.parentElement.parentElement;

      const audio = nextTarget.nextSibling;
      const card = nextCard;
      const artist = card.querySelector(".author").textContent;
      const title = card.querySelector(".title").textContent;

      audio.volume = this.songVolume2;

      const playButtons = document.querySelectorAll(".btn--play");
      for (const playButton of playButtons) {
        if (playButton.classList.contains("active")) {
          playButton.classList.remove("active");
          playButton.nextSibling.pause();
        }

        if (playButton !== nextTarget) {
          playButton.nextSibling.currentTime = 0;
        }
      }

      const isPlaying = nextTarget.classList.contains("active");

      if (isPlaying) {
        nextTarget.remove("active");
        audio.pause();
        this.song.target.nextSibling.muted = true;
      } else {
        nextTarget.classList.add("active");
        audio.play();
        this.song.target.nextSibling.muted = false;
        if (
          document.querySelector(".btn--sound").classList.contains("active")
        ) {
          audio.muted = true;
        }
      }

      const playingSong = {
        target: nextTarget,
        targetIndex: nextIndex,
        artist: artist,
        title: title,
        image: nextTarget.previousSibling.src,
        audio: audio
      };

      this.$store.dispatch("player/playingSong", playingSong);
    }
  }
};
</script>

<style lang="scss" scoped>
.player {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0a0a09;
  transform: translateY(100vh);
  transition: transform 0.5s ease-in-out;
  padding: 0 6rem;
  color: $color-white;
  margin-top: 100px;

  @media (max-width: 680px) {
    padding: 0 2rem;
  }

  &.playing {
    transform: translateY(0);
  }

  .utils {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1100px;
    padding: 1.5rem 0;

    .track-infos {
      display: flex;
      align-items: center;
      flex: 1;

      &__image {
        height: 5rem;
        width: 5rem;

        @media (max-width: 320px) {
          display: none;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      &__container {
        margin-left: 1rem;
      }

      &__track-name {
        font-weight: 500;
        margin-bottom: 0.5rem;

        @media (max-width: 480px) {
          font-size: 1.4rem;
        }

        &:hover {
          text-decoration: underline;
        }
      }

      &__artist-name {
        font-size: 1.4rem;
        text-decoration: none;
        color: inherit;

        @media (max-width: 480px) {
          font-size: 1.2rem;
        }

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .controller {
      display: flex;
      align-items: center;
      position: relative;
      flex: 1;

      @media (max-width: 1024px) {
        justify-content: flex-start;
      }

      @media (max-width: 480px) {
        justify-content: flex-end;
      }

      .icon-controller-jump-to-start {
        fill: $color-white;
        height: 2.5rem;
        width: 2.5rem;
      }

      .btn--play2 {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid $color-white;
        border-radius: 50%;
        margin: 0 2rem;

        @media (max-width: 480px) {
          margin: 1rem;
        }

        &.playing {
          .icon-controller-play {
            display: none;
          }
          .icon-pause {
            display: flex;
          }
        }

        .icon-controller-play,
        .icon-pause {
          display: flex;
          align-items: center;
          justify-content: center;
          fill: $color-white;
          height: 3.5rem;
          width: 3.5rem;
          padding: 0.5rem;

          @media (max-width: 480px) {
            height: 3rem;
            width: 3rem;
          }
        }

        .icon-controller-play {
          transform: translateX(1.5px);
        }

        .icon-pause {
          display: none;
        }
      }

      .icon-controller-next {
        fill: $color-white;
        height: 2.5rem;
        width: 2.5rem;
      }

      .btn--loop {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 3rem;

        @media (max-width: 380px) {
          display: none;
        }

        &.active {
          .icon-loop {
            fill: #7cfc00;
          }
        }

        .icon-loop {
          fill: #ccc;
          height: 1.6rem;
          width: 1.6rem;
        }
      }
    }
    .sound {
      display: flex;
      align-items: center;

      @media (max-width: 1024px) {
        display: none;
      }

      &.off {
        .btn--sound {
          display: none;
        }

        .btn--sound-muted {
          display: block;
        }
      }
    }

    .btn--sound.active {
      .icon-volume-medium {
        display: none;
      }

      .icon-volume-mute2 {
        display: block;
      }
    }

    .icon-volume-medium,
    .icon-volume-mute2 {
      fill: $color-white;
      height: 2rem;
      width: 2rem;
    }

    .icon-volume-mute2 {
      display: none;
    }

    .volume {
      /* Enlève le style par défaut des navigateurs */
      -webkit-appearance: none;
      width: 100%;
      background: transparent;
      margin-left: 1.5rem;
      margin-top: -3px;

      /* Enlève le style par défaut des navigateurs */
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
      }

      /* Enlève le style par défaut des navigateurs */
      &:focus {
        outline: none;
      }

      /* Enlève le style par défaut des navigateurs */
      &::-ms-track {
        width: 100%;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        color: transparent;
      }

      &::-webkit-slider-thumb {
        // &::-moz-range-thumb,
        //&::-ms-thumb
        -webkit-appearance: none;
        height: 1.6rem;
        width: 1.6rem;
        border-radius: 50%;
        background: $color-white;
        cursor: grab;
        margin-top: -0.6rem;
      }

      &::-moz-range-thumb {
        -webkit-appearance: none;
        height: 1.6rem;
        width: 1.6rem;
        border: none;
        outline: none;
        border-radius: 50%;
        background: $color-white;
        cursor: grab;
        margin-top: -0.5rem;
      }

      &::-webkit-slider-runnable-track {
        width: 100%;
        height: 3px;
        background: $color-white;
        border-radius: 100px;
        cursor: pointer;
      }

      &::-moz-range-track {
        width: 100%;
        height: 5px;
        background: $color-white;
        border-radius: 100px;
        cursor: pointer;
      }
    }
  }
}
</style>
