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

    <!-- Modal for welcome message -->
    <modal-welcome id="modal-welcome"/>

    <!-- FOOTER -->
    <container-footer></container-footer>
  </fragment>
</template>

<script>
    import NavbarHeader from '@/components/NavbarHeader.vue'
    import SidebarMenu from '@/components/SidebarMenu';
    import ContainerMain from '@/components/ContainerMain';
    import ContainerFooter from '@/components/ContainerFooter';
    import ModalWelcome from '@/components/modals/ModalWelcome';
    import store from "@/store";

    export default {
        name: 'App',
        store,
        components: {
            ContainerFooter,
            SidebarMenu,
            NavbarHeader,
            ContainerMain,
            ModalWelcome
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
            /**
             * Perform AJAX request to query the model
             */
            async doAJAX() {
                if (this.loading) return

                // Timeout prevents flash of loader in case of fast response
                this.timer = setTimeout(()=>{ this.loading = true }, 200);

                await this.$store.dispatch('queryModel')

                clearTimeout(this.timer);
                this.loading = false;
            },

            /**
             * Load Business-as-usual state, including Strings and Crop/Livestock Areas
             * (has the side-effect of populating the sidebar)
             */
            async loadBAUState() {
                await this.$store.dispatch('loadBauState')
            },

            /**
             * Notify SidebarMenu when history is loaded
             */
            stateLoaded() {
                this.$refs.sidebarMenu.historyLoaded()
            },
        },
        /** Actions which occur on page-load **/
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