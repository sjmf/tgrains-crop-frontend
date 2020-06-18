<template>
  <li id="land-area-menu">

    <!-- LAND AREA SELECT -->
    <span class="subheader">Land Area</span>

    <div class="select-wrapper">
      <select id="area" @change="onChange($event)"> <!-- class="browser-default"-->
        <!--<option value="" disabled selected>Choose your area</option>-->
        <option value="101">East Anglia</option>
        <option value="102">South Wales</option>
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
            }
        }
    }
</script>

<style scoped>
  .select-wrapper + label {
    top:-10px;
  }
</style>