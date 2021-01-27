<template>
  <div class="echartMap">
     <echartMap></echartMap>
  </div>
</template>

<script>
import echartMap from '../../components/ehcart_map/index1'
export default {
  name: "t-echartMap",
  components: { echartMap },
  data() {
    return {
      initContent: ""
    };
  },
  methods: {}
};
</script>

<style>
.echartMap {
  height: 100%;
  width: 100%;
}
</style>
