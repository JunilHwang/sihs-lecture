// selector
const all = ele => document.querySelectorAll(ele)
const one = ele => document.querySelector(ele)
const getClassList = ele => one(ele).className.split(' ')
const getClass = (ele, className) => {
	const classList = getClassList(ele)
	for (const v of classList) {
		if (v === className) return v
	}
	return null
}

// 사이트 로드 시 시행 되는 명령어
window.onload = () => {
	slhc.Slide.init()
}