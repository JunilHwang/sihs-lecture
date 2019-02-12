// DOM function
const one = ele => document.querySelector(ele)
const all = ele => document.querySelectorAll(ele)
const create = (name, attr) => {
  const ele = document.createElement(name)
  for(const k in attr) {
    const v = attr[k]
    switch (k) {
      case 'html' : ele.innerHTML = v; break;
      case 'event' : for (const e in v) ele.addEventListener(e, v[e]); break;
      default : ele.setAttribute(k, v); break
    }
  }
  return ele
}

// myAjax
class Ajax {
  static async get (url) {
    const json = await fetch(url).then(res => res.json())
    if (!json.success) throw json.err
    return json.data
  }
  static async set (url, data, method = 'post') {
    const headers = { 'Content-Type': 'application/json' }
    const params = { method, headers, body: JSON.stringify(data) }
    const json = await fetch(url, params).then(res => res.json())
    if (!json.success) throw json.err
    return json.data
  }
}

// DataBase
class Model {
  async getFolder () { return await Ajax.get('/api/folder')}
  async setFolder (folder) { await Ajax.set('/api/folder', { folder })}
  async getTask (parent) { return await Ajax.get('/api/task/' + parent) || []}
  async addTask (task, parent) { await Ajax.set('/api/task/' + parent, { task })}
  async setTask (task, idx) { await Ajax.set('/api/task/' + idx, { task }, 'put')}
}

// Renderer
class Renderer {
  constructor (model) {
    this.model = model
    this.folderInput = one('.folder-input')
    this.folderList = one('.folder-list')
    this.taskList = one('.task-list')
    this.folderInput.onkeyup = this.addFolder()
  }

  addFolder () {
    const $this = this
    return async function (e) {
      if (e.keyCode === 13) {
        const folder = await $this.model.getFolder()
        folder.push({ name: e.target.value })
        await $this.model.setFolder(folder)
        $this.folderRender(folder)
        e.target.value = ''
        e.target.focus
      }
    }
  }

  addTask (folderEvent, parent) {
    const $this = this
    return async inputEvent => {
      if (inputEvent.keyCode === 13) {
        await $this.model.addTask({name: inputEvent.target.value, state: false}, parent)
        folderEvent.target.click()
      }
    }
  }

  setTask (v) {
    return async e => {
      v.state = !v.state
      await $this.model.setTask(v, v.idx)
      e.target.style.color = v.state ? '#09F' : ''
    }
  }

  folderRender (folder) {
    const ul = create('ul')
    folder.forEach((v, k) => {
      ul.appendChild(create('li', {html: v.name, event: {click: this.taskRender(v.name, k)}}))
    })
    this.folderList.innerHTML = ''
    this.folderList.appendChild(ul)
  }

  taskRender (folderName, parent) {
    const $this = this
    return async e => {
      const title = create('h3', {html: folderName})
      const ul = create('ul')
      const task = await $this.model.getTask(parent)
      const input = create('input', {class: 'task-input', size: 20, placeholder: 'task 입력', event: { keyup: $this.addTask(e, parent) } })
      const close = create('button', {type: 'button', html: '닫기', event: {click: e => $this.taskList.innerHTML = ''}})
      task.forEach(v => ul.appendChild($this.taskChildRender(v)))
      $this.taskList.innerHTML = ''
      for(const ele of [title, input, ul, close]) $this.taskList.appendChild(ele)      
    }
  }

  taskChildRender (v) {
    const $this = this
    return create('li', {
      html: v.name,
      style: v.state ? 'color:#09F' : '',
      event: { click: $this.setTask(v) }
    })
  }
}

window.onload = async _ => {
  const model = new Model()
  const renderer = new Renderer(model)
  const folder = await model.getFolder()
  renderer.folderRender(folder)
}