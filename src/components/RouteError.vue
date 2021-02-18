<template>
  <main class="valign-wrapper">
    <div class="container row">
      <!-- ERROR/MESSAGE BANNERS -->
      <div class="col s12">
        <div class="card card-panel">
          <span class="card-title">
            <i class="material-icons">search</i>
            Page Not Found
          </span>
          <p>The page you tried to navigate to didn't exist!</p>
          <p>This is likely an error in the application. To recover, please try <a href="/">clicking here</a></p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "RouteError"
}
</script>