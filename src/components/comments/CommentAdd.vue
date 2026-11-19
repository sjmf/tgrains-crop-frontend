<template>
  <div id="add-comment" class="card col s12">
    <div class="container card-content">
      <span class="card-title">Add a Comment</span>
      <!--
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
            <a href="#" :click="toggleCommentForm();" class="btn waves-effect waves-light white grey-text">
              Post without logging in
            </a>
          </div>
        </div>
      </div>
      -->

      <div class="row comment-form">
        <form class="col s12">

          <!-- Reply-to comment -->
          <div v-if="reply_id" class="row">
            <div class="col s12">
              <p>Replying to comment: <a @click="$emit('cancelReply')">(cancel)</a></p>
              <comment-card
                  v-bind:id="reply_comment.id"
                  v-bind:hash="reply_comment.hash"
                  v-bind:reply_id="reply_comment.reply_id"
                  v-bind:author="reply_comment.author"
                  v-bind:text="reply_comment.text"
                  v-bind:tags="reply_comment.tags"
                  v-bind:timestamp="reply_comment.timestamp"
                  v-bind:reply_view="true"/>
            </div>
          </div>

          <div class="row">
            <!-- VALIDATION -->
            <div v-if="formValid===false" class="col s12 errors">
              <p><strong>Please correct the following error(s):</strong></p>
              <ul>
                <li v-for="error in [this.name, this.email, this.text]" v-bind:key="error.field">{{ error.error }}</li>
              </ul>
            </div>

            <div class="input-field col s6">
              <i class="material-icons prefix">account_circle</i>
              <input v-model="name.value"
                     v-bind:class="{'valid': name.valid === true, 'invalid': name.valid === false}"
                     id="name"
                     type="text"
                     @change="validateName"/>

              <label for="name">Name</label>
            </div>

            <div class="input-field col s6">
              <i class="material-icons prefix">email</i>
              <input v-model="email.value"
                     v-bind:class="{'valid': email.valid === true, 'invalid': email.valid === false}"
                     id="email"
                     type="email"
                     @change="validateEmail"/>

              <label for="email">Email (not displayed to others)</label>
            </div>
          </div>

          <div class="row">
            <div class="input-field col s12">
              <i class="material-icons prefix">insert_comment</i>
              <textarea v-model="text.value"
                        v-bind:class="{'valid': text.valid, 'invalid': text.valid === false}"
                        id="comment-body"
                        class="materialize-textarea"
                        @change="validateText"/>

              <label for="comment-body">Comment</label>
              <span class="text-length"
                    v-bind:class="[this.text.valid===false ? 'red-text' : 'grey-text']">
                {{this.text.value.length}}/{{comment_string_max_length}}
              </span>
            </div>
          </div>

          <!-- TAGS COLLAPSIBLE -->

          <div class="row">
            <div class="col s12 tags">
              <p>Next, please add tags using the pre-defined tag categories below to help other users find
                your comment:
              </p>
            </div>

            <div class="col s12 m10 offset-m1">
              <TagSelect/>
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
    <div class="card-action">
      <button class="waves-effect waves-green btn-flat"
              @click="$emit('closeForm')">
        Cancel
      </button>
      <button class="waves-effect green darken-2 white-text waves-green btn-flat"
              @click="postComment"
              v-bind:disabled="formValid===undefined || formValid === false || loading">
        Post
      </button>
    </div>
  </div>
</template>
<script>
    import TagSelect from "@/components/comments/TagSelect.vue";
    import CommentCard from "@/components/comments/CommentCard.vue";

    export default {
        name: 'CommentAdd',
        emits: ['cancelReply', 'closeForm'],
        components: {
          CommentCard,
          TagSelect
        },
        props: {
          reply_id: Number
        },
        data() {
          return {
            comment_string_max_length: 10000,
            loading: false,
            name:  {value: '', valid: undefined, error: ''},
            email: {value: '', valid: undefined, error: ''},
            text:  {value: '', valid: undefined, error: ''},
          }
        },
        computed: {
          errors() {
            return {
              name_empty:  {field: this.name,  string: 'Name required'},
              email_empty: {field: this.email, string: 'Please enter an email'},
              email_bad:   {field: this.email, string: 'Email not valid'},
              text_empty:  {field: this.text,  string: 'Please enter a comment'},
              text_long:   {field: this.text,  string: 'Comment too long'},
            }
          },
          formValid() {
            return this.name.valid && this.email.valid
          },
          reply_comment() {
            // Look up comment from the store by ID
            // If comments were larger I would use a map, but honestly, this is the simpler solution
            if (this.reply_id)
              for (let c of this.$store.state.comments.comments)
                if (c.id === this.reply_id)
                  return c
            return null
          }
        },
        methods: {
          async postComment() {
            // Validate first
            if( this.validateForm() ) {
              this.loading = true
              let payload = {
                'text': this.text.value,
                'user_id': this.$store.state.user.id,
                'author': this.name.value,
                'email': this.email.value,
                'reply_id': this.reply_id
              }
              this.$store.dispatch('postComment', payload).then((err)=> {
                // Check server status return
                if(err === undefined)
                  this.resetForm()
              })
              this.loading = false
            }
          },
          resetForm() {
            this.text = {value: '', valid: undefined, error: ''}
            this.$emit('closeForm')
          },
          setError(key) {
            key.field.error = key.string
            key.field.valid = false
            return false
          },
          clearError(key) {
            key.field.error = ''
            key.field.valid = true
            return true
          },
          validateForm(e) {
            let valid = true
            valid &= this.validateName()
            valid &= this.validateEmail()
            valid &= this.validateText()
            if (e) e.preventDefault()
            return valid
          },
          validateName() {
            if (this.name.value.trim().length === 0) {
              return this.setError(this.errors.name_empty)
            }
            return this.clearError(this.errors.name_empty)
          },
          validateEmail() {
            if (!this.validEmail(this.email.value)) {
              if (this.email.value.trim().length === 0) {
                return this.setError(this.errors.email_empty)
              } else {
                return this.setError(this.errors.email_bad)
              }
            }
            return this.clearError(this.errors.email_empty)
          },
          validateText(){
            if (this.text.value.trim().length === 0) {
              return this.setError(this.errors.text_empty)
            } else if (this.text.value.length > 10000) {
              return this.setError(this.errors.text_long)
            }
            return this.clearError(this.errors.text_empty)
          },
          validEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
          }
        },
        mounted() {
          this.name.value = this.$store.state.user.name
          if(this.name.value!=='') this.validateName()
          this.email.value = this.$store.state.user.email
          if(this.email.value!=='') this.validateEmail()
        }
    }
</script>
<style scoped>
.text-length {
  float: right;
  font-size: .9rem;
}
div.errors ul {
  color: #ff1744;
}
</style>