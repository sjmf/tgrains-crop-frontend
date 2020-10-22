<template>
  <li class="variable-row"
      v-bind:class='{tooltipped: description !== ""}'
      data-position="right"
      v-bind:data-tooltip="description">

    <label v-bind:for="name" class="variable">
      {{label}}
      <vue-slider
        v-model="innerValue"
        :max="innerValue + remainingArea"
        :min="0"
        :interval="1"
        :tooltip="'none'"
        @change="$emit('change', [name, $event])">
      </vue-slider>
    </label>

    <input v-bind:id="name"
           v-bind:title="description"
           v-model.number="innerValue"
           type="number"
           step="500"
           min="0"
           v-bind:class="{ invalid: errorMessage }"
           @change="$emit('change', [name, $event.target.valueAsNumber])">

    <div v-if="errorMessage" class="error label">
        <span>{{ errorMessage }}</span>
    </div>
  </li>
</template>

<script>
    import VueSlider from 'vue-slider-component'
    import 'vue-slider-component/theme/default.css'

    export default {
        name: 'VariableRow',
        components: { VueSlider },
        props: {
            name: String,
            label: String,
            value: [String, Number], // Blank inputs return String. Validation should catch this
            description: String,
            errorMessage: [String, Boolean],
            remainingArea: Number,
        },
        computed: {
            innerValue: {
                get() {
                    const {value} = this;
                    return parseInt(value)
                },
                set (_val) {
                    this.$emit('input', _val, this.name);
                }
            }
        }
    }
</script>

<style scoped>
  /* Sidenav elements */
  li.variable-row {
    padding: 0 20px;
    white-space: nowrap;
  }

  label.variable {
    display:inline-block;
    width: 66.66%;
    color: rgba(0,0,0, 0.87);
    padding:0;
    margin:0;
    line-height:3rem;
  }

  label.variable + input[type="number"]:not(.browser-default) {
    display: inline-block;
    width:33.33%;
    padding:0;
    margin:0;
  }

  div.error.label {
    color: #F44336;
    text-align:right;
    font-size: .85rem;
    margin: 2px 0;
  }

  .invalid {
    color: #F44336;
  }
</style>

<style>
  .vue-slider {
    padding:0 !important;
    margin: -7.5px 15px 10px 5px;
  }

  .vue-slider-process {
    background-color: #43A047;
  }

  .vue-slider-dot-handle-focus {
    border-color: #81C784;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
</style>