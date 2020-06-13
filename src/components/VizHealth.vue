<template>
  <div id="health-tab" class="col s12">
    <div class="card panel">
      <div class="card-content">
        <span class="card-title">Health Risks</span>
        <div class="chart-panel">
          <canvas id="health-chart" height="100px" width="200px"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'viz-health'
    }
</script>