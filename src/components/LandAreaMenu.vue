<template>
  <li id="land-area-menu">

    <!-- LAND AREA SELECT -->
    <span class="subheader">Land Area</span>

    <div class="select-wrapper" id="landscape-input">
      <select id="area" @change="onChange($event)"> <!-- class="browser-default"-->
        <!--<option value="" disabled selected>Choose your area</option>-->
        <option value="101">{{this.strings[101]}}</option>
        <option value="102">{{this.strings[102]}}</option>
      </select>
      <label for="area">Please select your area from the list:</label>
    </div>
  </li>
</template>

<script>
    import store from "../store";

    export default {
        name: 'LandAreaMenu',
        methods: {
            onChange(event) {
                console.log(event.target.value);
                store.commit("setLandscapeId", parseInt(event.target.value));
                store.commit("setLandscapeName", event.target[event.target.selectedIndex].label);

                // Check if BAU for area is loaded
                this.$emit("checkBAULoaded")
            }
        },
        computed: {
            strings() {
                return store.state.landscapeNames
            }
        },
        mounted() {
            // Set select value to landscape ID on load
            const elem = document.querySelector('#landscape-input')
            const select = elem.querySelector('select')
            elem.querySelector("option[value='102']").selected = true
            select.value = store.state.landscape_id
            elem.value = this.strings[store.state.landscape_id];
        }
    }
</script>

<style scoped>
  .select-wrapper + label {
    top:-10px;
  }
</style>