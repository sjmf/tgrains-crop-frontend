<template>
  <div id="debug-tab" class="col s12">
    <div class="card panel">
      <div class="card-content">
        <span class="card-title">Debug Info</span>
        <div class="debug-info-panel">
          <pre>{{debug}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import store from '../store';

    export default {
        name: 'viz-debug',
        computed: {
          debug() {
              return store.state.data;
          }
        }
    }
</script>

<style scoped>
  .debug-info-panel {
    font-family: 'Ubuntu', 'Consolas', 'Courier New', monospace;
    font-size: .8em;
  }
  .debug-info-panel pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
  }
</style>