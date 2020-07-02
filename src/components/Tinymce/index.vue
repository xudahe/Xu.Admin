<template>
    <div>
        <editor id="tinymce" v-model="value" :init="init"></editor>
    </div>
</template>

<script>
    //引入基础文件：
    import plugins from './js/plugins';
    import toolbar from './js/toolbar';

    import convertHttp from '@/utils/convertHttp.js';
    import tinymce from 'tinymce/tinymce'
    import Editor from '@tinymce/tinymce-vue'
    import 'tinymce/themes/silver'
    import 'tinymce/icons/default/icons'
    
    export default {
        name: "tinymce",
        components:{
            Editor
        },
        // model: {
	    // 	prop: 'value',
	    // 	event: 'input'
	    // },
        props:{
            baseUrl: {
                type: String,
                default: ''
            },
            curValue:{
                type:String,
                default:''
            },
            height: {
                type: Number,
		    	default: 400
		    },
        },
        watch: {
            curValue(val) {
		    	// 用于异步传值
		    	if (this.asyncInit && val && this.tinymce) {
		    		this.$nextTick(() => {
		    			this.asyncInit = false;
		    			this.tinymce.setContent(val);
		    		});
		    	}
		    	// 用于清空编辑器
		    	if (!val && this.tinymce) {
		    		this.$nextTick(() => {
		    			this.tinymce.setContent('');
		    		});
		    	}
		    }
        },
        data(){
            return{
                value: this.curValue,
                tinymce: '',
                asyncInit: true,
                randomId: new Date().getTime(),
                init:{
                    selector: `#${this.randomId}`, //dom选择器
                    language_url: `/static/tinymce/langs/zh_CN.js`, // 语言包的路径
                    language: 'zh_CN', //语言
                    skin_url: `/static/tinymce/skins/ui/oxide`, // skin路径
                    content_css: `/static/tinymce/skins/content/default/content.css`,
                    height: this.height, //编辑器高度
                    browser_spellcheck: true, // 拼写检查
                    branding: false, // 去水印
                    elementpath: true,  //禁用编辑器底部的状态栏
                    statusbar: true, // 隐藏编辑器底部的状态栏
                    paste_data_images: true, // 允许粘贴图像
                    menubar: true, // 隐藏最上方menu
                    plugins: 'link lists image code  wordcount',
                    toolbar: 'undo redo | bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | link unlink image code | removeformat',
                    contextmenu: "bold copy italic underline lineheight forecolor backcolor strikethrough",
                    fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt 56pt 72pt 84pt 96pt 108pt",
				    ax_wordlimit_callback: function(editor, txt, num) {
				    	// 字数限制
                    },
                    file_picker_callback: function(callback, value, meta) { // 此处为文件上传处理函数
			        	this.$getFile(100).then(raw => {
			        		// this.$http_file({
			        		// 		url: '/api/localStorage/upload',
			        		// 		method: 'post',
			        		// 		data: {
			        		// 			file: raw
			        		// 		}
			        		// 	})
			        		// 	.then(result => {
			        		// 		callback(convertHttp(result.data.url));
			        		// 	});
			        	});
			        },
                    images_upload_handler: (blobInfo, success, failure) => { // 图片异步上传处理函数
                        let formData = new FormData();
                        formData.append('folder', 'editor/img'); 
                        formData.append('upfile', blobInfo.blob(), blobInfo.filename());
                        // this.$http_file({
						//     	url: '/api/localStorage/upload',
						//     	method: 'post',
						//     	data: formData
						//     })
						//     .then(result => {
						//     	success(convertHttp(result.data.url)); // 图片上传成功以后调用success,图片就可以在富文本编辑器中显示
						//     }).catch(e => {
						//     	failure(e)
						//     });
                    },
                    init_instance_callback(editor) {
				    	// this.tinymce = editor;
				    	// if (this.value) {
				    	// 	editor.setContent(this.value);
				    	// }
				    	// editor.on('NodeChange Change KeyUp SetContent', () => {
				    	// 	this.$emit('input', editor.getContent()); //
				    	// });
                    }
                }
            }
        },
        mounted() {
            tinymce.init({})
        },
        methods: {
            getSketch() {
              const editBody = this.tinymce.getBody();
              this.tinymce.selection.select(editBody);
              return this.tinymce.selection.getContent({ format: 'text' })
            },
            getImageLinkList() {
              var data = [];
              this.tinymce.getContent().replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
                data.push(capture);
              });
              return data
            },
            getVideoList() {
              var data = [];
              this.tinymce.getContent().replace(/<video [^>]*src=['"]([^'"]+)[^>]*>/g, function (match, capture) {
                data.push(capture);
              });
              return data
            },
	     	removeTinymce() {
	     		this.tinymce.destroy();
            },
        },
        destroyed() {
	    	this.removeTinymce();
	    },
    }
</script>