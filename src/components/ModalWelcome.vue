<template>
  <div id="modal-welcome" class="modal open">
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
      <p>For more information on how your data will be used and stored, please view our <a href="#">
        ethics statement</a>. By using this website further, you indicate your agreement to our use and
        processing of this data within the laws of the UK and European Union. As part of this, we will
        need to store data called a 'cookie' in your web browser. If you don't consent to this, you can
        leave using the 'Go Back' button below.</p>
    </div>
    <div class="modal-footer">
      <a href="javascript:history.back()" class="waves-effect waves-red btn-flat">Go Back</a>
      <a href="#!" class="modal-close green darken-2 white-text waves-effect waves-green btn-flat">Agree and
        Continue</a>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'ModalWelcome'
    }
</script>