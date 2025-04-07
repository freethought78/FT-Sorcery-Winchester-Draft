function addDeckManagementPanel(){
	if (typeof (deck_management_panel_container) == 'undefined'){
		deck_management_panel_container = document.createElement('div')
		deck_management_panel_container.setAttribute('id', 'deck_management_panel_container')
		document.body.appendChild(deck_management_panel_container)
		addDeckManagementToggleButtons()
		keep_container = document.createElement('div');
		keep_container.setAttribute('id', 'keep_container');

		keep_section = document.createElement('div');
		keep_section.classList.add('section', 'keep');

		sideboard_section = document.createElement('div');
		sideboard_section.classList.add('section', 'sideboard');

		maybeSection = document.createElement('div');
		maybeSection.classList.add('section', 'maybe');
			
		deck_management_panel_container.appendChild(keep_container);
		keep_container.appendChild(keep_section);
		deck_management_panel_container.appendChild(sideboard_section);
		deck_management_panel_container.appendChild(maybeSection);
	}
	populateDeckPanel()
}

function populateDeckPanel() {
	var collection = Draft.state[`${userID}_cards`]
	keep_section.innerHTML = ""
	for (var entry in collection){
		const card_div = document.createElement('div');
		card_div.innerHTML = collection[entry].name
		keep_section.appendChild(card_div)
	}
}

function populateDeckManagerWithRandomCards(){
	// Add sample card slots (just for testing)
	for (let i = 0; i < 26; i++) {
		const slot = document.createElement('div');
		slot.classList.add('card-slot');
		card_name = randomCardName()
		slot.textContent = card_name;
		keep_section.appendChild(slot);
	}

	for (let i = 0; i < 4; i++) {
		const slot = document.createElement('div');
		slot.classList.add('card-slot');
		card_name = randomCardName()
		slot.textContent = card_name;
		sideboard_section.appendChild(slot);
	}

	for (let i = 0; i < 20; i++) {
		const slot = document.createElement('div');
		slot.classList.add('card-slot');
		card_name = randomCardName()
		slot.textContent = card_name;
		maybeSection.appendChild(slot);
	}
}

function randomCardName(){
	var card_number = Math.random()*master_card_list.length
	card_number = Math.floor(card_number)
	var card_name = master_card_list[card_number].name
	return card_name
}

function addDeckManagementToggleButtons(){
	if (typeof (deck_management_toggle_button) == 'undefined'){
		deck_management_toggle_button = document.createElement('div')
		var toggle_button = deck_management_toggle_button
		toggle_button.setAttribute('id', 'toggle_deck_manager_button')
		toggle_button.style.position = "fixed"
		
		toggle_button.style.height = 30
		toggle_button.style.padding = 5
		toggle_button.style.backgroundColor = '#222'
		toggle_button.style.fontSize = 30
		toggle_button.style.zIndex = 20
		
		toggle_button.style.right = 0
		toggle_button.innerHTML = 'Deck Manager'
		document.body.appendChild(toggle_button)
		repositionToggleButtons()
		
		toggle_button.onclick =()=>{
			if(deck_management_panel_container.style.height == '0px') deck_management_panel_container.style.height = '25vh'
			else deck_management_panel_container.style.height = '0px'
			
			repositionToggleButtons()
		}
	}
}

function repositionToggleButtons(){
	var top = deck_management_panel_container.getBoundingClientRect().top
	deck_management_toggle_button.style.top = top - 40
	status_message_div = document.getElementById('status_message')
	status_message_div.style.top = top - 100
}