function showPostDeckScreen(){
	stage.innerHTML = ''
	stage.style = `
		display: grid;
		height: 100vh;
		width: 100vw;
		grid-template-rows: 1fr 1fr 1fr;
		gap: 1vh;
	`
	var prompt_div = document.createElement('div')
	prompt_div.setAttribute('id', 'prompt_div')
	prompt_div.innerHTML = `
		Continue to edit your deck and press the submit button when you are done.
	`
	prompt_div.style.alignSelf = 'end'
	prompt_div.style.justifySelf = 'center'
	stage.appendChild(prompt_div)
	
	
	var interface_div = document.createElement('div')
	interface_div.setAttribute('id', 'interface_div')
	interface_div.innerHTML = '<button id="submit_deck_button" onclick="prepareDeck()">Submit Deck</button>'
	interface_div.style.alignSelf = 'start'
	interface_div.style.justifySelf = 'center'
	stage.appendChild(interface_div)
	
}

function prepareDeck(){
	var collection = Draft.state[`${userID}_cards`]
	var compacted_collection = compactCollection(collection)
	var prepared_deck = {avatar: [], spellbook: [], atlas: [], sideboard: [], maybe: []}
	prepared_deck.avatar.push(master_card_list.find((card)=>{return card.name = 'Sorcerer'}))
	compacted_collection.forEach((card)=>{
		if (card.section == 'sideboard') prepared_deck.sideboard.push(card)
		if (card.section == 'maybe') prepared_deck.sideboard.push(card)
		if (card.section == 'keep') {
			if( card.metadata.type == 'Site') prepared_deck.atlas.push(card)
			else if (card.metadata.type == 'Avatar') prepared_deck.avatar = [card]
			else prepared_deck.spellbook.push(card)
		}
	})
	const prepared_deck_string = JSON.stringify(prepared_deck)
	postDeck(prepared_deck_string)
		.then(url => {
			console.log(url)
			if (url) {
				document.querySelector("#prompt_div").innerHTML = `This is your Tabletop Simulator Link:` 
				document.querySelector("#interface_div").innerHTML = `<a href="${url}">The Link</a>` 
			}
		})
}

async function postDeck(raw_text) {
	const base_url = "https://sorcery-draft.ftftft78.workers.dev/"
	return fetch(base_url + "post-deck", { // Return the fetch promise
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
		},
		body: raw_text,
	})
	.then(response => response.text())
	.then(key => {
		const url = base_url + "get-deck/" + key;
		console.log('Stored with key:', key);
		return url; // Return the URL from this promise resolution
	});
}