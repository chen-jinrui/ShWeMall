import '@/assets/scss/iconfont/iconfont.css';
import Vue from 'vue';
import App from './App.vue';
import router from '@/vue/router';
import Vuelidation from '@/vue/plugins/vuelidation';
import valid from '@/vue/mixin/valid';
import VueCountdown from '@/vue/plugins/vue-countdown';
// import FastClick from 'fastclick';
import {
	Waterfall,
	Lazyload,
	Toast,
	Tag,
	Dialog,
	Cell,
	CellGroup,
	Field,
	Icon,
	Button,
	Popup,
	loading
} from 'vant';

import axios from '@/vue/plugins/axios';
import util from '@/assets/js/util';
import filters from "@/vue/filter/";

// plugins
Vue.use(VueCountdown);
Vue.use(axios);
Vue.use(Vuelidation);
Vue.use(valid);

// vue
Vue.use(filters);
Vue.use(util);

// vant
Vue.use(Waterfall);
Vue.use(Lazyload, {
	preLoad: 1.3,
	error: '/static/img/goods_default.png',
	loading: '/static/img/goods_default.png',
	attempt: 1,
	listenEvents: ['scroll'],
	lazyComponent: true,
});

Vue.use(Tag);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Button);
Vue.use(Popup);
Vue.use(loading);
Toast.setDefaultOptions({
	duration: 1500
})
//FastClick.attach(document.body);
new Vue({
	el: '#app',
	router,
	render: h => h(App)
});
