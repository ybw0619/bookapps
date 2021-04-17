<template>
  <div class="home">
    <main-banner/>
    <!-- 메인 리스트 -->
    <div class="container mx-auto w-11/12 md:max-w-screen-lg tracking-tighter">
      <div class="h-36 md:h-48 flex justify-center items-center">
        <p class="font-gmarket font-extrabold text-3xl sm:text-4xl">오늘의 책을 검색해 보세요</p>
      </div>
    </div>
    <book-list path="home"></book-list>
  </div>
</template>

<script>
import BookList from '../components/BookList.vue'
import MainBanner from '../components/MainBanner.vue'
export default {
  name: "app",
  components: {
    BookList,
    MainBanner,
  },
}
</script>

<style>
  body.modal-active {
    overflow-y: hidden !important;
  }
</style>
