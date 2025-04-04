function showAwaitGuestScreen(){
    base_url = 'index.html'
	url = generateJoinLink(base_url)
    stage.innerHTML = `<center><h1><br><br><br><br><br><a href = ${url}>send this link to your draft partner</h1></a>`
}

function generateJoinLink(base_url, id){
	return `${base_url}?session=${encode(peer_ID)}`
}