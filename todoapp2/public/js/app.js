/* /public/js/app.js */

// dom function
const one = ele => document.querySelector(ele)
const all = ele => document.querySelectorAll(ele)
const create = (name, attr) => {
	const ele = document.createElement(name)
	for (const attrName in attr ) {
		const v = attr[attrName]
		switch (attrName) {
			case 'html' : ele.innerHTML = v; break;
			case 'event' : 
				for (const eventName in v) {
					ele.addEventListener(eventName, v[eventName])
				}
			break;
			default : ele.setAttribute(attrName, v); break;
		}
	}
	return ele
}

// Tag 선택
const folderInput = one('.folder-input')
const folderList  = one('.folder-list')
const taskList    = one('.task-list')

// Ajax
class Ajax {
	static async get (url) {
		const json = await fetch(url).then(res => res.json())
		if (!json.success) throw json.err
		return json.data
	}

	static async set (url, data, method = 'post') {
		const headers = { 'content-type': 'application/json' }
		const params = { method, headers, body: JSON.stringify(data) }
		const json = await fetch(url, params).then(res => res.json())
		if (!json.success) throw json.err
		return json.data
	}
}

// Model
const model = new class {
	async getFolder () { return await Ajax.get('/api/folder') }
	async setFolder (folder) { await Ajax.set('/api/folder', { folder }) }
	async getTask (parent) { return await Ajax.get('/api/task/' + parent) }
	async addTask (task) { await Ajax.set('/api/task/' + task.parent, { task }) }
	async setTask (task) { await Ajax.set('/api/task/' + task.idx, { task }, 'put') }
}

// addFolder
const addFolder = async e => {
	if (e.keyCode === 13) {
		const folder = await model.getFolder()
		const newFolder = {name: e.target.value}
		folder.push(newFolder)
		await model.setFolder(newFolder)
		e.target.value = ''
		e.target.focus()
		folderRender(folder)
	}
}

// taskWrapRender
const taskWrapRender = parent => async e => {
	const folder = await model.getFolder()
	const title = create('h3', {html: folder[parent].name})
	const ul    = create('ul')
	const input = create('input', {
		size: 20,
		event: {
			keyup: async inputEvent => {
				if (inputEvent.keyCode === 13) {
					const name = inputEvent.target.value
					const state = false
					const task = await model.getTask(parent)
					const v = {name, state, parent}
					task.push(v)
					await model.addTask(v)
					e.target.click()
				}
			}
		}
	})
	const close = create('button', {
		type: 'button', html: '닫기', event: {
			click: e => taskList.innerHTML = ''
		}
	})
	const task = await model.getTask(parent)
	task.forEach(v => ul.appendChild(taskRender(v)))
	taskList.innerHTML = ''
	for (const ele of [title, input, ul, close]) taskList.appendChild(ele)
}

// taskRender
const taskRender = ele => create('li', {
	html: ele.name,
	style: ele.state ? 'color:#09F' : '',
	event: {
		click: async e => {
			ele.state = !ele.state
			await model.setTask(ele)
			e.target.style.color = ele.state ? '#09f' : ''
		}
	}
})

// Renderer
const folderRender = folder => {
	const ul = create('ul')
	folder.forEach((v, k) => {
		ul.appendChild(create('li', {
			html: v.name,
			event: { click: taskWrapRender(k) }
		}))
	})
	folderList.innerHTML = ''
	folderList.appendChild(ul)
}

window.onload = async e => {
	folderInput.onkeyup = addFolder
	const folder = await model.getFolder()
	folderRender(folder)
}