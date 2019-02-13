// module import
const express = require('express')
const model = require('./data/db.js')
const app = express()

app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.render('index')
})

app.route('/api/folder')
	.get(async (req, res) => {
		const result = {success: true}
		try {
			const json = await model.getData()
			result.data = json.folder
		} catch (err) {
			result.success = false
			result.err = err
		}
		res.json(result)
	})
	.post(async (req, res) => {
		const result = {success: true}
		const folder = req.body.folder
		try {
			const json = await model.getData()
			json.folder.push(folder)
			await model.setData(json)
		} catch (err) {
			result.success = false
			result.err = err
		}
		res.json(result)
	})

app.route('/api/task/:parent')
	.get(async (req, res) => {
		const result = {success: true}
		const parent = req.params.parent
		try {
			const json = await model.getData()
			const list = []
			json.task.forEach((v, idx) => {
				if (v.parent == parent) {
					v.idx = idx
					list.push(v)
				}
			})
			result.data = list
		} catch (err) {
			result.success = false
			result.err = err
		}
		res.json(result)
	})
	.post(async (req, res) => {
		const result = {success: true}
		const parent = req.params.parent
		const task = req.body.task
		try {
			const json = await model.getData()
			task.parent = parent
			json.task.push(task)
			await model.setData(json)
		} catch (err) {
			result.success = false
			result.err = err
		}
		res.json(result)
	})
	.put(async (req, res) => {
		const result = {success: true}
		const idx = req.params.parent
		const task = req.body.task
		try {
			const json = await model.getData()
			json.task[idx] = task
			await model.setData(json)
		} catch (err) {
			result.success = false
			result.err = err
		}
		res.json(result)
	})

app.listen(3000, () => {
	console.log('http://127.0.0.1:3000')
})