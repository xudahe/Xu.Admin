<template>
    <div class="tinymce">
        <tinymce :curValue="initContent" ></tinymce>
    </div>
</template>

<script>

export default {
    name: 't-tinymce',
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
