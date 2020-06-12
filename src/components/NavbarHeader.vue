<template>
  <header>
    <!-- TOP NAVBAR -->
    <nav>
      <div class="row nav-wrapper">
        <div class="col s12">
          <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
          <a href="#" class="brand-logo truncate" v-html="pageTitle"><i class="material-icons">terrain</i>{{pageTitle}}</a>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><a v-bind:href="websiteUrl">{{websiteTitle}}</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
    export default {
        name: 'navbar-header',
        data: function() {
            return {
            }
        },
        props: {
            pageTitle: String,
            websiteTitle: String,
            websiteUrl: String
        }
    }
</script>