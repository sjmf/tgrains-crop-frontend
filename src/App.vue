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

    import http from '@/services/http'
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
                await http.queryModel();
                clearTimeout(this.timer);
                this.loading = false;
            },
            async loadBAUState() {
                // If BAU object is empty, go get it
                let bau = store.state.bau[store.state.landscape_id]
                if(Object.keys(bau).length === 0 && bau.constructor === Object) {
                    console.log('Loading Strings and BAU state');
                    await http.loadStrings()
                    await http.loadBAUState()

                    // Populate Landscapes in Vuex using strings and cropAreas from BAU state
                    store.commit('populate')
                }
            }
        },
        mounted() {
            store.commit('closeError')
            this.loadBAUState()
        }
    }
</script>