<template>
  <li class="no-hover">
    <span class="subheader">Available cropping area</span>
    <div class="progress">
      <div class="determinate"
           :class="{red: !valid}"
           :style="{width: percent + '%'}">
      </div>
    </div>
    <span class="label" :class="{invalid: !valid}">
        {{currentCropArea}}/{{maxCropArea}} hectares
    </span>
    <span v-if="!valid" class="label invalid">
      – Area exceeded!
    </span>
  </li>
</template>
<script>
    export default {
        name: 'area-progress',
        props: {
            maxCropArea: Number,
            currentCropArea: Number
        },
        computed: {
            percent() {
                return (this.currentCropArea / this.maxCropArea) * 100
            },
            valid () {
                const condition = this.currentCropArea <= this.maxCropArea
                this.$emit('area-valid', condition)
                return condition
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
</style>