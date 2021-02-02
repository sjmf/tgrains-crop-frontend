<template>
  <div class="col s12 no-padding white">
    <div class="container">
      <div class="divider"></div>
      <ul class="tabs">
        <li class="tab col s6 l3"><router-link to="/production">Production</router-link></li>
        <li class="tab col s6 l3"><router-link to="/environment">Environment</router-link></li>
        <li class="tab col s6 l3"><router-link to="/nutrition">Nutrition</router-link></li>
        <li class="tab col s6 l3"><router-link to="/history">History</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabBar'
  }
</script>

<style>
.router-link-active {
  background-color: transparent;
  color: #1B5E20;
}
</style>