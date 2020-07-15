<template>
  <div>
    <span class="subheader">Available cropping area</span>
    <div class="progress">
      <div class="determinate"
           :class="{red: !valid}"
           :style="{width: percent + '%'}">
      </div>
    </div>
    <span class="label" :class="{invalid: !valid}">
        {{formatNumber(currentCropArea)}}/{{formatNumber(maxCropArea)}} hectares
    </span>
    <span v-if="!valid" class="label invalid">
      – Area exceeded!
    </span>
  </div>
</template>
<script>
    export default {
        name: 'area-progress',
        methods: {
            formatNumber (value) {
                return parseInt(value)
            }
        },
        computed: {
            /***
             * Calculate percentage completion of progress bar
             * @returns {Number}
             */
            percent() {
                return (this.currentCropArea / this.maxCropArea) * 100
            },

            /***
             * Check validity of total area (used to change progress bar colour to red)
             * @returns {Boolean}
             */
            valid () {
                return this.currentCropArea <= this.maxCropArea
            },

            /***
             * Return the MaxCropArea, or zero if this is undefined (i.e. BAU not loaded)
             * @returns {Number}
             */
            maxCropArea() {
                return this.$store.state.bau[this.$store.state.landscape_id].maxCropArea || 1  // One if undefined
            },

            /***
             * Return the current crop area from the state.totalArea value in Vuex
             * @returns {Number}
             */
            currentCropArea() {
                return this.$store.state.totalArea
            }
        }
    }
</script>
<style scoped>
  .label {
    font-size: 0.8rem;
    color: #9e9e9e;
  }

  .label.invalid {
    color: #F44336;
  }

  .progress {
    margin: 0.5rem 0;
  }
</style>