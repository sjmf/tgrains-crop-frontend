<template>
  <main>

    <loading-overlay :loading="loading" :offset="true"/>

    <!-- MAIN PAGE CONTENT -->
    <landscape-jumbotron/>

    <div class="row">

      <!-- ERROR BANNER -->
      <error-message/>

      <!-- TAB DECLARATIONS -->
      <tab-bar/>

      <!-- VISUALISATION CONTAINERS (TABBED) -->
      <tab-visualisations/>

      <div class="container col s12">
        <br><br>
      </div>

      <!-- COMMENTS CONTAINER -->
      <!-- Scaled-up version feature. Currently disabled -->
      <!-- <container-comments/> -->

      <!-- Modal for welcome message -->
      <modal-welcome/>

    </div>
  </main>
</template>

<script>
    import LandscapeJumbotron from "@/components/LandscapeJumbotron";
    import ModalWelcome from "@/components/ModalWelcome";
    import TabBar from "@/components/TabBar";
    import TabVisualisations from "@/components/TabVisualisations";
    import LoadingOverlay from "@/components/LoadingOverlay";
    import ErrorMessage from "@/components/ErrorMessage";

    export default {
        name: "ContainerMain",
        components: {ErrorMessage, LoadingOverlay, TabVisualisations, TabBar, ModalWelcome, LandscapeJumbotron},
        props: {
            loading: Boolean
        }
    }
</script>