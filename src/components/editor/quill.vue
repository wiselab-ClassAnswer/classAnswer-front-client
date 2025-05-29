<template>
    <quillEditor 
      style="  min-height: 110px !important;
               max-height: 110px;
               overflow: hidden;
               overflow-y: scroll;
               overflow-x: scroll;"
      v-model:value="cntn"
      :options="state.editorOption"
      :disabled="disableYn"
      @blur  ="onEditorBlur($event)"
      @focus ="onEditorFocus($event)"
      @ready ="onEditorReady($event)"
      @change="onEditorChange($event)"
    />
  </template>
  
  <script>
  import { reactive }    from 'vue'
  import { quillEditor } from 'vue3-quill'
  
  export default {
    components:{quillEditor},
    name: 'App',
    emits:['disableYn', 'cntn', 'update:cntn'],
    props:{
        cntn : String,
        disableYn: Boolean,
    },
    setup() {
      const state = reactive({
        editorOption: {
          placeholder: '이곳에 글을 작성해 주세요',
          modules: {
            toolbar: [
            // ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            // ['blockquote', 'code-block'],

            // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript
            // [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
            // [{ 'direction': 'rtl' }],                         // text direction

            // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            // [{ 'font': [] }],
            // [{ 'align': [] }],
            // ['link', 'video', 'image'],
            // ['clean']  
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons    
                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'align': [] }],       
                ['image'], 
            ]
             //toolbars: toolbarOptions
              // custom toolbars options
              // will override the default configuration
            // ],
            // other moudle options here
            // otherMoudle: {}
          },
          // more options
        },
        disabled: false
      })
  
      const onEditorBlur = (quill) => {
        //console.log('editor blur!', quill)
      }
      const onEditorFocus = (quill) => {
        //console.log('editor focus!', quill)
      }
      const onEditorReady = (quill) => {
        //console.log('editor ready!', quill)
      }
    //   const onEditorChange = ({ quill, html, text }) => {      
    //   }
  
    //   setTimeout(() => {
    //     state.disabled = true
    //   }, 2000)
  
      return { state, onEditorBlur, onEditorFocus, onEditorReady }
    },
    methods:{
        init(){
            let $this = this;
        },
        onEditorChange({ quill, html, text }){
            this.$emit('update:cntn', html)
            let $this=  this;
        }
    },
    mounted(){
        let $this = this;
        $this.init();
    }

  }
  </script>
