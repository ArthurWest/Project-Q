Vue.component("data-row", {
	props: {
		frames_amount: Number
	},
	template: `	<div class="data_row">
					<frame-div v-for="index in frames_amount" v-bind:key="index" v-bind:row="$vnode.key" ref="frame"></frame-div>
				</div>`
})
const data = {
	list: null,
	create(Vue_ctx)
	{
		this.list = []

		const rows = Vue_ctx.data_rows_amount
		const cols = Vue_ctx.frames_amount

		const data_rows = Vue_ctx.$refs.data_row

		for (let i = 0; i < rows; i++)
		{
			const data_row = data_rows[i]

			
			this.list.push(new Array(cols))
			
			for (let j = 0; j < cols; j++) 
			{
				const frame = data_row.$refs.frame[j]
				this.list[i][j] = frame
			}
			
		}
	},
	push(row, index, value)
	{
		console.log(`${row}, ${index}, ${value}`)
		this.list[row][index] = 1
	}
}
Vue.component('frame-div', {
	data() {
		return {
			settingsOn: false,

			text: 'Hello my man',
			image: 'https://www.solidbackgrounds.com/images/1280x720/1280x720-rich-electric-blue-solid-color-background.jpg',
			font: 50,
			shift_x: 0,
			shift_y: 0,
			scale_x: 1,
			scale_y: 1,
			text_x: 150,
			text_y: 50,
		}
	},
	methods: {
		log(){
			console.log({
				text: this.text
			})
		},
		paste_img(event)
		{
			if (event.clipboardData.files.length == 0)
			{
				console.log(event.clipboardData)		
			} else
			{
				this.image = window.URL.createObjectURL(event.clipboardData.files[0])
				event.preventDefault()
			}
		},
		setImage(event)
		{
			this.image = window.URL.createObjectURL(event.target.files[0])
		},
		updated() {
			Canvas.render()	
		}
	},
	watch : {
               text:function(val) {
                  this.updated()
               },
               image : function (val) {
                 this.updated()
               },
               font : function (val) {
                 this.updated()
               },
               shift_x : function (val) {
                 this.updated()
               },
               shift_y : function (val) {
                 this.updated()
               },
               scale_x : function (val) {
                 this.updated()
               },
               scale_y : function (val) {
                 this.updated()
               },
               text_x : function (val) {
                 this.updated()
               },
               text_y : function (val) {
				this.updated()
				}
            },
	template: `<div class="frame">
					<div class="frame_top">
						<div class="frame_name">Frame {{ $vnode.key }}</div>
						<button class="frame_toggle" @click="settingsOn = !settingsOn" title="Settings">
							<i class="fa fa-cog"></i>
						</button>
					</div>
					<div class="frame_row">
						<textarea class="frame_text" placeholder="Text" v-model="text"></textarea title="Text">
					</div>
					<div class="frame_row">
						<input type="text" placeholder="image" class="frame_link" @paste="paste_img" v-model="image" title="Image">
						<label class="frame_btn_file" title="Upload image">
						Upload <i class="fa fa-cloud-upload"></i>
						<input type="file" class="frame_file" @change="setImage">
						</label>
					</div>
					<div class="frame_row frame_settings" v-show="settingsOn">
						<input type="number" placeholder="font" class="frame_setting" title="Font" v-model.number="font">
						<input type="number" placeholder="shift x" class="frame_setting" title="shift x" v-model.number="shift_x">
						<input type="number" placeholder="shift y" class="frame_setting" title="shift y" v-model.number="shift_y">
						<input type="number" placeholder="scale x" class="frame_setting" title="scale x" v-model.number="scale_x" step="0.1">
						<input type="number" placeholder="scale y" class="frame_setting" title="scale y" v-model.number="scale_y" step="0.1">
						<input type="number" placeholder="text x" class="frame_setting" title="text x" v-model.number="text_x">
						<input type="number" placeholder="text y" class="frame_setting" title="text y" v-model.number="text_y">
					</div>
				</div>`
})

const app = new Vue({
  el: '#data',
  data: {
    message: 'Hello Vue!',
    data_rows_amount: 1,
    frames_amount: 1,
    frame_width: 480,
    frame_height: 720
  },
  watch: {
  	data_rows_amount(){
  		this.data_create()	
  	},
  	frames_amount()
  	{
  		this.data_create()
  	},
  	frame_width()
  	{
  		this.data_create()
  	},
  	frame_height()
  	{
  		this.data_create()
  	},
  },
  mounted() {
  	this.data_create()
  },
  methods: {
  	data_create()
  	{
  		const Vue_ctx = this
  		Vue.nextTick(function () {
			Canvas.create(Vue_ctx)
			Vue.nextTick(function() {
				Canvas.render()
			})
			
		})
  	}
  }
})
