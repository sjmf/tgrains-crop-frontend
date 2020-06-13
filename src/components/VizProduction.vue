<template>
  <div id="production-tab" class="col s12">
    <div class="card panel">
      <div class="card-content">
        <span class="card-title">Change from "Business-as-usual"</span>
        <div class="chart-panel">
          <canvas id="percentage-chart" height="100px" width="200px"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'viz-production'
    }
</script>