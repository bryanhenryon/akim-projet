<template>
  <div>
    <router-view />
    <app-sign-up-modal></app-sign-up-modal>
    <app-sign-in-modal></app-sign-in-modal>
    <app-player></app-player>
  </div>
</template>

<script>
import SignUpModal from "./components/SignUpModal";
import Player from "./components/Player";
import SignInModal from "./components/SignInModal";
export default {
  components: {
    "app-sign-up-modal": SignUpModal,
    "app-player": Player,
    "app-sign-in-modal": SignInModal
  }
};
</script>
