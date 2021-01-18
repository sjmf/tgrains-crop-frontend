<template>
  <div>
    <span class="subheader">Available area</span>
    <div>
      <div class="progress first blue-grey lighten-4"
           :style="{width: percent(this.maxLowlandArea, this.totalMax) + '%'}">
        <div class="determinate blue-grey"
             :class="{red: !valid}"
             :style="{width: percent(this.currentLowlandArea, this.maxLowlandArea) + '%'}">
        </div>
      </div>

      <div class="progress last lime lighten-2"
           :style="{width: percent(this.maxUplandArea, this.totalMax) + '%'}">
        <div class="determinate right lime darken-2"
             :style="{width: percent(this.currentUplandArea, this.maxUplandArea) + '%'}">
        </div>
      </div>
    </div>
    <div class="label" :class="{invalid: !valid}">
      <span>{{ currentLowlandArea | formatNumber }}/{{ maxLowlandArea | formatNumber }}kha</span>
        (thousand hectares) in lowland
      <span v-if="!valid" class="label invalid">
          – Area exceeded!
      </span>
    </div>
    <div class="label" :class="{invalid: !valid}">
      <span>{{ currentUplandArea | formatNumber }}/{{ maxUplandArea | formatNumber }}kha</span>
        in upland areas
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
    filters: {
      formatNumber(value) {
        return Math.floor(parseInt(value) / 1000)
      },
    },
    methods: {
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
  }
  .progress.first {
    border-radius: 2px 0 0 2px;
  }
  .progress.last {
    border-radius: 0 2px 2px 0 ;
  }
  .label.invalid {
    color: #F44336;
  }

  .progress {
    margin: 0.5rem 0;
  }
</style>