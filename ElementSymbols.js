document.body.innerHTML += `
<svg style="display:none">
	<filter id="filter">
		<feOffset in="SourceAlpha" dx="2" dy="2" />
		<feGaussianBlur stdDeviation="2" />
		<feBlend in="SourceGraphic" in2="blurOut" />
	</filter>
</svg>
`

function drawEarth(container, threshold){
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
	svg.setAttribute('viewBox', '0 0 100 100')
	svg.setAttribute('filter', 'url(#filter)')
	svg.classList.add('element_symbol')
	container.appendChild(svg)
	drawDownTriangle(svg, 'brown')
	drawCrossbar(svg, 'brown')
}

function drawFire(container, threshold, blur=true){
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
	svg.setAttribute('viewBox', '0 0 100 100')
	svg.setAttribute('filter', 'url(#filter)')
	svg.classList.add('element_symbol')
	container.appendChild(svg)
	drawUpTriangle(svg, 'red')
}

function drawWater(container, threshold, blur=true){
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
	svg.setAttribute('viewBox', '0 0 100 100')
	svg.setAttribute('filter', 'url(#filter)')
	svg.classList.add('element_symbol')
	container.appendChild(svg)
	drawDownTriangle(svg, 'blue')
}

function drawAir(container, threshold, blur=true){
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
	svg.setAttribute('viewBox', '0 0 100 100')
	svg.setAttribute('filter', 'url(#filter)')
	svg.classList.add('element_symbol')
	container.appendChild(svg)
	drawUpTriangle(svg, 'white')
	drawCrossbar(svg, 'white')
}

function drawUpTriangle(svg, color) {
  const side = 80
  const height = (Math.sqrt(3) / 2) * side
  const x1 = 50
  const y1 = 50 - (height / 2)
  const x2 = 50 - (side / 2)
  const y2 = 50 + (height / 2)
  const x3 = 50 + (side / 2)
  const y3 = 50 + (height / 2)
  svg.innerHTML += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="none" filter="url(#triangle_filter)" stroke=${color} stroke-width="10"/>`
}

function drawDownTriangle(svg, color, blur=true) {
  const side = 80
  const height = (Math.sqrt(3) / 2) * side
  const x1 = 50
  const y1 = 50 + (height / 2)
  const x2 = 50 - (side / 2)
  const y2 = 50 - (height / 2)
  const x3 = 50 + (side / 2)
  const y3 = 50 - (height / 2)
  svg.innerHTML += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="none" stroke="${color}" stroke-width="10"/>`
}

function drawCrossbar(svg, color){
	svg.innerHTML += `<line x1="10" y1="50" x2="90" y2="50" stroke="${color}" stroke-width="10"/>`
}
