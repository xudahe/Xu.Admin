<template>
  <div class="arcgisMap" style="height: 100%; width: 100%;">
    <!-- <arcgisMap></arcgisMap> -->
    <splitview ref="splitview" :items="this.$store.state.mapitems"></splitview>
  </div>
</template>

<script>
import splitview from "../../components/arcgis_map/splitview.vue";
import arcgisMap from "../../components/arcgis_map/index1.vue";
export default {
  name: "t-arcgisMap",
  components: { splitview, arcgisMap },
  data() {
    return {
      items: [
        {
          checked: true,
          children: [],
          expand: false,
          haschild: false,
          id: 258,
          layername: "省级生态红线",
          name: "省级生态红线",
          remark: "",
          servicename: "省级生态红线",
          servicetype: "dynamic",
          serviceurl:
            "http://10.10.31.98/arcgis/rest/services/%E5%BA%95%E7%BA%BF%E7%AE%A1%E6%8E%A7%E8%A7%84%E5%88%92/%E7%9C%81%E7%BA%A7%E7%94%9F%E6%80%81%E7%BA%A2%E7%BA%BF/MapServer",
          slider: 100,
          title: "省级生态红线"
        },
        {
          checked: true,
          children: [],
          expand: false,
          haschild: false,
          id: 264,
          layername: "建设用地管制区",
          name: "建设用地管制区",
          remark: "",
          servicename: "建设用地管制区",
          servicetype: "dynamic",
          serviceurl:
            "http://10.10.31.98/arcgis/rest/services/%E6%80%BB%E4%BD%93%E8%A7%84%E5%88%92%E6%95%B0%E6%8D%AE/%E5%9C%9F%E5%9C%B0%E5%88%A9%E7%94%A8%E8%A7%84%E5%88%92/MapServer",
          slider: 100,
          title: "建设用地管制区"
        }
      ]
    };
  },
  mounted() {
    let mapbox = [];
    let layeritem = {};
    for (let i = 0; i < this.items.length; i++) {
      let name = "mapbox" + i;
      layeritem[name] = [this.items[i]];
      mapbox.push(name);
    }
    this.$store.state.mapitemsload = layeritem;
    this.$store.state.mapitems = mapbox;

    setTimeout(() => {
      MapControl.ExtentChange(mapconfig.extent);
    }, 1000);
  },
  methods: {}
};
</script>

<style scoped></style>
