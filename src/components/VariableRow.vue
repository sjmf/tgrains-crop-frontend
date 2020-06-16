<template>
  <li class="variable-row">
    <label v-bind:for="name" class="variable">
      {{label}}
    </label>
    <input v-bind:id="name"
           v-model.number="innerValue"
           type="number"
           step=".5"
           v-bind:disabled="disabled">
  </li>
</template>

<script>
    export default {
        name: 'VariableRow',
        props: {
            name: String,
            label: String,
            value: Number,
            disabled: Boolean
        },
        computed: {
            innerValue: {
                get() {
                    const {value} = this;
                    return parseFloat(value)
                },
                set (_val) {
                    //console.debug("Emit input ", _val, this.name)
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
</style>