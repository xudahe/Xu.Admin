<template>
  <div class="markdown">
    <!-- <markdown :curValue="initContent"></markdown> -->
    <notes></notes>
  </div>
</template>

<script>
import notes from "../../components/notes/index1.vue";

export default {
  name: "t-markdown",
  components: { notes },
  data() {
    return {
      initContent: ""
    };
  }
};
</script>

<style scoped>
.markdown {
  height: 100%;
  width: 100%;
}
</style>
