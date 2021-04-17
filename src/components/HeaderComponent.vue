<template>
  <header class="fixed w-full bg-white shadow-md  z-10">
    <div class="container mx-auto w-11/12 md:max-w-screen-lg flex items-center">
      <router-link class="items-center" to="/">
        <img src="@/assets/img/bookappsLogo.png" alt="logo" class="w-32 md:w-48">
      </router-link>
      
      <nav class="ml-auto flex items-center">
        <router-link tag="button" to="my" v-if="isLogined" class="flex items-center border border-gray-400 rounded-3xl border">
          <img v-if="isLogined" :src="user.thumbnail" class="h-8 w-8 rounded-3xl">
        </router-link>
        <router-link v-if="!isLogined" to="/login" class="text-center text-xs p-4 py-2 w-20 bg-yellow-500 rounded-3xl text-white">로그인</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
import { sync } from 'vuex-pathify'
export default {
  name: 'HeaderComponent',
  computed: {
    ...sync([
      'isLogined',
      'user'
    ])
  },
  mounted() {

  },
  methods: {
    logout() {
      this.isLogined = false
    }
  }
}
</script>