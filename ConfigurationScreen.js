function showConfigurationScreen(){
	var main_style = document.querySelector("#main_style")
	
	main_style.innerHTML += `
		#config_container{
			height: 100%;
			padding: 10vh;
		}
		
		.config_item {
			margin: 2vh;
			padding: 2vh 3vh;
			background-color: #000000AA;
			border-radius: 1vh;
			justify-self: center;
			font-size: 3vh;
			border: 4px solid #a11dad;
		}
		.config_title{
			font-size: 5vh;
			padding: 3vh 4vw;
		}		
		.config_option_title{
			font-size: 4vh;
		}
		.config_done_button{
			box-shadow: 3px 4px 3px 0px #2f0fab;
			background:linear-gradient(to bottom, #ff7aeb 5%, #923be3 100%);
			background-color:#ff7aeb;
			border-radius:4px;
			border:4px solid #a11dad;
			cursor:pointer;
			color:#f0f0f0;
			font-family:Trebuchet MS;
			font-size:28px;
			font-weight:bold;
			padding:12px 44px;
			text-decoration:none;
			text-shadow:1px 2px 7px #000000;
			justify-self: center;
		}
		.config_done_button:hover {
			background:linear-gradient(to bottom, #923be3 5%, #ff7aeb 100%);
			background-color:#923be3;
		}
		.config_done_button:active {
			position:relative;
			top:1px;
		}
		
		.config_text_input{
			background-color: #000000AA;
			border: 4px solid #a11dad;
			color: #a11dad;
			border-radius: 1vh;
		}
	`
	
	stage.innerHTML = ""
	stage.innerHTML += `
		<div id='config_container'>
		<div class='config_item config_title'>Draft Configuration Options</div>
		<div class='config_item'>
		<span class="config_option_title">Cube Source:</span><br>
		<input type="radio" id="random" name="card_source" value="random" style="padding-left: 50px">
		<label for="random">Random Cards</label>
		<div id="cube_size_container" hidden style="padding-left: 100px;">
			Cube Size: <input class='config_text_input' id='cube_size_input' value='120' style='font-size: 2vh'>
		</div><br>
		<input type="radio" id="names" name="card_source" value="names" style="padding-left: 50px">
		<label for="names">Card Names </label>
		<div id="cube_list_container" hidden style="padding-left: 50px;">
			1 Name Per Line, Quantities Allowed (example: 3 Ring of Morrigan) <br>
			<textarea class='config_text_input' id='card_names_input' rows = '10' cols = '50' style="font-size:2vh">40 Ring of Morrigan\n40 Blink</textarea>
		</div><br>
		<div id="incorrect_names_container" hidden style="padding-left: 50px; font-size: 2vh">The following card names are incorrect:
			<div id="incorrect_names" style="font-size: 1.9vh; color: red; padding-left: 100px"></div>
		</div>
		</div>
		<div class = 'config_done_button' id='finish_configuration_button'>Done</div>
		</div>
	`

	stage.innerHTML += ""

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