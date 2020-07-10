<template>
  <fragment>
    <!-- NAVIGATION -->
    <navbar-header
        :website-title="meta.websiteTitle"
        :website-url="meta.websiteUrl"
        :page-title="meta.pageTitle">
    </navbar-header>

    <!-- VALUE SELECT SIDEBAR -->
    <sidebar-menu @submitForm="doAJAX($event)" @checkBAULoaded="loadBAUState()"></sidebar-menu>

    <!-- MAIN PAGE CONTENT -->
    <container-main :loading="loading"></container-main>

    <!-- FOOTER -->
    <container-footer></container-footer>
  </fragment>
</template>

<script>
    import NavbarHeader from '@/components/NavbarHeader.vue'
    import SidebarMenu from '@/components/SidebarMenu';
    import ContainerMain from '@/components/ContainerMain';
    import ContainerFooter from '@/components/ContainerFooter';

    import store from "@/store";

    export default {
        name: 'App',
        components: {
            ContainerFooter,
            SidebarMenu,
            NavbarHeader,
            ContainerMain
        },
        data: () => {
            return {
                meta: {
                    pageTitle: 'TGRAINS <span class="hide-on-small-only">Crop Model</span>',
                    websiteTitle: 'TGRAINS Website',
                    websiteUrl: 'https://tgrains.com'
                },
                loading: false,
                error: false,
                timer: null
            }
        },
        methods: {
            async doAJAX() {
                // Timeout prevents flash of loader in case of fast response
                this.timer = setTimeout(()=>{ this.loading = true }, 200);

                await store.dispatch('queryModel')

                clearTimeout(this.timer);
                this.loading = false;
            },
            async loadBAUState() {
                await store.dispatch('loadBauState')
            }
        },
        mounted() {
            // Check if Vuex state was updated due to new code version:
            if(store.state.versionHash !== process.env.VUE_APP_GIT_HASH) {
                console.info(store.state.versionHash, '=>', process.env.VUE_APP_GIT_HASH)
                store.commit('resetVuexDefaults')
                console.warn("Vuex store reloaded from defaults due to changed version hash ", process.env.VUE_APP_GIT_HASH)
            }

            // Close errors on clean reload
            store.commit('closeError')
            // Load the BAU state from the server
            this.loadBAUState()
        }
    }
</script>