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


const bus = new Vue({
	data: {
		parent: null,
		folder: null,
		task: []
	}
})

Vue.component('folder-list', {
	template: `
		<section>
			<h3>Folder List</h3>
			<input type="text" @keyup.enter="addFolder" size="20" />
			<ul v-if="folder || folder.length">
				<li v-for="(v, idx) in folder" v-index="idx" v-html="v.name" @click="taskRender(idx)" />
			</ul>
		</section>
	`,
	async created () {
		this.folder = await model.getFolder()
	},
	data () {
		return {
			folder: []
		}
	},
	methods: {
		async addFolder (e) {
			const name = e.target.value
			this.folder.push({ name })
			await model.setFolder({ name })
			e.target.value = ''
			e.target.focus()
		},
		async taskRender (idx) {
			bus.folder = (await model.getFolder())[idx]
			bus.task = await model.getTask(idx)
			bus.parent = idx
		}
	}
})

Vue.component('task-list', {
	template: `
		<section v-if="bus.folder">
			<h3 v-html="bus.folder.name" />
			<input type="text" @keyup.enter="addTask" />
			<ul v-if="bus.task.length">
				<li v-for="(v, k) in bus.task"
					v-index="k"
					v-html="v.name"
					:style="{color: v.state ? '#09F' : null}"
					@click="toggleState(v)" />
			</ul>
		</section>
	`,
	data () {
		return {
			task: []
		}
	},
	methods: {
		async addTask (e) {
			const task = {name: e.target.value, state: false, parent: bus.parent}
			await model.addTask(task)
			bus.task.push(task)
			e.target.value = ''
			e.target.focus()
		},
		async toggleState (v) {
			v.state = !v.state
			await model.setTask(v)
		}
	}
})

new Vue({ el: '#app' })