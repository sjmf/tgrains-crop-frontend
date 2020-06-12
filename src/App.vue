<template>
  <fragment>
    <!-- NAVIGATION -->
    <navbar-header
        :website-title="meta.websiteTitle"
        :website-url="meta.websiteUrl"
        :page-title="meta.pageTitle">
    </navbar-header>

    <!-- VALUE SELECT SIDEBAR -->
    <sidebar-menu></sidebar-menu>

    <!-- MAIN PAGE CONTENT -->
    <container-main></container-main>

    <!-- FOOTER -->
    <container-footer></container-footer>
  </fragment>
</template>

<script>
    import NavbarHeader from '@/components/NavbarHeader.vue'
    import SidebarMenu from "@/components/SidebarMenu";
    import ContainerMain from "@/components/ContainerMain";
    import ContainerFooter from "@/components/ContainerFooter";

    export default {
        name: 'App',
        components: {
            ContainerFooter,
            SidebarMenu,
            NavbarHeader,
            ContainerMain
        },
        data: function() {
            return {
                meta: {
                    pageTitle: 'TGRAINS <span class="hide-on-small-only">Crop Model</span>',
                    websiteTitle: 'TGRAINS Website',
                    websiteUrl: 'https://tgrains.com'
                }
            }
        }
    }

</script>
