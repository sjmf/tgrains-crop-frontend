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
              v-bind:key="index+0"
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
      <div class="container">
        <div id="production-tab" class="col s12">
          <TabProduction :chart-height="chartHeight"/>
        </div>

        <div id="environment-tab" class="col s12">
          <TabEnvironment :chart-height="chartHeight*1.25"/>
        </div>

        <div id="nutrition-tab" class="col s12">
          <TabNutrition :chart-height="chartHeight"/>
        </div>

        <div id="history-tab" class="col s12">
          <TabHistory @load="(index) => $emit('load', index)"
                      @comment="(index) => $refs.containerComments.attachState(index)"/>
        </div>
      </div>

      <div class="container col s12">
        <br/>
      </div>

      <!-- COMMENTS CONTAINER -->
      <container-comments ref="containerComments"/>

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
    import LoadingOverlay from "@/components/LoadingOverlay";
    import VizDebug from "@/components/visualisations/VizDebug";
    import ContainerComments from "@/components/comments/ContainerComments";
    import MessageBox from "@/components/MessageBox";
    import TabHistory from "@/components/tabs/TabHistory";
    import TabEnvironment from "@/components/tabs/TabEnvironment";
    import TabProduction from "@/components/tabs/TabProduction";
    import TabNutrition from "@/components/tabs/TabNutrition";

    export default {
        name: "ContainerMain",
        components: {
            LoadingOverlay,
            TabHistory,
            TabEnvironment,
            TabProduction,
            TabNutrition,
            TabBar,
            ModalWelcome,
            LandscapeJumbotron,
            VizDebug,
            ContainerComments,
            MessageBox
        },
        props: {
            loading: Boolean
        },
        data (){
            return {
                chartHeight: 125,
            }
        }
    }
</script>