<template>
  <header>
    <!-- TOP NAVBAR -->
    <nav>
      <div class="row nav-wrapper">
        <div class="col s12">
          <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>
          <a href="#" class="brand-logo truncate" v-html="title"><i class="material-icons">terrain</i>{{title}}</a>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><a v-bind:href="website_url">{{website_title}}</a></li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
    export default {
        name: 'NavbarHeader',
        data: function() {
            return {
                'title': 'TGRAINS <span class="hide-on-small-only">Crop Model</span>',
                'website_title': "TGRAINS Website",
                'website_url': 'https://tgrains.com'
            }
        }
    }
</script>