function addDeckManagementPanel(){
	if (typeof (deck_management_panel_container) == 'undefined'){
		deck_management_panel_container = document.createElement('div')
		deck_management_panel_container.setAttribute('id', 'deck_management_panel_container')
		populateDeckPanel()
		document.body.appendChild(deck_management_panel_container)
		addDeckManagementToggleButtons()
	}
}

function populateDeckPanel() {
	const keepSection = document.createElement('div');
	keepSection.classList.add('section', 'keep');

	const sideboardSection = document.createElement('div');
	sideboardSection.classList.add('section', 'sideboard');

	const maybeSection = document.createElement('div');
	maybeSection.classList.add('section', 'maybe');

	// Add sample card slots (just for testing)
	for (let i = 0; i < 6; i++) {
		const slot = document.createElement('div');
		slot.classList.add('card-slot');
		slot.textContent = `Keep ${i + 1}`;
		keepSection.appendChild(slot);
	}

	for (let i = 0; i < 4; i++) {
		const slot = document.createElement('div');
		slot.classList.add('card-slot');
		slot.textContent = `Sideboard ${i + 1}`;
		sideboardSection.appendChild(slot);
	}

	for (let i = 0; i < 6; i++) {
		const slot = document.createElement('div');
		slot.classList.add('card-slot');
		slot.textContent = `Maybe ${i + 1}`;
		maybeSection.appendChild(slot);
	}

	deck_management_panel_container.appendChild(keepSection);
	deck_management_panel_container.appendChild(sideboardSection);
	deck_management_panel_container.appendChild(maybeSection);
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