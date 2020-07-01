<template>
  <li class="variable-row"
      v-bind:class='{tooltipped: description !== ""}'
      data-position="right"
      v-bind:data-tooltip="description">

    <label v-bind:for="name" class="variable">
      {{label}}
    </label>

    <input v-bind:id="name"
           v-model.number="innerValue"
           type="number"
           step="50"
           min="0"
           v-bind:class="{ invalid: errorMessage }"
           @change="$emit('change', $event)">

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
            value: [String, Number], // Blank inputs return String. Validation should catch this
            description: String,
            errorMessage: [String, Boolean]
        },
        computed: {
            innerValue: {
                get() {
                    const {value} = this;
                    return parseFloat(value)
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
    width: 50%;
    color: rgba(0,0,0, 0.87);
    padding:0;
    margin:0;
    line-height:3rem;
  }

  label.variable + input[type="number"]:not(.browser-default) {
    width:50%;
    display: inline-block;
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