<template>
	<LayoutHeader />
	<div>
		<router-view v-slot="{ Component }" :key="componentKey" @displaySuccess="displaySuccess" @displayError="displayError" @displayWarning="displayWarning"
			@forceUpdate="forceUpdate">
			<!-- Cache component and keep state while not rendered until its rendered again -->
			<keep-alive include="BooksView">
				<component :is="Component" />
			</keep-alive>
		</router-view>
	</div>
	<LayoutFooter />
</template>


<script lang="ts">
import notie from 'notie';
import LayoutHeader from './components/LayoutHeader.vue';
import LayoutFooter from './components/LayoutFooter.vue';
import { store } from './components/store';
import { defineComponent } from 'vue';

const getCookie = (name: string): string => document.cookie.split('; ').reduce((acc, val) => {
	const splitIndex = val.indexOf('=');

	return val.substring(0, splitIndex) === name ? decodeURIComponent(val.substring(splitIndex + 1)) : acc;
}, '');

export default defineComponent({
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
		displaySuccess(msg: string) {
			notie.alert({
				type: 'success',
				text: msg
			})
		},
		displayWarning(msg: string) {
			notie.alert({
				type: 'warning',
				text: msg
			})
		},
		displayError(msg: string) {
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
});
</script>
