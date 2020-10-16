<template>
  <main>

    <loading-overlay :loading="loading" :offset="true"/>

    <!-- MAIN PAGE CONTENT -->
    <landscape-jumbotron/>

    <div class="row">

      <!-- ERROR/MESSAGE BANNERS -->
      <div class="col s12 white">
        <transition-group name="fade" tag="div">
          <message-box
              v-for="(message, index) in this.$store.state.messages"
              v-bind:key="index"
              v-bind:message="message.message"
              v-bind:kind="message.kind"
              v-bind:callback="message.callback"
              v-bind:callbackText="message.callbackText"
              v-bind:index="index"/>
        </transition-group>
      </div>

      <!-- TAB DECLARATIONS -->
      <tab-bar/>

      <!-- VISUALISATION CONTAINERS (TABBED) -->
      <tab-visualisations/>

      <div class="container col s12">
        <br><br>
      </div>

      <!-- COMMENTS CONTAINER -->
      <container-comments/>

      <div class="container col s12">
        <br><br>
      </div>

      <!-- DEBUG INFORMATION -->
      <viz-debug/>

      <!-- Modal for welcome message -->
      <modal-welcome/>

    </div>
  </main>
</template>

<script>
    import LandscapeJumbotron from "@/components/LandscapeJumbotron";
    import ModalWelcome from "@/components/ModalWelcome";
    import TabBar from "@/components/tabs/TabBar";
    import TabVisualisations from "@/components/tabs/TabVisualisations";
    import LoadingOverlay from "@/components/LoadingOverlay";
    import VizDebug from "@/components/visualisations/VizDebug";
    import ContainerComments from "@/components/comments/ContainerComments";
    import MessageBox from "@/components/MessageBox";

    export default {
        name: "ContainerMain",
        components: {
            LoadingOverlay,
            TabVisualisations,
            TabBar,
            ModalWelcome,
            LandscapeJumbotron,
            VizDebug,
            ContainerComments,
            MessageBox
        },
        props: {
            loading: Boolean
        }
    }
</script>