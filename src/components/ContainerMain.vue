<template>
  <main>

    <!-- MAIN PAGE CONTENT -->
    <div class="row white no-margin">
      <AreaDisplayJumbotron/>
    </div>

    <div class="row">

      <!-- TAB DECLARATIONS -->
      <TabBar/>

      <!-- VISUALISATION CONTAINERS (TABBED) -->
      <ContainerVisualisations/>

      <div class="container col s12">
        <br><br>
      </div>

      <!-- COMMENTS CONTAINER -->
      <!-- Scaled-up feature. Currently disabled -->
      <!-- <ContainerComments/> -->

      <!-- Modal for welcome message -->
      <ModalWelcome/>

    </div>

  </main>
</template>

<script>
    import AreaDisplayJumbotron from "@/components/AreaDisplayJumbotron";
    import ModalWelcome from "@/components/ModalWelcome";
    import TabBar from "@/components/TabBar";
    import ContainerVisualisations from "@/components/ContainerVisualisations";

    export default {
        name: "ContainerMain",
        components: {ContainerVisualisations, TabBar, ModalWelcome, AreaDisplayJumbotron}
    }
</script>

