// import
const express = require('express')
const fs = require('fs')
const app = express()

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile)

app.use(express.static('public'))
app.use(express.urlencoded())
app.use(express.json())

// file function
const fread = path => new Promise((resolve, reject) => {
	fs.readFile(path, 'utf8', (err, data) => {
		resolve(data)
	})
})
const fwrite = (path, data) => new Promise((resolve, reject) => {
	fs.writeFile(path, JSON.stringify(data), 'utf8', (err, data) => {
		resolve(data)
	})
})

app.get('/', (req, res) => {
	res.render('index.html')
})
app.get('/register', (req, res) => {
	res.render('register.html')
})
app.get('/login', (req, res) => {
	res.render('login.html')
})
app.post('/login', (req, res) => {
	res.json({
		id: req.body.id,
		pw: req.body.pw
	})
})
app.get('/api/login', (req, res) => {
	res.json({
		success: true,
		login: false
	})
})
app.post('/api/login', (req, res) => {
	fs.readFile(__dirname + '/db/user.json', 'utf8', (err, data) => {
		
	})
})
app.post('/api/register', async (req, res) => {
	const path = __dirname + '/db/user.json'
	const result = {success: true, chk: true}
	let data = JSON.parse(await fread(path)) || []
	for (const v of data) if (v.id === req.body.id) {
		result.chk = false
		break;
	}
	if (result.chk) {
		data.push({name, id, pw} = req.body)
		await fwrite(path, data)
	}
	res.json(result)
})

app.listen(8080, () => {
	console.log('현재 8080 port에서 서버가 실행중입니다.')
})