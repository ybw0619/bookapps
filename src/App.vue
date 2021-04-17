<template>
  <div id="app" class="h-screen h-full bg-p1">
    <header-component />
    <router-view/>
    <footer-component/>
  </div>
</template>
<script>
import axios from 'axios'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
export default {
  name: "app",
  components: {
    HeaderComponent,
    FooterComponent
  },
}
</script>

<style lang="scss">

</style>
