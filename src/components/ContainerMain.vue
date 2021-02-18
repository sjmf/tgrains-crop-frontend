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
              v-bind:title="message.title"
              v-bind:kind="message.kind"
              v-bind:callbacks="message.callbacks"
              v-bind:callbackInnerHTML="message.callbackInnerHTML"
              v-bind:dismissible="message.dismissible"
              v-bind:timeout="message.timeout"
              v-bind:index="index"/>
        </transition-group>
      </div>

      <!-- TAB DECLARATIONS -->
      <tab-bar/>

      <!-- VISUALISATION CONTAINERS (TABBED) -->
      <div class="col s12">
        <div class="container">
          <keep-alive>
            <router-view @load="(index) => $emit('load', index)"
                         @comment="(index) => $refs.containerComments.attachState(index)"
                         :chart-height="chartHeight"/>
          </keep-alive>
        </div>
      </div>

      <div class="container col s12">
        <br/>
      </div>

      <!-- COMMENTS CONTAINER -->
      <container-comments ref="containerComments"
                          @load="$emit('load')"/>

      <!-- DEBUG INFORMATION -->
      <viz-debug/>
    </div>
  </main>
</template>

<script>
    import LandscapeJumbotron from "@/components/LandscapeJumbotron";
    import TabBar from "@/components/tabs/TabBar";
    import LoadingOverlay from "@/components/LoadingOverlay";
    import VizDebug from "@/components/visualisations/VizDebug";
    import ContainerComments from "@/components/comments/ContainerComments";
    import MessageBox from "@/components/MessageBox";

    export default {
        name: "ContainerMain",
        components: {
            LoadingOverlay,
            TabBar,
            LandscapeJumbotron,
            VizDebug,
            ContainerComments,
            MessageBox
        },
        computed: {
            loading () {
              return this.$store.state.loading;
            }
        },
        data (){
            return {
                chartHeight: 125,
            }
        }
    }
</script>