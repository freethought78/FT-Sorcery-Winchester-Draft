function showDraftScreen(conn){
	screen_width = window.innerWidth
	screen_height = window.innerHeight
	
    stage.innerHTML = ""
	state = Draft.state

    //card properties
    number_of_columns = state.draft_columns.length
    card_width = screen_width / 10
    card_margin = card_width / 4

    //card preview div
    stage.innerHTML += `<img 
		width=${card_width * 2}px 
		id="card_preview" 
		style="
			float:right; 
			margin: ${card_margin * 2}px; 
			box-shadow: 30px 30px 30px rgba(0, 0, 0, 0.9);
		">`

    //draft status message div
    stage.innerHTML += `<div id="status_message" width=100% style="font-size: 50px; margin: 30px; position: absolute; bottom: 0px"></div>`

    //use information from draft state received from server and place all card images into their correct columns, laid out on the stage
    for (var col_num = 0; col_num < number_of_columns; col_num++){
        var col = state.draft_columns[col_num]
        col_id = "draft_column" + col_num
        stage.innerHTML += `<div class="draft_column" id="${col_id}"></div>`

        //add cards to column
        var col_div = document.getElementById(col_id)
        for(var card_num = 0; card_num < state.draft_columns[col_num].length; card_num++){
            //attempt to sanitize the card name for conversion to image filename
            name = col[card_num].name
            console.log(col)
            //construct the image url
            link = col[card_num].src
            //add the card image
            col_div.innerHTML += `<img
                    src="${link}"
                    width=${card_width}px
                    style="margin: ${card_margin}px; top: ${card_num*card_margin}px; position:absolute; box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.9);"
                    onmouseover="document.getElementById('card_preview').src = '${link}'"
                    onclick="select_column(${col_num}, '${state.turn}')"
                >`
        }
    }

    //update status message
    status_message_div = document.getElementById('status_message')
    if (state.turn == userID){
        status_message_div.innerHTML = "Select a column to draft."
    } else {
        status_message_div.innerHTML = "Your opponent is making a selection."
    }

	//add the deck management panel
	addDeckManagementPanel()
	repositionToggleButtons()

    //add css
    stage.innerHTML+= `
        <style>
            .draft_column{
                width: 15%;
                height: 100%;
                display: inline-block;
            }
        </style>
    `
}

//click event for columns
function select_column(col_num, turn){
    console.log(`Column ${col_num} selected`)
	console.log(turn)
    if(turn == userID){
		if (userID == 'guest'){
			var message = {
				type: "select_column",
				column: col_num
			}
			conn.send(message)
		}
		if (userID == 'host'){
			selectCards(userID, col_num, conn)
		}
    }
}

function selectCards(user, column, conn){
	for (var cardid in Draft.state.draft_columns[column]){
		var card = Draft.state.draft_columns[column][cardid]
		card.owner = user
		card.section = 'keep'
		Draft.state[`${user}_cards`].push(card)
	}
	Draft.state.draft_columns[column] = []
	nextPull(conn)
}