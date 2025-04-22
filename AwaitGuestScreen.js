function showAwaitGuestScreen(){
	var main_style = document.querySelector("#main_style")
	main_style.innerHTML += `
	.partner_connect_link{
		height: 100%;
		text-shadow:1px 2px 7px #000000;
		justify-content: center;
		align-content: center;
		font-size: 5vh;
		display: grid;
	}
	`
	
    base_url = 'index.html'
	url = generateJoinLink(base_url)
    stage.innerHTML = `<div class="partner_connect_link"><a href = ${url}>send this link to your draft partner</a></div>`
}

function generateJoinLink(base_url, id){
	return `${base_url}?session=${encode(peer_ID)}`
}