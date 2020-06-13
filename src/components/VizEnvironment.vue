<template>
  <div id="environment-tab" class="col s12">
    <div class="row">
      <div class="col s12 m6">
        <div class="card panel">
          <div class="card-content">
            <span class="card-title">Nutritional Delivery</span>
            <div class="chart-panel">
              <canvas id="nutrition-chart" height="300" width="300"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="col s12 m6">
        <div class="card panel">
          <div class="card-content">
            <span class="card-title">% Change</span>
            <div class="chart-panel">
              <canvas id="nutrition-change-chart" width="100" height="100"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'viz-environment'
    }
</script>