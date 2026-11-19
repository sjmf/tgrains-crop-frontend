<template>
  <div>
    <span class="subheader">Available area</span>
    <div>
      <div class="progress first blue-grey lighten-4"
           :class="{last: percent(maxUplandArea, totalMax) < 1}"
           :style="{width: percent(maxLowlandArea, totalMax) + '%'}">
        <div class="determinate blue-grey"
             :class="{red: !valid}"
             :style="{width: percent(currentLowlandArea, maxLowlandArea) + '%'}">
        </div>
      </div>

      <div class="progress last lime lighten-2"
           :style="{width: percent(maxUplandArea, totalMax) + '%'}">
        <div class="determinate right lime darken-2"
             :style="{width: percent(currentUplandArea, maxUplandArea) + '%'}">
        </div>
      </div>
    </div>
    <div class="label" :class="{invalid: !valid}">
      <span>{{ formatNumber(currentLowlandArea) }}/{{ formatNumber(maxLowlandArea) }}kha</span>
        (thousand hectares) in lowland
    </div>
    <div v-if="maxUplandArea > 1"
         class="label">
      <span>
        {{ formatNumber(currentUplandArea) }}/{{ formatNumber(maxUplandArea) }}kha</span>
        in upland areas
    </div>
    <div class="label"
         :class="{invalid: !valid}">
      <span v-if="!valid" class="label invalid">
        Area exceeded!
      </span>
      <span v-if="$store.state.readonly" class="red-text">
        (read-only <i class="tiny material-icons material-icons">lock</i>)
      </span>
    </div>

    <div v-if="false">
      <pre class="label">
        currentLowlandArea = {{currentLowlandArea}}
        currentUplandArea = {{currentUplandArea}}
        maxLowlandArea = {{maxLowlandArea}}
        maxUplandArea = {{maxUplandArea}}
        totalArea = {{totalArea}}
        totalMax = {{totalMax}}
      </pre>
    </div>

  </div>
</template>
<script>
  export default {
    name: 'area-progress',
    methods: {
      formatNumber(value) {
        return Math.floor(parseInt(value) / 1000)
      },
      percent(fraction, of_total) {
        return (fraction / of_total) * 100
      },
    },
    computed: {
      /***
       * Check validity of total area (used to change progress bar colour to red)
       * @returns {Boolean}
       */
      valid () {
        return this.currentLowlandArea <= this.maxLowlandArea
      },

      /***
       * Return the current lowland area from Vuex
       * @returns {Number}
       */
      currentLowlandArea() {
        return this.$store.state.area.lowland
      },

      currentUplandArea() {
        return this.$store.state.area.upland
      },

      maxLowlandArea() {
        return this.$store.state.bau[this.$store.state.landscape_id].maxCropArea || 1  // One if undefined
      },

      maxUplandArea() {
        return this.$store.state.bau[this.$store.state.landscape_id].maxUplandArea || 1
      },

      totalArea() {
        return this.currentLowlandArea + this.currentUplandArea
      },

      totalMax() {
        return this.maxLowlandArea + this.maxUplandArea
      },
    }
  }
</script>
<style scoped>
  .label {
    font-size: 0.8rem;
    color: #9e9e9e;
  }
  .progress {
    width: 50%; /* default only, is calculated on element with style="width:x%" */
    display: inline-block;
    border-radius: 0;
    height: 1.5rem;
  }
  .progress.first {
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .progress.last {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  .label.invalid {
    color: #F44336;
  }
  .progress {
    margin: 0.5rem 0;
  }
  i.tiny.material-icons {
    vertical-align: middle;
  }
</style>