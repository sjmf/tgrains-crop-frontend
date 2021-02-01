<template>
  <li class="variable-row"
      v-bind:class='{tooltipped: description !== ""}'
      data-position="right"
      v-bind:data-tooltip="description">

    <label v-bind:for="name"
           class="variable"
           :class="{fullwidth:hideInput}">

      <span>{{label}}</span>
      <vue-slider
        v-model="innerValue"
        :max="innerValue + remainingArea"
        :min="0"
        :interval="1"
        :tooltip="'none'"
        :processStyle="processStyle"
        :disabled="readonly"
        @change="$emit('change', {'name': name, 'value': $event})">
      </vue-slider>
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
    import VueSlider from 'vue-slider-component'
    import 'vue-slider-component/theme/default.css'

    export default {
        name: 'VariableRow',
        components: { VueSlider },
        props: {
            name: String,
            label: String,
            value: [String, Number], // Blank inputs return String. Validation should catch this
            bauValue: [String, Number],
            description: String,
            errorMessage: [String, Boolean],
            remainingArea: Number,
            readonly: Boolean,
            hideInput: Boolean,
            colourOverride: String,
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
            },
            processStyle() {
              if(this.colourOverride !== undefined)
                return { backgroundColor: this.colourOverride}
              if(this.innerValue === this.bauValue)
                  return { backgroundColor: '#43A047'}
              return { backgroundColor: '#673ab7'}
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
  .vue-slider {
    padding:0 0 10px 0 !important;
    margin: 2px 15px 10px 5px;
  }

  .vue-slider-dot-handle-focus {
    border-color: #81C784;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
</style>