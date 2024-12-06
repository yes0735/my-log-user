<template>
  <!-- Navigation -->
  <AppNavigation />

  <!-- Header - set the background image for the header in the line below-->
  <header class="py-5 bg-image-full" style="background-image: url('https://source.unsplash.com/wfh8dDlNFOk/1600x900')">
    <div class="container text-center my-5">
      <img class="img-fluid rounded-circle mb-4" src="https://dummyimage.com/150x150/6c757d/dee2e6.jpg" alt="..." />
      <h1 class="text-white fs-3 fw-bolder">Full Width Pics</h1>
      <p class="text-white-50 mb-0">Landing Page Template</p>
    </div>
  </header>

  <!-- Content section-->
  <section class="py-5">
    <div class="container px-4 px-lg-5 mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <h2>Full Width Backgrounds</h2>
          <p class="lead">A single, lightweight helper class allows you to add engaging, full width background images to sections of your page.</p>
          <p class="mb-0">The universe is almost 14 billion years old, and, wow! Life had no problem starting here on Earth! I think it would be inexcusably egocentric of us to suggest that we're alone in the universe.</p>
        </div>
      </div>
    </div>
  </section>

  <AppFooter />

</template>

<script>
export default {
  name: 'AboutView',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style> -->
