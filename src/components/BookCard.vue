<template>
  <div
      class="
        relative
        w-1/3 sm:w-1/3 md:w-1/4 lg:w-1/4 xl:1/4 2xl:w-1/6 
        p-1   sm:p-2   md:p-3   lg:p-3   xl:p-3 2xl:p-4"
    >
      <a class="shadow-xl block relative h-auto">
        <img alt="bookImg" class="object-center w-full" :src="book.thumbnail">
        <img v-if="book.borrower === null" class="absolute top-5 -right-1" src="@/assets/img/borrowPossible.png">
        <img v-else-if="book.borrower === user.id" class="absolute top-5 -right-1" src="@/assets/img/borrowing.png">
        <img v-else-if="book.borrower !== null" class="absolute top-5 -right-1" src="@/assets/img/borrowImpossible.png">
      </a>
    <div 
      class="
        text-left
        mt-4 pb-2
        text-xs"
      >
      <p class=" mb-1 tracking-wide truncate font-bold">{{book.title}}</p>
      <p class="truncate text-gray-500" >
        {{`${book.authors[0]}${book.authors.length > 1 ? ` 외 ${book.authors.length - 1}인` :''}`}}
      </p>
    </div>
  </div>
</template>

<script>
import { sync } from 'vuex-pathify'
export default {
  name: 'BookCard',
  props:[
    'book'
  ],
  computed:{
    ...sync(['user'])
  }

}
</script>