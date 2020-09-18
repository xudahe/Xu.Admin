<template>
    <div class="markdown">
        <markdown :curValue="initContent"></markdown>
    </div>
</template>

<script>

export default {
    name: 't-markdown',
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
