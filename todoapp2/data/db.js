// /data/db.js
// /data/data.json
const fs = require('fs')

const path = __dirname + '/data.json'
const getData = _ => new Promise((resolve, reject) => {
	fs.readFile(path, 'utf-8', (err, data) => {
		err ? reject(err) : resolve(JSON.parse(data || null))
	})
})
const setData = data => new Promise((resolve, reject) => {
	fs.writeFile(path, JSON.stringify(data), 'utf-8', (err, data) => {
		err ? reject(err) : resolve()
	})
})

module.exports = { getData, setData }