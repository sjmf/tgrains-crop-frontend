<template>
  <div id="comments" class="container">
    <div class="col s11">
      <span class="comment-header grey-text text-darken-2">Comments</span>
      <div class="divider grey"></div>

    </div>
    <div class="col s1">
      <a href="#modal-add-comment"
         class="modal-trigger btn-floating btn-large tooltipped right waves-effect waves-light green darken-2"
         data-position="left" data-tooltip="Add Comment">
        <i class="material-icons">add</i>
      </a>
    </div>

    <div class="col s12 m6 offset-m4">
      <ul class="pagination">
        <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
        <li class="active"><a href="#!">1</a></li>
        <li class="waves-effect"><a href="#!">2</a></li>
        <li class="waves-effect"><a href="#!">3</a></li>
        <li class="waves-effect"><a href="#!">4</a></li>
        <li class="waves-effect"><a href="#!">5</a></li>
        <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
      </ul>
    </div>

    <div class="col s12 m10 offset-m1 l8 offset-l2">
      <div class="comment-card card-panel grey lighten-5 z-depth-1">
        <div class="row">
          <div class="col s4 m2">
            <img src="images/samantha_128.jpg" alt="avatar" class="circle responsive-img valign">
          </div>

          <div class="col s8 m10">
            <div class="row">
              <div class="col s12 m6">
                  <span class="username grey-text">
                    <a href="https://twitter.com/SamMFinnigan">Samantha Finnigan</a>
                  </span>
              </div>
              <div class="col s12 m6 right-align">
                  <span class="timestamp grey-text">
                    Tues 28th April 2020 16:11
                  </span>
              </div>

            </div>

            <div class="row">
              <div class="col s12">
                  <span class="black-text">
                    This is a comment. It is a sample comment demonstrating the social functionality of the TGRAINS
                    scaled-up model prototype. Comment input is taken from the user, who may wish to link their social
                    media accounts using the inbuilt functionality. Comments can also be tagged with features displayed
                    in the model interface, and a set of pre-defined tags from the 2019 Workshop themes.
                  </span>
              </div>
            </div>

            <div class="row">
              <div class="col s2">
                <span class="grey-text">Tags:</span>
              </div>
              <div class="col s10">
                <span class="new badge blue lighten-2" data-badge-caption="small business"></span>
                <span class="new badge brown lighten-2" data-badge-caption="oats"></span>
                <span class="new badge green lighten-2" data-badge-caption="greenhouse gas"></span>
                <span class="new badge purple lighten-2" data-badge-caption="pesticides"></span>
                <span class="new badge red lighten-2" data-badge-caption="cancer"></span>
              </div>
            </div>

          </div>
        </div>

        <div class="row">
          <div class="col s10 offset-s2 divider"></div>
        </div>

        <div class="row compare-buttons">

          <div class="col s10 m2 offset-m4 offset-l6 l2">
            <span class="grey-text">Compare</span>
          </div>
          <div class="col s2 m2 l1">
            <a class="btn-floating btn waves-effect waves-light amber darken-2">
              <i class="material-icons">insert_chart</i>
            </a>
          </div>

          <div class="col s10 m2 l2">
            <span class="grey-text">Load</span>
          </div>
          <div class="col s2 m2 l1">
            <a class="btn-floating btn waves-effect waves-light blue darken-2">
              <i class="material-icons">play_arrow</i>
            </a>
          </div>

        </div>
      </div>

      <!-- Modal Trigger -->

      <!-- Modal Structure -->
      <ModalComments/>

    </div>
    <!-- end comments -->

  </div>
</template>
<script>
    import ModalComments from "@/components/ModalComments"

    export default {
        name: 'ContainerComments',
        components: {ModalComments}
    }
</script>