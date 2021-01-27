<template>
  <div class="gdmap">
    <gdmap></gdmap>
  </div>
</template>

<script>
import gdmap from "../../components/gdmap/index1";
export default {
  name: "t-gdmap",
  components: { gdmap },
  data() {
    return {
      initContent: ""
    };
  },
  methods: {}
};
</script>

<style>
.gdmap {
  height: 100%;
  width: 100%;
}
</style>
