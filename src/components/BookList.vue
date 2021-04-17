<template>
  <div class="mx-auto w-11/12 md:max-w-screen-lg">
    <section class="text-textColor mt-5">
      <div class="flex-col">
        <div class="flex  mb-5">
          <!-- 검색창 -->
          <div class="flex w-full border border-1 border-gray-400 rounded-md divide-x-2 py-2 overflow-hidden">
            <select 
              v-model="searchOption"
              class="text-textColor bg-white border-purple-400 border-1 px-2 pr-5"
            >
                <option value="title">도서명</option>
                <option value="author">저자명</option>
              </select>
              <div class="flex w-full">
                <input
                  @keydown.enter="search"
                  v-model="q"
                  placeholder="검색어를 입력해주세요"
                  class="w-full text-textColor px-2"
                >
                <button 
                  class="mr-2"
                  @click="search"
                >
                  <svg class="search-icon w-5 fill-current text-yellow-500" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                  </svg>
                </button>
              </div>
          </div>
        </div>
        <!-- 북리스트 -->
        <div class="flex justify-start mb-5">
          <label class="flex items-center">
            <input
              @change="search"
              :disabled="path === 'my'"
              type="checkbox" 
              v-model="borrowShowOption"
              class="rounded 
                border-gray-300 
                text-textColor 
                focus:border-indigo-300 
                focus:ring 
                focus:ring-offset-0 
                focus:ring-indigo-200
                focus:ring-opacity-50"
            >
            <span class="ml-2 text-sm">대여가능 도서만</span>
          </label>
          <select
            @change="search"
            v-model="sortTarget" 
            class="ml-auto bg-white text-sm text-textColor border-purple-400 border-0 pt-0 pb-0 pl-1 pr-1 focus:outline-none"
          >
            <option value="title">도서명</option>
            <option value="author">저자명</option>
          </select>
          <select
            @change="search"
            v-model="sortOption" 
            class="ml-2 bg-white text-sm text-textColor border-purple-400 border-0 pt-0 pb-0 pl-1 pr-1 focus:outline-none"
          >
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>
      </div>
      
      <span>총 {{(path === 'home' ? total : myBooks.length)}}권</span>
        <div class="flex flex-wrap m-0">
          <book-card v-for="book in (path === 'home' ? books : filteredBooks)" :key="book.isbn" :book="book" @click.native="toggleModal(book)"/>
        </div>
    </section>

    <infinite-loading v-if="path==='home'" @infinite="infiniteHandler" ref="infiniteLoadingRef"></infinite-loading>

    <div class="modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
      <div class="modal-overlay  absolute w-full h-full bg-gray-900 opacity-50 z-50"></div>
      
      <div class="modal-container bg-white w-11/12 md:max-w-screen-md mx-auto shadow-lg z-50 overflow-y-auto">
        <div class="modal-content py-4 text-left px-6">
          
          <!--Title-->
          <div class="flex justify-between items-center">
            <div class="ml-auto modal-close cursor-pointer " @click="closeModal">
              <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <!--  -->
          <div class="flex flex-col">
            <div class="flex flex-col md:flex-row">
              <div class="flex flex-col justify-center items-center md:w-1/2">
              <img alt="bookImg" class="object-center h-60" :src="selectedBook.thumbnail">
            </div>
            <div class="flex flex-col md:w-1/2">
              <div class="mb-5" >
                <p class="text-md font-bold mb-1">개발도서</p>
                <p class="text-md font-bold mb-8">{{selectedBook.title}}</p>
                
                <p class="text-xs mb-3">줄거리 요약</p>
                <p class="text-xs">{{selectedBook.contents}}</p>
              </div>
              <div class="flex">
                <a 
                  v-for="(tag, i) in ['개발', '프로그래밍', '4차산업']"
                  :key="tag"
                  :class="i==0?'ml-0':'ml-3'"
                  class="text-xs p-1 px-2 bg-yellow-500 rounded-3xl mb-5 text-white">#{{tag}}</a>
              </div>
            </div>
            </div>
            <div class="flex flex-row  pt-2">
              <button v-if="user.id !== selectedBook.borrower" class="modal-close px-4 bg-gray-900 p-3 text-white hover:bg-gray-600 w-full" @click="borrowBook(selectedBook.id, user.id)">대여하기</button>
              <button v-if="user.id === selectedBook.borrower" class="modal-close px-4 bg-gray-900 p-3 text-white hover:bg-gray-600 w-full" @click="retrunBook(selectedBook.id, user.id)">반납하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import InfiniteLoading from 'vue-infinite-loading';
import BookCard from '../components/BookCard.vue'
import {sync} from 'vuex-pathify'
import BookList from '../components/BookList.vue'
import _ from 'lodash'

export default {
  components: { BookCard, BookList, InfiniteLoading },
  name: 'My',
  props: [
    'path'
  ],
  data(){
    return {
      favorites:[],
      total: 0,
      selectedBook: {},
      q:'',
      searchOption: 'title',
      borrowShowOption: false,
      page: 1,
      limit: 20,
      sortTarget: 'title',
      sortOption: 'asc',
    }
  },
  computed: {
    ...sync([
      'user', 
      'books',
      'myBooks',
    ]),
    filteredBooks(){
      let books = this.myBooks
      let borrow =  this.borrowShowOption
      let q = this.q
      let searchOption = this.searchOption
      let sortTarget = this.sortTarget
      let sortOption = this.sortOption
      
      // 도서명 조회
      if(searchOption === 'title'){
        return _.chain(books)
        .orderBy(sortTarget === 'title'? 'title' : 'authors', sortOption)
        .filter(book=>(
          book.title.toUpperCase().includes(q.toUpperCase())
          && (borrow ? book.borrower === null : true)
        ))
        .value()
      }
      // 저자명 조회
      else if(searchOption === 'author'){
        return _.chain(books)
        .orderBy(sortTarget === 'title'? 'title' : 'authors', sortOption)
        .filter(book => (
          book.authors.filter(author => {
            return author.toUpperCase().includes(q.toUpperCase())
          }).length > 0 && (borrow ? book.borrower === null : true)))
        .value()
      }
    }
  },
  async mounted() {
    let res = await axios.get('/api/borrow', {
      params: {
        id: this.user.id
      } 
    })
    this.myBooks = res.data
  },
  methods: {
    toggleModal(book) {
      this.selectedBook = book
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      modal.classList.remove('opacity-0')
      modal.classList.remove('pointer-events-none')
      body.classList.add('modal-active')
      this.$router.push({
        path : `/${this.path}`,
        query : {
          isMenuOpen : true
        }
      })
    },
    closeModal() {
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      modal.classList.add('opacity-0')
      modal.classList.add('pointer-events-none')
      body.classList.remove('modal-active')
      this.$router.replace({
        path : `/${this.path}`
      })
    },
    async borrowBook(bookId, userId) {
      let res = await axios.post('/api/borrow',{
        bookId,
        userId,
      })
      if(res.data.result === 'success'){
        this.myBooks = this.myBooks.map(book => {
          return book.id === bookId ? {
            ...book,
            borrower: userId
          } : book
        })
        this.books = this.books.map(book => {
          return book.id === bookId ? {
            ...book,
            borrower: userId
          } : book
        })
        alert(res.data.data.title+' 대여 성공')
        this.closeModal()
      }
      else{
        alert('대여 실패')
      }
    },
    async retrunBook(bookId, userId) {
      let res = await axios.post('/api/return',{
        bookId,
        userId,
      })
      if(res.data.result === 'success'){
        this.books = this.books.filter(book =>  book.id !== bookId)
        this.myBooks = this.myBooks.filter(book =>  book.id !== bookId)
        alert(res.data.data.title +' 반납 성공')
        this.closeModal()
      }
      else{
        alert('반납 실패')
      }
    },
    async infiniteHandler($state) {
      let books = await this.getBookList()
      this.books = this.books.concat(books)
      if(books.length < 20){
        $state.complete()
      }
      else{
        this.page += 1
        $state.loaded()
      }
    },
    async search() {
      if(this.path==='home'){
        this.books = []
        this.page = 1
        this.$refs.infiniteLoadingRef.stateChanger.reset()
      }
    },
    async getBookList(){
      let res = await axios.get('/api/books', {
        params: {
          q: this.q,
          searchOption: this.searchOption,
          borrow: this.borrowShowOption,
          page: this.page,
          limit: this.limit,
          sortTarget: this.sortTarget,
          sortOption: this.sortOption,
        } 
      })
      
      this.total = res.data.total
      return res.data.books
    },
  },
  watch:{
    $route(newVal, oldVal) {
      const body = document.querySelector('body')
      const modal = document.querySelector('.modal')
      if(newVal.query.isMenuOpen){
        modal.classList.remove('opacity-0')
        modal.classList.remove('pointer-events-none')
        body.classList.add('modal-active')

      } else{
        modal.classList.add('opacity-0')
        modal.classList.add('pointer-events-none')
        body.classList.remove('modal-active')
      }
    }
  }
}
</script>