// 02.js
const http = require('http')
http.createServer((req, res) => {
	res.write('Hello')
	res.end()
}).listen(8080)

console.log('http 8080 port에서 서버가 실행 됩니다.')