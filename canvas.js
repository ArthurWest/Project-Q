const Canvas = {
	grid: null,
	rows: null,
	cols: null,
	frame_width: 640,
    frame_height: 720,
	create(Vue_ctx)
	{
		this.grid = []

		const rows = Vue_ctx.data_rows_amount
		const cols = Vue_ctx.frames_amount

		this.rows = rows
		this.cols = cols

		this.frame_width = Vue_ctx.frame_width
		this.frame_height = Vue_ctx.frame_height
		

		const data_rows = Vue_ctx.$refs.data_row

		for (let i = 0; i < rows; i++)
		{
			const data_row = data_rows[i]

			
			this.grid.push(new Array(cols))
			
			for (let j = 0; j < cols; j++) 
			{
				const frame = data_row.$refs.frame[j]
				this.grid[i][j] = frame
			}
			
		}
	},
	find_y(ctx, text, x_pos, y_pos, max_width, line_height) 
	{

		text = text.replace(/\n/g, ' 普 ')
		const words = text.split(" ")
		let line = ""
		let new_line = ""
		for (let i = 0; i < words.length; i++)
		{
			if (words[i] == '普') 
			{
				words[i] = ''
				new_line = words[i] + ' '
				y_pos = y_pos + line_height //Make the next line lower
				continue;

			}


			new_line += words[i] + ' '

			
			if (ctx.measureText(new_line).width > max_width) //If new line is 
			{
					
				new_line = words[i] + ' ' //Set the word that did not make as the starting for the new line
				y_pos = y_pos + line_height //Make the next line lower
			}
			line = new_line 
		}
		if (line.length>0) {
			y_pos = y_pos + line_height
		}
		return y_pos
	},
	addText(ctx, text, x_pos, y_pos, max_width, line_height) 
	{

		text = text.replace(/\n/g, ' 普 ')
		const words = text.split(" ")
		let line = ""
		let new_line = ""
		for (let i = 0; i < words.length; i++)
		{
			if (words[i] == '普') 
			{
				words[i] = ''
				new_line = words[i] + ' '
				ctx.fillText(line, x_pos, y_pos)
				y_pos = y_pos + line_height //Make the next line lower
				continue;

			}


			new_line += words[i] + ' '

			
			if (ctx.measureText(new_line).width > max_width) //If new line is 
			{
					
				ctx.fillText(line, x_pos, y_pos)
				new_line = words[i] + ' ' //Set the word that did not make as the starting for the new line
				y_pos = y_pos + line_height //Make the next line lower
			}
			line = new_line 
		}
		if (line.length>0) {
			ctx.fillText(line, x_pos, y_pos)
		}
	},
	find_end_index(image, row, col)
	{
		let amount = 0;
		for (let i = col; i < this.grid[row].length; i++)
		{
			if (image == this.grid[row][i].image)
			{
				amount = amount + 1
			} else 
			{
				break;
			}
		}
		return amount
	},
	draw_frame(ctx, frame_div, row_index, col_index, width_amount)
	{

		const image_el = document.createElement("img")
		image_el.src = frame_div.image

		const Canvas_ctx = this
		// image_el.onload = () => {
		
			const x_pos = col_index * this.frame_width
			const y_pos = row_index * this.frame_height
		
			const sx = frame_div.shift_x
			const sy = frame_div.shift_y

			const sWidth = frame_div.scale_x * this.frame_width * width_amount
			const sHeight = frame_div.scale_y * this.frame_height

			const dWidth = this.frame_width * width_amount
			const dHeight = this.frame_height

			ctx.drawImage(image_el, sx, sy, sWidth, sHeight, x_pos, y_pos, dWidth, dHeight);


			ctx.textBaseline = "top";
			ctx.textAlign = "center";
			ctx.font = `${frame_div.font}px Arial`

			const text_y = 10
			const text_pos_x = x_pos + dWidth/2 
			let text_pos_y = this.frame_height * (row_index+1) - text_y
			const text_max_width = dWidth - frame_div.text_x
			const text_line_height = frame_div.font * 1.5



			while (this.find_y(ctx, frame_div.text, text_pos_x, text_pos_y, text_max_width, text_line_height) > dHeight*(row_index+1))
			{
				text_pos_y = text_pos_y - 10
			}

		

			ctx.fillStyle = "black"
			this.addText(ctx, frame_div.text, text_pos_x+3, text_pos_y, text_max_width, text_line_height)
			this.addText(ctx, frame_div.text, text_pos_x-3, text_pos_y, text_max_width, text_line_height)
			this.addText(ctx, frame_div.text, text_pos_x, text_pos_y+3, text_max_width, text_line_height)
			this.addText(ctx, frame_div.text, text_pos_x, text_pos_y-3, text_max_width, text_line_height)

			ctx.fillStyle = "white"
			this.addText(ctx, frame_div.text, text_pos_x, text_pos_y, text_max_width, text_line_height)
		// }
	},
	render()
	{
		const canvas_el = document.getElementById('canvas_el')
		const ctx = canvas_el.getContext("2d")

		

		canvas_el.width = this.frame_width * this.cols
		canvas_el.height = this.frame_height * this.rows

		for (let i = 0; i < this.rows; i++)
		{
			for (let j = 0; j < this.cols; j++)
			{
				const frame_div = this.grid[i][j]
				const width_amount = this.find_end_index(frame_div.image, i, j)
			
				this.draw_frame(ctx, frame_div, i, j, width_amount)

				j = j + width_amount - 1

			}
		} 
	}
}