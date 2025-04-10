function showConfigurationScreen(){
	stage.innerHTML = ""
	stage.innerHTML += `<h1> Draft Configuration Options</h1>
	<h2>Cube Source:</h2>
	<h3>
	<input type="radio" id="random" name="card_source" value="random" style="padding-left: 50px">
	<label for="random">Random Cards</label>
	<div id="cube_size_container" hidden style="padding-left: 100px;">
		Cube Size: <input id='cube_size_input' value='120' style='font-size: 2vh'>
	</div><br>
	<input type="radio" id="names" name="card_source" value="names" style="padding-left: 50px">
	<label for="names">Card Names </label>
	<div id="cube_list_container" hidden style="padding-left: 50px;">
		1 Name Per Line, Quantities Allowed (example: 3 Ring of Morrigan) <br>
		<textarea id='card_names_input' rows = '10' cols = '50' style="font-size:2vh">40 Ring of Morrigan\n40 Blink</textarea>
	</div><br>
	<div id="incorrect_names_container" hidden style="padding-left: 50px; font-size: 2vh">The following card names are incorrect:
		<div id="incorrect_names" style="font-size: 1.9vh; color: red; padding-left: 100px"></div>
	</div>
	</h3>
	`
	stage.innerHTML += "<br><button id='finish_configuration_button' style='font-size: 2vh'>Done</button>"

	const finish_configuration_button = document.querySelector("#finish_configuration_button")
	const cube_size_input = document.querySelector("#cube_size_input")
	const cube_size_container = document.querySelector("#cube_size_container")
	const cube_list_container = document.querySelector("#cube_list_container")
	const random_radio_button = document.querySelector("#random")
	const names_radio_button = document.querySelector("#names")
	const card_names_input = document.querySelector("#card_names_input")
	const incorrect_names_container = document.querySelector("#incorrect_names_container")
	const incorrect_names = document.querySelector("#incorrect_names")

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
			if(!validateList(formatted_list)){
				incorrect_names_container.removeAttribute('hidden')
				return
			}else{
				configuration.card_list = createDuplicates(formatted_list)
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
	incorrect_names.innerHTML = ""
	incorrect_names_container.setAttribute('hidden', 'hidden')
	//check if each name in the list is valid
	list.forEach((entry, index)=>{
		//if a name is not found in the master card list, mark the invalid entry, and mark the list invalid
		var match = master_card_list.find(card => card.name == entry[1])
		if (match == null) {
			invalid = true
			incorrect_names.innerHTML += entry[1]
			if(index < list.length - 1) incorrect_names.innerHTML += '<br>'
		}
	})
	
	// if the list is valid, let the calling function know that
	return !invalid
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