<template>
  <div class="pt-16">
    <div class="container mx-auto w-11/12 md:max-w-screen-lg tracking-tighter">
      <div class="h-36 md:h-48 flex justify-center items-center">
        <p class="font-gmarket font-extrabold text-3xl sm:text-4xl">내 서재</p>
      </div>
    </div>
    <book-list path="my"></book-list>
  </div>
</template>
<script>
import BookList from '../components/BookList.vue'
export default {
  components: { BookList },
  name: 'My',
}
</script>