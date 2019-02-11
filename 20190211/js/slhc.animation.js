var slhc = slhc || {}
;(() => {
	// DOM function
	const one = ele => document.querySelector(ele)
	const all = ele => document.querySelectorAll(ele)
	const addClass = (ele, addClassName) => {
		// ex) 'animation top2btm' => ['animation', 'top2btm']
		let classList = ele.className.split(' ')
		const idx = classList.indexOf(addClassName)

		// ex) addClassName : animation => 실행 X
		if (idx === -1) {
			// addClassName : animationBeofre
			// => ['animation', 'top2btm', 'animationBefore']
			classList.push(addClassName)
			// join은 Array2String 역할. 'animation top2btm animationBefore'
			ele.className = classList.join(' ')
		}
	}
	const removeClass = (ele, removeClassName) => {
		let classList = ele.className.split(' ')
		const idx = classList.indexOf(removeClassName)
		if (idx !== -1) {
			classList.splice(idx, 1)
			ele.className = classList.join(' ')
		}
	}

	// Animation Plugin
	let stack = []
	class Animation {
		constructor (option) {
			this.delay = 100
			this.playTarget = one(option.playTarget)
			this.callback = option.callback || function () {}
			this.reverse = option.reverse || false
			this.play()
		}
		find (ele) { return this.playTarget.querySelectorAll(ele) }
		play () {
			this.clear()
			let timer = 0
			const seq = this.reverse
			            ? this.find('.reverse')
			            : this.find('.animation:not(.reverse)')
			const len = seq.length
			seq.forEach((ele, idx) => {
				stack.push(setTimeout(_ => {
					if (this.reverse) {
						const target = seq[len - idx - 1]
						removeClass(target, 'reverse')
						addClass(target, 'animationBefore')
						addClass(target, 'type2')
					} else {
						addClass(ele, 'reverse')
						removeClass(ele, 'animationBefore')
						removeClass(ele, 'type2')
					}
				}, timer += this.delay))
			})
			console.log(stack)
			setTimeout(this.callback, timer+500)
		}
		clear () {
			console.log(stack)
			stack.forEach(ele => clearTimeout(ele))
			stack = []
		}
		static init () {
			all('.animation').forEach(ele => addClass(ele, 'animationBefore'))
			Animation.styleSet()
		}
		static styleSet () {
			const style = document.createElement('style')
			style.innerHTML = `
				.animation{opacity:1;transition:1s;transform:inherit;}
				.animation.animationBefore{opacity:0;transition:0s;transform:scale(0);}
				.animation.animationBefore.top2btm{transform:translateY(100px);}
				.animation.animationBefore.btm2top{transform:translateY(-100px);}
				.animation.animationBefore.left2right{transform:translateX(100px);}
				.animation.animationBefore.right2left{transform:translateX(-100px);}
				.animation.animationBefore.type2{transition:1s}
			`
			one('head').appendChild(style)
		}
	}

	// Animation Initialize
	window.onload = () => { Animation.init() }
	slhc.Animation = Animation
})();