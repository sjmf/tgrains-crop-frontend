<template>
  <div class="row white no-margin">
    <div class="col s12 color-text">
      <div class="container">
        <p class="h1-label hide-on-small-only">Selected area:</p>
        <h1 id="area-header">{{landscapeName}}</h1>
        <!--        <p class="hide-on-large-only">Swipe right or click the menu button to show options!</p> -->
        <div class="divider"></div>
      </div>
    </div>
  </div>
</template>
<script>
    import store from "../store";

    export default {
        name: 'LandscapeJumbotron',
        computed: {
            landscapeName () {
                return store.state.landscapeName
            }
        }
    }
</script>
