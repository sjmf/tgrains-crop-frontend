<template>
  <li class="variable-row"
      v-bind:class='{tooltipped: description !== ""}'
      data-position="right"
      v-bind:data-tooltip="description">

    <label v-bind:for="name"
           class="variable"
           :class="{fullwidth:hideInput}">

      <span>{{label}}</span>
      <input type="range"
             class="area-slider"
             :value="innerValue"
             :max="innerValue + remainingArea"
             min="0"
             step="1"
             :style="sliderStyle"
             :disabled="readonly"
             @input="innerValue = $event.target.valueAsNumber"
             @change="$emit('change', {'name': name, 'value': $event.target.valueAsNumber})">
    </label>

    <input v-if="!hideInput"
           :id="name"
           :title="description"
           v-model.number="innerValue"
           type="number"
           step="500"
           min="0"
           :disabled="readonly"
           :class="{ invalid: errorMessage }"
           @change="$emit('change', {'name': name, 'value': $event.target.valueAsNumber})">

    <div v-if="errorMessage" class="error label">
        <span>{{ errorMessage }}</span>
    </div>
  </li>
</template>

<script>
    export default {
        name: 'VariableRow',
        props: {
            name: String,
            label: String,
            modelValue: [String, Number], // Blank inputs return String. Validation should catch this
            bauValue: [String, Number],
            description: String,
            errorMessage: [String, Boolean],
            remainingArea: Number,
            readonly: Boolean,
            hideInput: Boolean,
            colourOverride: String,
        },
        emits: ['update:modelValue', 'change'],
        computed: {
            innerValue: {
                get() {
                    const {modelValue} = this;
                    return parseInt(modelValue)
                },
                set (_val) {
                    this.$emit('update:modelValue', _val, this.name);
                }
            },
            processColour() {
              if(this.colourOverride !== undefined)
                return this.colourOverride
              if(this.innerValue === this.bauValue)
                  return '#43A047'
              return '#673ab7'
            },
            // Fill the track up to the thumb in the process colour
            sliderStyle() {
              const max = this.innerValue + this.remainingArea
              const fill = max > 0 ? (this.innerValue / max) * 100 : 0
              return {
                background: `linear-gradient(to right, ${this.processColour} ${fill}%, #ccc ${fill}%)`
              }
            }
        }
    }
</script>

<style scoped>
  /* Sidenav elements */
  li.variable-row {
    line-height: 1rem;
    padding: 0 10px;
  }

  .sidenav li.variable-row:hover {
    background-color:#eee;
  }

  li.variable-row input {
    height: 2.5rem;
  }

  label.variable {
    display:inline-block;
    width: 66.66%;
    color: rgba(0,0,0, 0.87);
    padding:0;
    margin:0;
    height:2rem;
  }

  label.variable.fullwidth {
    width:100%;
  }

  label.variable span {
    width:100%;
    display:inline-block;
    vertical-align: top;
    margin: -5px 0 1px 0;
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
  /* Range slider, styled after the vue-slider-component default theme (overrides Materialize) */
  .variable-row input[type=range].area-slider {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    width: calc(100% - 20px);
    height: 4px;
    padding: 0;
    margin: 9px 15px 15px 5px;
    border: none;
    border-radius: 15px;
    outline: none;
    cursor: pointer;
  }

  .variable-row input[type=range].area-slider:disabled {
    cursor: not-allowed;
    opacity: .5;
  }

  .variable-row input[type=range].area-slider::-webkit-slider-runnable-track {
    height: 4px;
    background: transparent;
    border: none;
  }

  .variable-row input[type=range].area-slider::-moz-range-track {
    height: 4px;
    background: transparent;
    border: none;
  }

  .variable-row input[type=range].area-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    margin-top: -5px;
    border: 1px solid transparent;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
    transform: none;
  }

  .variable-row input[type=range].area-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border: 1px solid transparent;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
  }

  .variable-row input[type=range].area-slider:focus::-webkit-slider-thumb {
    border-color: #81C784;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  .variable-row input[type=range].area-slider:focus::-moz-range-thumb {
    border-color: #81C784;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
</style>