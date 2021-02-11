<template>
  <div>
    <router-view :key="$route.fullPath" />
    <app-sign-up-modal></app-sign-up-modal>
    <app-sign-in-modal></app-sign-in-modal>
  </div>
</template>

<script>
import SignUpModal from "./components/SignUpModal";
import SignInModal from "./components/SignInModal";
export default {
  components: {
    "app-sign-up-modal": SignUpModal,
    "app-sign-in-modal": SignInModal
  }
};
</script>

<style lang="scss" scoped></style>
