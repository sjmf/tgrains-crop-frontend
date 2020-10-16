<template>
  <label v-if="value!==null">
    <input
        type="checkbox" class="tag"
        v-model="innerValue"
        @change="$emit('change', $event)"/>
    <span v-bind:class="this.colour">{{ name }}</span>
  </label>
  <span v-else
        class="new badge tag"
        v-bind:data-badge-caption="name"
        v-bind:class="this.colour">
  </span>
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

<style scoped>
/* A custom styled checkbox which imitates materialize's badge */

/* Tag styling */
[type="checkbox"].tag + span:not(.lever) {
  font-weight: 300;
  font-size: 0.8rem;
  color: #fff;

  min-width: 3rem;
  padding: 0 6px 0 22px;
  margin: 2px;
  text-align: center;
  line-height: 22px;
  height: 22px;

  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #26a69a;
  border-radius: 2px;
}

/* On mouse-over, dim brightness */
[type="checkbox"].tag + span:hover {
  filter: brightness(90%);
}

[type="checkbox"].tag + span:not(.lever):before,
[type="checkbox"].tag:not(.filled-in) + span:not(.lever):after {
  content: '';
  position: absolute;

  top: 7px;
  left: 8px;
  width: 8px;
  height: 8px;

  border: 1px solid #fff;
  border-radius: 10px;

  z-index: 0;
  margin-top: 0;
  -webkit-transition: .1s;
  transition: .1s;
}

[type="checkbox"].tag:checked + span:not(.lever):before {

  /* These need to stay here to override the style in materialize.css */
  top: 7px;
  left: 8px;
  width: 8px;
  height: 8px;

  border: 1px solid #888;
  border-radius: 10px;

  background-color: #fff;
  /*opacity: 90% !important;*/

  -webkit-transform: none;
  transform: none;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform-origin: unset;
  transform-origin: unset;
}

span.badge {
  display: inline-block;
  float: none;
  margin: 2px;
}

</style>