<template>
  <div class="container">
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

    <div id="nutrition-tab" class="col s12">
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

    <div id="pesticides-tab" class="col s12">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Pesticide Impacts</span>
          <div class="chart-panel">
            <canvas id="pesticides-chart" height="100px" width="200px"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'ContainerVisualisations'
    }
</script>