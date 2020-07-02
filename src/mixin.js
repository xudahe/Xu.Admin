import { mapState, mapGetters, mapMutations } from 'vuex'
const mixin = {   
    computed: {
        ...mapGetters([
            'templates'
        ]),
    },
    created() {
        var theme = localStorage.theme;
        if(theme) {
            this.templatesMu(theme);
        }
    },
    methods: {
        ...mapMutations([
            'templatesMu'
        ]),
        _getLess(filename) {
            // console.log(this.templates + filename)
            return require("./../static/template/" + this.templates + filename);
        },
    },
}

export default mixin