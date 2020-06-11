<template>
  <li id="land-area-menu">

    <!-- LAND AREA SELECT -->
    <span class="subheader">Land Areas</span>

    <div class="select-wrapper">
      <select id="area"><!-- class="browser-default" -->
        <!--<option value="" disabled selected>Choose your area</option>-->
        <option value="101">East Anglia</option>
        <option value="102">South Wales</option>
      </select>
      <label for="area">Choose your area:</label>
    </div>
  </li>
</template>
<script>
    export default {
        name: 'LandAreaMenu'
    }
</script>