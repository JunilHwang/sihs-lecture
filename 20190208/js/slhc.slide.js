// slide Plugin
var slhc = slhc || {};
(() => {
	const Slide = class {
		constructor (ele) {
			/* 변수 세팅 */
			this.pos = 0
			this.target = ele.querySelector('ul')
			this.len = this.target.children.length
			this.height = ele.clientHeight
			this.setTime = ele.dataset.settime
			this.playTime = parseFloat(ele.dataset.playtime / 1000)

			/* 메소드 실행 */
			this.styleSet()
			this.play()
		}
		playBefore () {}
		playAfter () {}
		styleSet () {}
		play () {
			setInterval(_ => {
				this.playBefore()
				this.pos = (this.pos + 1) % this.len
				this.playAfter()
			}, this.setTime)
		}
		static init () {
			all('.slide').forEach(ele => {
				const type = ele.dataset.type
				new slideType[type](ele)
			})
		}
	}
	const SlideLeft2Right = class extends Slide {
		constructor (ele) { super(ele) }
		styleSet () {
			this.target.style.cssText = `transition:${this.playTime}s;width:calc(100% * ${this.len});display:flex;`
			Array.from(this.target.children).forEach(ele => ele.style.cssText = `width:calc(100% / ${this.len});`)
		}
		playAfter () {
			this.target.style.marginLeft = `${-this.pos*100}%`
		}
	}
	const SlideTop2Btm = class extends Slide {
		constructor (ele) { super(ele) }
		styleSet () {
			this.target.style.cssText = `transition:${this.playTime}s;height:calc(100% * ${this.len});`
			Array.from(this.target.children).forEach(ele => ele.style.cssText = `height:calc(100% / ${this.len});`)
		}
		playAfter () {
			this.target.style.marginTop = `${-this.pos * this.height}px`
		}
	}
	const SlideFade = class extends Slide {
		constructor (ele) { super(ele) }
		styleSet () {
			this.target.style.cssText = `position:relative;`
			Array.from(this.target.children).forEach(ele => ele.style.cssText = `position:absolute;left:0;right:0;bottom:0;top:0;opacity:0;transition:${this.playTime}s`)
			this.target.children[0].style.opacity = 1
		}
		playBefore () {
			this.target.children[this.pos].style.opacity = 0
		}
		playAfter () {
			this.target.children[this.pos].style.opacity = 1
		}
	}
	const slideType = {
		left2right: SlideLeft2Right,
		top2btm: SlideTop2Btm,
		fade: SlideFade
	}

	slhc.Slide = Slide
})();