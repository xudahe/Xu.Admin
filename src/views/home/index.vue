<template>
  <div style="height:100%;" class="home">
    <swiper :imgList="imgList"></swiper>
    <swiper :imgList="imgList" style="margin-top:5px;"></swiper>
    <swiper :imgList="imgList" style="margin-top:5px;"></swiper>
  </div>
</template>

<script>

export default {
  components: {
    
  },
  data() {
    return {
      imgList:[
        {img: './static/img/home/b1.png'},
        {img: './static/img/home/b2.png'},
        {img: './static/img/home/b3.png'},
        {img: './static/img/home/b4.png'},
      ]
    };
  }
};
</script>
