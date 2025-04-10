function showConfigurationScreen(){
	stage.innerHTML = ""
	stage.innerHTML += `<h1> Draft Configuration Options</h1>
	<h2>Cube Source:</h2>
	<h3>
	<input type="radio" id="random" name="card_source" value="random">
	<label for="random">Random Cards</label>
	<div id="cube_size_container" hidden style="padding-left: 100px;">
		Cube Size: <input id='cube_size_input' value='120' style='font-size: 2vh'>
	</div><br>
	<input type="radio" id="names" name="card_source" value="names">
	<label for="names">Card Names </label>
	<div id="cube_list_container" hidden style="padding-left: 100px;">
		1 Name Per Line, Quantities Allowed (example: 3 Ring of Morrigan) <br>
		<textarea id='card_names_input' rows = '10' cols = '50' style="font-size:2vh">40 Ring of Morrigan\n40 Blink</textarea>
	</div><br>
	</h3>
	`
	stage.innerHTML += "<br><br><br><button id='finish_configuration_button' style='font-size: 2vh'>Done</button>"

	const finish_configuration_button = document.querySelector("#finish_configuration_button")
	const cube_size_input = document.querySelector("#cube_size_input")
	const cube_size_container = document.querySelector("#cube_size_container")
	const cube_list_container = document.querySelector("#cube_list_container")
	const random_radio_button = document.querySelector("#random")
	const names_radio_button = document.querySelector("#names")
	const card_names_input = document.querySelector("#card_names_input")

	finish_configuration_button.onclick = ()=>{
		var configuration = {}
		var cube_source = document.querySelector('input[name="card_source"]:checked')
		if (cube_source == null) cube_source = "random"
		else cube_source = cube_source.getAttribute('id')
		if (cube_source == "random")configuration.cube_size = cube_size_input.value
		if (cube_source == "names"){
			console.log('names selected')
			var formatted_list = formatCardList(card_names_input.value)
			console.log('formatted', formatted_list)
			var validated_list = validateList(formatted_list)
			console.log('validated', validated_list)
			if(validated_list == true) {
				configuration.card_list = createDuplicates(formatted_list)
			} else {
				card_names_input.innerHTML = validatedList
				return
			}
		}
		configuration.cube_source = cube_source
		createDraftObject(configuration)
		showAwaitGuestScreen()
	}
	
	random_radio_button.onclick = ()=>{
		cube_list_container.setAttribute('hidden', 'hidden')
		cube_size_container.removeAttribute('hidden')
	}
	names_radio_button.onclick=()=>{
		cube_size_container.setAttribute('hidden', 'hidden')
		cube_list_container.removeAttribute('hidden')
	}
	
}
	
function formatCardList(list){
	var formatted = list.split('\n')
	var newlist = []
	formatted.forEach((entry)=>{
		console.log('the entry: ', entry)
		//split card count from its title
		entry = entry.split(" ")
		try {entry[0] = BigInt(entry[0])}
		catch {entry = [1, ...entry]}
		console.log('split entry', entry)
		var name = entry.slice(1, entry.length).join(" ")
		entry = [entry[0], name]
		newlist.push(entry)
	})
	return newlist
}

function validateList(list){
	//assume list is valid until proven otherwise
	var invalid = false;
	
	//check if each name in the list is valid
	list.forEach((entry)=>{
		//if a name is not found in the master card list, mark the invalid entry, and mark the list invalid
		var match = master_card_list.find(card => card.name == entry[1])
		if (match == null) {
			entry[1] += '  <--- Not Found'
			invalid = true
		}
	})
	
	// if the list is valid, let the calling function know that
	if(invalid == false) return true
	
	// if the list was invalid, reconstruct the textarea contents from the list including marked entries and return that instead
	else{
		list.forEach(entry, ()=>{
			listText = list[entry][0] + ' ' + list[entry][1] + '/n'
		})
		return list
	}
}

function createDuplicates(list){
	var new_list = []
	list.forEach((entry)=>{
		var match = master_card_list.find(card => card.name == entry[1])
		for(var count = 0; count < entry[0]; count++){
			new_list.push(JSON.parse(JSON.stringify(match)))
		}
	})
	return new_list
}