<template>
  <div class="pt-24 flex-strach flex flex-col max-w-screen-sm justify-center items-center mx-auto h-3/4">
    <div class="flex flex-col w-11/12 justify-center mx-auto">
      <p class="font-gmarket text-3xl">로그인</p>

      <label :class="err ? 'text-red-500' : ''" class="mt-5 text-sm" for="email">이메일</label>
      <input @keydown.enter="loginCheck(id, pw)" v-model="id" id="email" name="email" :class="err ? 'border-red-500' : 'border-gray-300'" class="border h-10" type="text" />
      <label :class="err ? 'text-red-500' : ''" class="mt-5 text-sm" for="email">비밀번호</label>
      <input @keydown.enter="loginCheck(id, pw)" v-model="pw" id="password" name="password" :class="err ? 'border-red-500' : 'border-gray-300'" class="border border-gray-300 w-full h-10" type="password"/>
      <button class="mt-5 text-center text-sm underline "> 비밀번호를 잊으셨나요?</button>
      <button @click="loginCheck(id, pw)" class="mt-5 border border-gray-300 h-12 bg-gray-900 text-white text-sm">로그인 하기</button>
      <button class="mt-5 border border-gray-300 h-12 text-sm">회원가입 하기</button>
      <button class="mt-10 border border-gray-300 h-12 bg-banner1 text-sm">카카오로 1초만에 시작하기</button>
    </div>
  </div>
</template>
<script>
import { sync, call } from 'vuex-pathify'
export default {
  name: 'Login',
  data(){
    return {
      id: '',
      pw: '',
      err: false,
    }
  },
  computed: {
    //vuex state isLogined
    ...sync(['isLogined'])
  },
  methods: {
    //vuex actions login
    ...call(['login']),
    // 로그인에러시 인풋박스 & 라벨 빨갛게 해주려고 한 겹 감쌈
    async loginCheck(id, pw){
      this.err = !await this.login({id, pw})
    }
  }
}
</script>