<template>
  <fragment>
    <!-- NAVIGATION -->
    <navbar-header
        :website-title="meta.websiteTitle"
        :website-url="meta.websiteUrl"
        :page-title="meta.pageTitle">
    </navbar-header>

    <!-- VALUE SELECT SIDEBAR -->
    <sidebar-menu @submitForm="doAJAX($event)"
                  @checkBAULoaded="loadBAUState()"
                  ref="sidebarMenu">
    </sidebar-menu>

    <!-- MAIN PAGE CONTENT -->
    <container-main :loading="loading"
                    @load="stateLoaded()">
    </container-main>

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
        store,
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
                if (this.loading) return

                // Timeout prevents flash of loader in case of fast response
                this.timer = setTimeout(()=>{ this.loading = true }, 200);

                await this.$store.dispatch('queryModel')

                clearTimeout(this.timer);
                this.loading = false;
            },
            async loadBAUState() {
                await this.$store.dispatch('loadBauState')
            },
            stateLoaded() {
                this.$refs.sidebarMenu.historyLoaded()
            }
        },
        mounted() {
            // Check if Vuex state was updated due to new code version:
            this.$store.dispatch('checkVersion')
            // Clear messages on clean reload
            this.$store.commit('clearMessages')
            // Load the BAU state from the server
            this.loadBAUState()
        }
    }
</script>