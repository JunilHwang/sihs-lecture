// 02.js
const http = require('http')
http.createServer((req, res) => {
	// req(request, 요청) : Client 측에서 요청하는 정보
	// res(response, 응답) : Client에 보내는(응답하는) 정보
	res.setHeader('content-type', 'text/html;charset=utf8')
	switch (req.url) {
		case '/' : index(req, res); break;
		case '/member' : member(req, res); break;
		default :
			res.write('없는 페이지입니다.')
		break;
	}
	res.end()
}).listen(8080)

const index = (req, res) => {
	res.write('index page 입니다.')
}
const member = (req, res) => {
	res.write('member page 입니다.')
}
console.log('http 8080 port에서 서버가 실행 됩니다.')