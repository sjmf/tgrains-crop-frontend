<template>
  <fragment>
    <!-- NAVIGATION -->
    <navbar-header
        :website-title="meta.websiteTitle"
        :website-url="meta.websiteUrl"
        :page-title="meta.pageTitle">
    </navbar-header>

    <!-- VALUE SELECT SIDEBAR -->
    <sidebar-menu ref="sidebarMenu"/>

    <!-- MAIN PAGE CONTENT -->
    <router-view @load="$refs.sidebarMenu.historyLoaded()"/>

    <!-- Modal for welcome message -->
    <modal-welcome id="modal-welcome"/>

    <!-- FOOTER -->
    <container-footer></container-footer>
  </fragment>
</template>

<script>
    import NavbarHeader from '@/components/NavbarHeader.vue'
    import SidebarMenu from '@/components/sidebar/SidebarMenu';
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
            ModalWelcome
        },
        data: () => {
            return {
                meta: {
                    pageTitle: 'TGRAINS <span class="hide-on-small-only">Crop Model</span>',
                    websiteTitle: 'TGRAINS Website',
                    websiteUrl: window.location.origin.replace('//model.', '//')
                },
                loading: false,
                error: false,
                timer: null
            }
        },
        /** Actions which occur on page-load **/
        mounted() {
            // Set not loading (edge case clear loader where page is reloaded while waiting for model query)
            this.$store.commit('loading', false)
            // Check if Vuex state was updated due to new code version:
            this.$store.dispatch('checkVersion')
            // Check for read-only status on load (as messages are cleared)
            this.$store.dispatch('checkReadOnlyAndWarn')
            // Set landscapeID from route params
            this.$store.commit("setLandscapeId", parseInt(this.$route.params.id));
            // Load the BAU state from the server
            this.$store.dispatch('loadBauState', false)
        },
        watch: {
          $route() {
            this.$store.commit("setLandscapeId", parseInt(this.$route.params.id));
          }
        }
    }
</script>