<template>
  <table>
    <thead>
    <tr>
      <th v-for="title in titles" :key="title">{{title}}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row in values" :key="row.label">
      <td>{{row.label}}</td>
      <td>{{row.value | numberFormat}}</td>
      <td>{{row.unit}}</td>
    </tr>
    </tbody>
  </table>
</template>
<script>
    export default {
        name: 'DataTable',
        props: {
            titles: Array,
            values: Array
        },
        filters: {
            numberFormat(value) {
                return new Intl.NumberFormat('en-GB', {
                        maximumFractionDigits: 0,
                    }
                ).format(value)
            }
        },
    }
</script>
<style scoped>
  .card .card-content .chart-panel + p {
    margin-top: 20px;
  }
</style>