<template>
  <div class="v-card">
    <v-card :datalist="datalist" :columns="columns"></v-card>
  </div>
</template>

<script>
export default {
  name: "card",
  data() {
    return {
      datalist: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      columns: {
        xxl: 6,
        xl: 4,
        lg: 4,
        md: 3,
        sm: 2,
        xs: 1
      }
    };
  },
  methods: {}
};
</script>

<style scoped></style>
