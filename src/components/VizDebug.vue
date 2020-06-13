<template>
  <div id="debug-tab" class="col s12">
    <div class="card panel">
      <div class="card-content">
        <span class="card-title">Debug Info</span>
        <div class="debug-info-panel">
          {{debug}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'viz-debug'
    }
</script>

<style scoped>
  .debug-info-panel {
    font-family: 'Ubuntu', 'Consolas', 'Courier New', monospace;
  }
</style>