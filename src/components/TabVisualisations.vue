<template>
  <div class="container">
    <viz-debug/>

    <viz-production/>

    <viz-environment/>

    <viz-health/>
  </div>
</template>
<script>
    import VizProduction from "@/components/VizProduction";
    import VizEnvironment from "@/components/VizEnvironment";
    import VizHealth from "@/components/VizHealth";
    import VizDebug from "@/components/VizDebug";

    export default {
        name: 'TabVisualisations',
        components: {VizDebug, VizHealth, VizEnvironment, VizProduction}
    }
</script>