<template>
  <div class="col s12 no-padding white">
    <div class="container">
      <div class="divider"></div>
      <ul class="tabs">
        <li class="tab col s6 l3"><router-link to="production">Production</router-link></li>
        <li class="tab col s6 l3"><router-link to="environment">Environment</router-link></li>
        <li class="tab col s6 l3"><router-link to="nutrition">Nutrition</router-link></li>
        <li class="tab col s6 l3"><router-link to="history">History</router-link></li>
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
.tabs .tab a.router-link-active {
  background-color: transparent;
  color: #1B5E20;
  border-bottom: 2px solid #2c9934;
  transition: border-bottom-color 0.28s ease, border-bottom-width 0.28s ease,
              color 0.28s ease, background-color 0.28s ease;
}

.tabs .tab a {
  border-bottom: 0 solid #fff;
}
</style>