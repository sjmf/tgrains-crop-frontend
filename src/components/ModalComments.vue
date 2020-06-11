<template>
  <div id="modal-add-comment" class="modal">
    <div class="modal-content container">
      <div class="socialmedia-login">
        <div class="row">
          <div class="col s12">
            <h4>Add Comment</h4>
            <p>Connect your Social Media account to post a comment:</p>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m8 offset-m2">
            <a class="btn waves-effect waves-light blue">
              <i class="material-icons">verified_user</i> Sign in with Twitter
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m8 offset-m2">
            <a class="btn waves-effect waves-light blue darken-3">
              <i class="material-icons">verified_user</i> Sign in with Facebook
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m8 offset-m2">
            <a class="btn waves-effect waves-light amber darken-2">
              <i class="material-icons">verified_user</i> Sign in with Google
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col s12 m8 offset-m2">
            <a href="#" onclick="toggleCommentForm();" class="btn waves-effect waves-light white grey-text">
              Post without logging in
            </a>
          </div>
        </div>
      </div>

      <div class="row comment-form hide">
        <div class="col s12">
          <p>Please enter your comment below:</p>
        </div>

        <form class="col s12">

          <div class="row">
            <div class="input-field col s6">
              <i class="material-icons prefix">account_circle</i>
              <input id="name" type="text" class="validate">
              <label for="name">Name</label>
            </div>
            <div class="input-field col s6">
              <i class="material-icons prefix">email</i>
              <input id="email" type="email" class="validate">
              <label for="email">Email</label>
            </div>
          </div>

          <div class="row">
            <div class="input-field col s12">
              <textarea id="comment-body" class="materialize-textarea"></textarea>
              <label for="comment-body">Comment</label>
            </div>
          </div>

          <div class="row">
            <div class="col s12 tags">
              <p>Next, please add tags using the pre-defined tag categories below to help other users find
                your comment:
              </p>
            </div>

            <div class="col s12 m10 offset-m1">

              <ul class="collapsible">
                <li class="active">
                  <div class="collapsible-header">
                    <i class="material-icons">supervisor_account</i>Themes
                  </div>

                  <div class="collapsible-body">

                    <Lozenge/>

                  </div>
                </li>

                <li>
                  <div class="collapsible-header">
                    <i class="material-icons">terrain</i>Crops and Livestock
                  </div>
                  <div class="collapsible-body">

                    <Lozenge/>

                  </div>
                </li>

                <li>
                  <div class="collapsible-header">
                    <i class="material-icons">pie_chart</i>Outputs
                  </div>
                  <div class="collapsible-body">

                    <Lozenge/>

                  </div>
                </li>
              </ul>

            </div>
          </div>

        </form>

        <div class="col s12">
          <p class="grey-text">
            Comments are moderated and may be removed if they are found to lack civility,
            attack other platform users, or direct hate at a group of people.
          </p>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancel</a>
      <a href="#!" class="modal-close waves-effect green darken-2 white-text waves-green btn-flat"
         onclick="toggleCommentForm();">Post</a>
    </div>
  </div>
</template>
<script>
    import Lozenge from "@/components/Lozenge"

    export default {
        name: 'ModalComments',
        components: {Lozenge}
    }
</script>