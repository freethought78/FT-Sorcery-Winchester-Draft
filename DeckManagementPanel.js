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

		maybe_section = document.createElement('div');
		maybe_section.classList.add('section', 'maybe');
			
		deck_management_panel_container.appendChild(keep_container);
		keep_container.appendChild(keep_section);
		deck_management_panel_container.appendChild(sideboard_section);
		deck_management_panel_container.appendChild(maybe_section);
	}
	populateDeckPanel()
}

function populateDeckPanel() {
	var collection = Draft.state[`${userID}_cards`]
	var compacted_collection = compactCollection(collection)
	var sorted_collection = sortCollection(compacted_collection, key='name', reverse=false)
	keep_section.innerHTML = ""
	sideboard_section.innerHTML = ""
	maybe_section.innerHTML = ""
	for (var entry in sorted_collection){
		var card = sorted_collection[entry]
		addCardToPanel(card, array_id = card.index)
	}
}

function sortCollection(array, key='name', reverse=false){
	return [...array].sort((a,b)=>{
		if (a[key] < b[key]) return reverse ? 1 : -1
		if (a[key] > b[key]) return reverse ? -1 : 1
		return 0
	})
}

function compactCollection(array){
	var duplicates = {}
	array.forEach((card, index)=>{
		const key = JSON.stringify(card)
		if(!duplicates[key]) duplicates[key] = {'count': 0, 'index': index}
		duplicates[key]['count'] += 1
		console.log('key: ', duplicates[key])
	})
	
	console.log('duplicates: ', duplicates)
	
	var new_array = []
	for (var key in duplicates){
		var card = JSON.parse(key)
		var count = duplicates[key].count
		var index = duplicates[key].index
		card.quantity = count
		card.index = index
		new_array.push(card)
	}
	console.log('new_array: ', new_array)
	return new_array
}

function addCardToPanel(card, array_id){
	const panel_section_switch = {
		'keep' : [keep_section, 'S', 'M'],
		'sideboard' : [sideboard_section, 'K', 'M'],
		'maybe' : [maybe_section, 'K', 'S']
	}
	
	const button_property_switch = {
		'K': ['keep_button', 'keep'],
		'S': ['sideboard_button', 'sideboard'],
		'M': ['maybe_button', 'maybe']
	}
	
	var panel_section = panel_section_switch[card.section][0]
	var left_button_text = panel_section_switch[card.section][1]
	var right_button_text = panel_section_switch[card.section][2]
	
	var earth_thresh = card.metadata.earthThreshold
	var fire_thresh = card.metadata.fireThreshold
	var water_thresh = card.metadata.waterThreshold
	var air_thresh = card.metadata.airThreshold
	
	const card_div = document.createElement('div');			panel_section.appendChild(card_div)
	const card_quantity = document.createElement('div'); 	card_div.appendChild(card_quantity)
	const card_label = document.createElement('div'); 		card_div.appendChild(card_label)
	const element_symbol_grid = document.createElement('div'); 	card_div.appendChild(element_symbol_grid)
	element_symbol_grid.classList.add('element_symbol_grid')
	
	if (earth_thresh) drawEarth(element_symbol_grid)
	if (fire_thresh) drawFire(element_symbol_grid)
	if (water_thresh) drawWater(element_symbol_grid)
	if (air_thresh) drawAir(element_symbol_grid)
	
	const section_button_1 = document.createElement('div'); card_div.appendChild(section_button_1)
	const section_button_2 = document.createElement('div'); card_div.appendChild(section_button_2)
	card_div.classList.add('card_slot')
	
	card_quantity.classList.add('card_quantity')
	card_label.classList.add('card_label')
	section_button_1.classList.add(button_property_switch[left_button_text][0])
	section_button_1.onclick = ()=>{moveCard(array_id, button_property_switch[left_button_text][1])}
	section_button_1.classList.add('panel_button')
	section_button_2.classList.add(button_property_switch[right_button_text][0])
	section_button_2.onclick = ()=>{moveCard(array_id, button_property_switch[right_button_text][1])}
	section_button_2.classList.add('panel_button')
	
	card_quantity.innerHTML = card.quantity
	card_label.innerHTML = card.name
	var preview = card.src
	card_div.onmouseover=()=>document.getElementById('card_preview').src = `${preview}`
}

function moveCard(array_id, section){
	if(userID=='host'){
		Draft.state.host_cards[array_id].section = section
		populateDeckPanel()
		sendStateUpdate(conn)
	}
	if(userID=='guest'){
		sendDeckUpdate(conn, array_id, section)
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
		maybe_section.appendChild(slot);
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