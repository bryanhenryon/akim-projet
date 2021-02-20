<template>
  <ul class="social">
    <li class="social__item">
      <a href="#" target="_blank" rel="noopener"
        ><svg class="icon icon-twitter">
          <use xlink:href="sprite.svg#icon-twitter"></use></svg
      ></a>
    </li>
    <li class="social__item">
      <a href="#" target="_blank" rel="noopener"
        ><svg class="icon icon-facebook">
          <use xlink:href="sprite.svg#icon-facebook"></use></svg
      ></a>
    </li>
    <li class="social__item">
      <a href="#" target="_blank" rel="noopener"
        ><svg class="icon icon-instagram">
          <use xlink:href="sprite.svg#icon-instagram"></use></svg
      ></a>
    </li>
    <li class="social__item">
      <a href="#" target="_blank" rel="noopener"
        ><svg class="icon icon-youtube">
          <use xlink:href="sprite.svg#icon-youtube"></use></svg
      ></a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.social {
  display: flex;
  flex-direction: column;
  list-style: none;

  &.mobile {
    flex-direction: row;
    justify-content: center;
    width: 100%;

    @media (max-width: 680px) {
      display: flex;
    }

    .social__item {
      margin-top: 0;
      margin-right: 5rem;

      &:last-child {
        margin-right: 0;
      }
    }

    .icon {
      fill: $color-white;
      height: 2rem;
      width: 2rem;
    }
  }

  @media (max-width: 680px) {
    display: none;
  }

  &__item:first-child {
    margin-top: 0;
  }

  &__item {
    margin-top: 10rem;
  }

  .icon {
    fill: $color-white;
    height: 2.5rem;
    width: 2.5rem;

    @media (max-width: 1024px) {
      height: 2rem;
      width: 2rem;
    }
  }
}
</style>
