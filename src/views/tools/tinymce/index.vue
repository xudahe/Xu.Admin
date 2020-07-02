<template>
    <div class="tinymce">
        <tinymce :curValue="initContent" ></tinymce>
    </div>
</template>

<script>

export default {
    name: 'v-tinymce',
    data(){
        return {
            initContent: '',
        }
    },
    methods: {
       
    },

};
</script>

<style scoped>

</style>
