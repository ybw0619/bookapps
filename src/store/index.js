import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router';
import pathify, { 
  make
} from 'vuex-pathify'
Vue.use(Vuex)

let state = {
  isLogined: false,
  user: {},
  books: [],
  myBooks: [],
}

// state의 key로 mutation에 getter & setter를 자동으로 만든다
let mutations = make.mutations(state)

let actions = {
  async login({commit}, {id, pw}) {
    let res = await axios.post('/api/login', {
      id,
      pw,
    })
    let result = res.data.length > 0
    if(result){
      // vuex pathify 사용시 자동명명 규칙에 의해 작성된 mutaition명이다.
      commit('SET_USER', res.data[0])
      commit('SET_IS_LOGINED', true)
      router.push('/');
    }
    return result
	},
  logout({ commit }) {
		commit('SET_IS_LOGINED', false)
	}
}

const store = {
  state,
  mutations,
  actions,
}

export default new Vuex.Store({
  plugins: [ pathify.plugin ],
  ...store
})
