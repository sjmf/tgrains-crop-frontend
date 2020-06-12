<template>
  <aside id="slide-out" class="sidenav sidenav-fixed">
    <!-- VALUE SELECT SIDEBAR -->
    <ul>

      <land-area-menu/>

      <li>
        <div class="divider"></div>
      </li>

      <!-- CROP AREAS -->
      <li id="crop-area-menu">
        <span class="subheader">Crop Areas</span>
      </li>

      <variable-row/>

      <li>
        <div class="divider"></div>
      </li>

      <!-- LIVESTOCK NUMBERS -->
      <li id="livestock-areas-menu">
        <span class="subheader">Livestock Areas</span>
      </li>

      <variable-row/>

      <li>
        <a class="waves-effect waves-light btn">Reset values</a>
      </li>

      <!-- Dummy list element to address
       https://github.com/Dogfalo/materialize/issues/2112 -->
      <li class="dummy"></li>

    </ul>
  </aside>
</template>
<script>
    import LandAreaMenu from "@/components/LandAreaMenu"
    import VariableRow from "@/components/VariableRow"

    export default {
        name: 'SidebarMenu',
        components: {LandAreaMenu, VariableRow}
    }
</script>