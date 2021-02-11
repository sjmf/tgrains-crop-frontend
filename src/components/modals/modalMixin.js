export default {
    props: {
        id: {type: String, default: 'modal-default'},
    },
    computed: {
        domNode() {
            return document.querySelector('#' + this.id)
        }
    },
    methods: {
        instance() {
            // NB: This must be a method, NOT a computed property
            return this.$_M.Modal.getInstance(this.domNode)
        },
        open() {
            // Instantiate if undefined.
            if (this.instance() === undefined) {
                this.$_M.Modal.init(this.domNode)
            }
            this.instance().open();
        },
        close() {
            this.instance().close()
        }
    }
}