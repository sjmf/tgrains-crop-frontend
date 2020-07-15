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

      <!-- DEBUG INFORMATION -->
      <div class="container">
        <div class="col s12">
          <a class="right smalltext" @click="showDebug = !showDebug">Toggle Debug information</a>
        </div>
        <viz-debug v-if="showDebug"/>
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
    import VizDebug from "@/components/VizDebug";

    export default {
        name: "ContainerMain",
        components: {
            ErrorMessage,
            LoadingOverlay,
            TabVisualisations,
            TabBar,
            ModalWelcome,
            LandscapeJumbotron,
            VizDebug
        },
        props: {
            loading: Boolean
        },
        data() {
            return {
                showDebug: false
            }
        }
    }
</script>

<style scoped>
  .smalltext {
    font-size:0.8rem;
    color: #9e9e9e;
    text-decoration: underline;
  }
</style>