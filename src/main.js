import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'
import { makeServer } from "./server"
import 'overlayscrollbars/css/OverlayScrollbars.css'
import { OverlayScrollbarsPlugin} from 'overlayscrollbars-vue'
 
Vue.use(OverlayScrollbarsPlugin)

Vue.config.productionTip = false

if (process.env.NODE_ENV === "development") {
  makeServer()
}

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
