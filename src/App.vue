<template>
  <fragment>
    <!-- NAVIGATION -->
    <NavbarHeader></NavbarHeader>

    <!-- VALUE SELECT SIDEBAR -->
    <SidebarMenu></SidebarMenu>

    <!-- MAIN PAGE CONTENT -->
    <ContainerMain></ContainerMain>

    <!-- FOOTER -->
    <ContainerFooter></ContainerFooter>
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
        }
    }
</script>
