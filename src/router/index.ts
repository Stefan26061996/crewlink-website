import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
} from 'vue-router'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'home',
		component: () => import('../views/HomeView.vue'),
		meta: { title: 'Crewlink' },
	},
	{
		path: '/impressum.html',
		name: 'imprint',
		component: () => import('../views/ImprintView.vue'),
		meta: { title: 'Impressum - Crewlink' },
	},
	{
		path: '/datenschutz.html',
		name: 'privacy-policy',
		component: () => import('../views/PrivacyPolicyView.vue'),
		meta: { title: 'Datenschutzerklärung - Crewlink' },
	},
	{
		path: '/agb.html',
		name: 'terms',
		component: () => import('../views/TermsView.vue'),
		meta: { title: 'AGB - Allgemeine Geschäftsbedingungen - Crewlink' },
	},
	{
		path: '/daten-loeschen.html',
		name: 'delete-data',
		component: () => import('../views/DeleteDataView.vue'),
		meta: { title: 'Datenlöschung - Crewlink' },
	},
	{
		path: '/@:username',
		name: 'deep-link-profile',
		component: () => import('../views/OpenInAppView.vue'),
		meta: { title: 'Crewlink', deepLink: true },
	},
	{
		path: '/events/:id',
		name: 'deep-link-event',
		component: () => import('../views/OpenInAppView.vue'),
		meta: { title: 'Crewlink', deepLink: true },
	},
	{
		path: '/listings/:id',
		name: 'deep-link-listing',
		component: () => import('../views/OpenInAppView.vue'),
		meta: { title: 'Crewlink', deepLink: true },
	},
	{
		path: '/index.html',
		redirect: '/',
	},
	{
		path: '/open.html',
		name: 'open-html',
		component: () => import('../views/OpenInAppView.vue'),
		meta: { title: 'Crewlink', deepLink: true, },
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

router.afterEach((to) => {
	const title = to.meta.title
	if (typeof title === 'string') {
		document.title = title
	}
})

export default router
