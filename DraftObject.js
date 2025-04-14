var Draft = {}
master_card_list = prepareCards()
function createDraftObject(configuration){
	Draft = {}
	var cube_source = configuration.cube_source
	if (cube_source == "random") Draft.cube = generateRandomCube(configuration.cube_size)
	if (cube_source == "names") Draft.cube = configuration.card_list
	Draft.cube = shuffle(Draft.cube)
	Draft.state = {}
	Draft.state.host_cards = []
	Draft.state.guest_cards = []
	Draft.state.draft_columns = [[],[],[],[]]
	Draft.state.turn = "guest" //The host go be first, after the first card pull happens, which changes the turn
}

function shuffle(array){
	const shuffledArray = array.sort(() => Math.random() - 0.5);
	return shuffledArray
}

function nextPull(conn){
	    for (var colid in Draft.state['draft_columns']){
			var col = Draft.state['draft_columns'][colid]
			if(Draft.cube.length > 0) col.push(Draft.cube.pop())
		}
        if (Draft.state.turn == 'host') Draft.state.turn = 'guest'
        else Draft.state.turn = 'host'
		buildStage(conn)
		sendStateUpdate(conn)
}

function prepareCards(){
	beta_card_list = []
	AL_card_list = []
	for (var cardid in beta_cards.spellbook) beta_card_list.push(beta_cards.spellbook[cardid])
	for (var cardid in beta_cards.atlas) beta_card_list.push(beta_cards.atlas[cardid])
	for (var cardid in beta_cards.sideboard) beta_card_list.push(beta_cards.sideboard[cardid])

	for (var cardid in beta_card_list){
		var card = beta_card_list[cardid]
		if (card.name == 'Sorcerer') card.src = card.src.replace('/alp/', '/bet/')
		
		if (card.src.includes('/alp/')) card.set = 'alpha'
		if (card.src.includes('/bet/')) card.set = 'beta'
	}
	
	
	for (var cardid in AL_cards.spellbook) AL_card_list.push(AL_cards.spellbook[cardid])
	for (var cardid in AL_cards.atlas) AL_card_list.push(AL_cards.atlas[cardid])
	for (var cardid in AL_cards.sideboard) AL_card_list.push(AL_cards.sideboard[cardid])
		
	for (var cardid in AL_card_list){
		var card = AL_card_list[cardid]
		card.set = 'arthurian legends'
	}
	
	return [...beta_card_list, ...AL_card_list]
}

function generateRandomCube(size){
	return getRandomElements(master_card_list, size)
}