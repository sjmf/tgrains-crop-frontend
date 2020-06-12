<template>
  <li class="variable-row">
    <label v-bind:for="name" class="variable">
      {{label}}
    </label>
    <input v-bind:id="name"
           type="number"
           v-bind:value="value"
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
        }
    }
</script>
