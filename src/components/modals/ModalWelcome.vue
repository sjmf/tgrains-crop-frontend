<template>
  <div :id="id" class="modal">
    <div class="modal-content">
      <h4>Welcome to the TGRAINS Crop Model!</h4>
      <p>Thanks for visiting! On this web-page, you can interact with a mathematical model of crop
        distribution in your local area. Currently, the regions included in the model are East Anglia
        and South Wales.</p>
      <h5>What are we researching?</h5>
      <p>We want to investigate how food is produced in these regions, and examine the road towards a
        more sustainable, healthy, and local food network. You may be a consumer, a producer of food,
        or another link in the food system chain. We hope you can help with our investigation!</p>
      <p>This web interface was developed as part of the <a href="https://tgrains.com">TGRAINS project</a>
        by researchers at Northumbria University. The mathematical model was developed by researchers
        at Rothamstead Research.</p>
      <p>For more information on how your data will be used and stored, please view our <a href="/ethics">
        ethics statement</a>. By using this website further, you indicate your agreement to our use and
        processing of this data within the laws of the UK and European Union. As part of this, we will
        need to store data called a 'cookie' in your web browser. If you don't consent to this, you can
        leave using the 'Back' button in your browser, or exit button below.</p>
    </div>
    <div class="modal-footer">
      <a href="https://tgrains.com" @click="declineTerms" class="waves-effect waves-red btn-flat">
        Exit to tgrains.com
      </a>
      <a @click="acceptTerms" class="modal-close green darken-2 white-text waves-effect waves-green btn-flat">
        Agree and Continue
      </a>
    </div>
  </div>
</template>
<script>
  import ModalMixin from "@/components/modals/modalMixin";

  export default {
    name: 'ModalWelcome',
    mixins: [ModalMixin],
    methods: {
      acceptTerms() {
        this.$store.commit('acceptTerms')
      },
      declineTerms() {
        localStorage.clear()
      },
    },
    mounted() {
      // console.info("Welcome modal mounted, acceptedTerms is:", this.$store.state.acceptedTerms)

      // Run on nextTick for edge-case when Vuex store invalidated due to new version hash
      this.$nextTick(()=> {
        // Open Welcome modal if terms not accepted
        if (this.$store.state.acceptedTerms === false && this.$router.history.current.path !== '/ethics')
          this.open()
      })
    }
  }
</script>