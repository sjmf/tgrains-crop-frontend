<template>
  <label>
    <input
        type="checkbox" class="lozenge"
        v-model="innerValue"
        @change="$emit('change', $event)"/>
    <span v-bind:class="this.colour">{{ name }}</span>
  </label>
</template>

<script>
    export default {
      name: 'Tag',
      props: {
          name: String,
          colour: String,
          value: Boolean
      },
      computed: {
        innerValue: {
          get() {
            const {value} = this;
            return value
          },
          set (_val) {
            this.$emit('input', _val, this.value);
          }
        }
      }
    }
</script>

<style>
  @import "../css/lozenge.css";
</style>