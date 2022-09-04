<template>
	<LayoutHeader />
	<div>
		<router-view v-slot="{ Component }" :key="componentKey" @success="success" @error="error" @warning="warning"
			@forceUpdate="forceUpdate">
			<!-- Cache component and keep state while not rendered until its rendered again -->
			<keep-alive include="BooksView">
				<component :is="Component" />
			</keep-alive>
		</router-view>
	</div>
	<LayoutFooter />
</template>


<script>
import notie from 'notie';
import LayoutHeader from './components/LayoutHeader.vue';
import LayoutFooter from './components/LayoutFooter.vue';
import { store } from './components/store';

const getCookie = (name) => document.cookie.split('; ').reduce((acc, val) => {
	const splitIndex = val.indexOf('=');

	return val.substring(0, splitIndex) === name ? decodeURIComponent(val.substring(splitIndex + 1)) : acc;
}, '');

export default {
	name: 'Some-appp',
	components: {
		LayoutHeader,
		LayoutFooter
	},
	data() {
		return {
			store,
			componentKey: 0
		}
	},
	methods: {
		success(msg) {
			notie.alert({
				type: 'success',
				text: msg
			})
		},
		warning(msg) {
			notie.alert({
				type: 'warning',
				text: msg
			})
		},
		error(msg) {
			notie.alert({
				type: 'error',
				text: msg
			})
		},
		forceUpdate() {
			this.componentKey++;
		}
	},
	beforeMount() {
		const data = getCookie('_site_data');

		if (!data || data === 'undefined') {
			return;
		}
		const cookieData = JSON.parse(data);

		store.token = cookieData.token.token;
		store.user = {
			id: cookieData.user.id,
			first_name: cookieData.user.first_name,
			last_name: cookieData.user.last_name,
			email: cookieData.user.email,
		};
	},
}
</script>
