// import
const express = require('express')
const fs = require('fs')
const app = express()

app.get('/', (req, res) => {
	res.send('hello world')
})
app.get('/test', (req, res) => {
	res.send('this is test page')
})

app.listen(8080, () => {
	console.log('현재 8080 port에서 서버가 실행중입니다.')
})