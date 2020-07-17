<template>
  <div class="white">
    <div class="container">
      <div class="row no-margin flex">
        <div class="col s12 m8 color-text">
          <p class="h1-label hide-on-small-only">Selected area:</p>
          <h1 id="area-header">{{landscapeName}}</h1>
        </div>
        <div class="col s12 m4 sub">
          <area-progress/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import AreaProgress from "@/components/AreaProgress";
    import store from "../store";

    export default {
        name: 'LandscapeJumbotron',
        components: {AreaProgress},
        computed: {
            landscapeName () {
                return store.state.landscapeName
            }
        }
    }
</script>
<style scoped>
  .sub {
    margin-bottom: 0.6rem;
  }

  @media only screen and (min-width:601px) {
    .flex {
      display: flex;
      align-items: flex-end;
    }

    .sub {
      flex: 1;
      -webkit-box-flex: 1;
      min-height:100%;
      margin: 2.8rem 0 1.68rem 0;
    }
  }
</style>