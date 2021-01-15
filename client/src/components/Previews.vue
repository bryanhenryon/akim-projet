<template>
  <section class="previews">
    <h2 class="news">Derniers ajouts</h2>
    <div class="cards">
      <div class="card">
        <div class="image">
          <img
            src="https://i.pinimg.com/originals/b4/75/00/b4750046d94fed05d00dd849aa5f0ab7.jpg"
            draggable="false"
            alt=""
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
            <source src="@/assets/music/sweaters.mp3" type="audio/mpeg" />
          </audio>
        </div>
        <div class="bottom">
          <div class="infos">
            <div class="title">Titre du beat</div>
            <div class="author">Auteur du beat</div>
          </div>
          <button class="btn btn--buy">
            <span>23, 99€</span>
            <svg class="icon icon-shopping-cart">
              <use xlink:href="sprite.svg#icon-shopping-cart"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="card">
        <div class="image">
          <img
            src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2017/12/attachment_68585523.jpg?auto=format&q=60&fit=max&w=930"
            draggable="false"
            alt=""
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
            <source src="@/assets/music/a-samurais-death.mp3" type="audio/mpeg" />
          </audio>
        </div>
        <div class="bottom">
          <div class="infos">
            <div class="title">Titre du beat</div>
            <div class="author">Auteur du beat</div>
          </div>
          <button class="btn btn--buy">
            <span>23, 99€</span>
            <svg class="icon icon-shopping-cart">
              <use xlink:href="sprite.svg#icon-shopping-cart"></use>
            </svg>
          </button>
        </div>
      </div>
      <div class="card">
        <div class="image">
          <img
            src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/rose-mixtape-album-cover-art-template-design-59c928b377e5f0e8e9aabc4982ca7e14_screen.jpg?ts=1588828036"
            draggable="false"
            alt=""
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
            <source src="@/assets/music/mask-off.mp3" type="audio/mpeg" />
          </audio>
        </div>
        <div class="bottom">
          <div class="infos">
            <div class="title">Titre du beat</div>
            <div class="author">Auteur du beat</div>
          </div>
          <button class="btn btn--buy">
            <span>23, 99€</span>
            <svg class="icon icon-shopping-cart">
              <use xlink:href="sprite.svg#icon-shopping-cart"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="card">
        <div class="image">
          <img
            src="https://images-na.ssl-images-amazon.com/images/I/717VbeZb0bL._AC_SX466_.jpg"
            draggable="false"
            alt=""
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
            <source src="@/assets/music/decouverte.mp3" type="audio/mpeg" />
          </audio>
        </div>
        <div class="bottom">
          <div class="infos">
            <div class="title">Titre du beat</div>
            <div class="author">Auteur du beat</div>
          </div>
          <button class="btn btn--buy">
            <span>23, 99€</span>
            <svg class="icon icon-shopping-cart">
              <use xlink:href="sprite.svg#icon-shopping-cart"></use>
            </svg>
          </button>
        </div>
      </div>
      <div class="card">
        <div class="image">
          <img
            src="https://zerojackerzz.com/wp-content/uploads/2019/10/album-placeholder.png"
            draggable="false"
            alt=""
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
            <source src="@/assets/music/sweaters.mp3" type="audio/mpeg" />
          </audio>
        </div>
        <div class="bottom">
          <div class="infos">
            <div class="title">Titre du beat</div>
            <div class="author">Auteur du beat</div>
          </div>
          <button class="btn btn--buy">
            <span>23, 99€</span>
            <svg class="icon icon-shopping-cart">
              <use xlink:href="sprite.svg#icon-shopping-cart"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    play(e) {
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
        audio.pause();
      } else {
        e.currentTarget.classList.add("active");
        audio.play();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.previews {
  margin-top: 8rem;
  padding: 3rem 6rem;

  @media (max-width: 680px) {
    padding: 3rem 2rem;
  }

  .news {
    font-size: 3.6rem;
    letter-spacing: 0.5px;
  }

  .cards {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;

    .card {
      color: $color-black;
      border-radius: 3px;
      width: 250px;
      margin: 4rem;

      @media (max-width: 350px) {
        margin: 4rem 0;
      }

      .image {
        border-radius: 2px;
        transition: 0.1s ease-in-out;
        position: relative;

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
        color: #fff;
        margin-top: 1rem;

        .infos {
          margin-right: 1rem;

          .title {
            font-weight: 500;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;

            &:hover {
              text-decoration: underline;
            }
          }

          .author {
            font-size: 1.4rem;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .btn--buy {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          border: none;
          background: none;
          outline: none;
          cursor: pointer;
          background: rgb(216, 25, 25);
          font-weight: 600;
          font-family: "Roboto", sans-serif;
          color: #fff;
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
}
</style>
