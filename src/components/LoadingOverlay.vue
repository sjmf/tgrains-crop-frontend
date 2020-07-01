<template>
  <div v-if="loading" class="loading">
    <div class="preloader-wrapper big active">
      <div class="spinner-layer spinner-green-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'loading-overlay',
        props: {
            loading: Boolean
        }
    }
</script>

<style scoped>
  .loading {
    background-color: black;
    opacity: 0.5;
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1;
  }
  .loading .preloader-wrapper {
    opacity: 1.0;
  }

  @media only screen and (max-width : 992px) {
    .loading {
      padding-left:0;
    }
  }
</style>