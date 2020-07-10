<template>
  <fragment v-if="loading">
    <div class="card-aligner" :class="{offset: offset}">
      <div class="card">
        <div class="card-content">
          <span class="card-title">Loading...</span>
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
      </div>
    </div>
    <div class="loading"></div>
  </fragment>
</template>
<script>
    export default {
        name: 'loading-overlay',
        props: {
            loading: Boolean,
            offset: Boolean
        }
    }
</script>

<style scoped>
  .loading {
    background-color: black;
    opacity: 0.5;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;

    z-index: 1;
  }
  .card {
    position: fixed;
    display:flex;
    flex: 1;
    -webkit-box-flex: 1;
  }
  .card-aligner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 2;
    position:fixed;
  }
  .card-title {
    padding-bottom: 10px;
  }
  .preloader-wrapper {
    display:block;
    margin: 0 auto;
  }

  @media only screen and (max-width : 992px) {
    .loading {
      padding-left:0;
    }
  }
  @media only screen and (min-width : 993px) {
    .offset {
      margin-left:-150px;
    }
  }
</style>