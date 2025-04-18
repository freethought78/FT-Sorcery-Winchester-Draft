// Create connection
var peer = new Peer();
var peerID

// Guest Handler
peer.on('open', function(id) {
	peer_ID = id
	//Guest entry point
    if (remote) {
		userID = 'guest'
        conn = peer.connect(decode(remote));
        conn.on('open', () => {
            console.log("Connected to Peer A!");
            conn.send("Hello from Peer B!");
        });

        conn.on('data', (data) => {
            console.log("Received from Peer A:", data);
			if(data.type == 'state') {
				Draft.state = data.state
				buildStage(conn)
			}
        });
	//Host Entry Point
    } else {
		userID = 'host'
		showConfigurationScreen()
    }
});

// Host Handler
peer.on('connection', function(c) {
    conn = c;
    console.log('Connected to Peer B!');

    conn.on('open', () => {
        console.log("Connection open!");
        conn.send("Hello from Peer A!");
		Draft.state.phase='draft'
		showDraftScreen(conn)
		if(Draft.state.started){
			sendStateUpdate(conn)
		}else{
			Draft.state.started = true
			nextPull(conn)
		}
    });

    conn.on('data', (data) => {
        console.log("Received from Peer B:", data);
		if(data.type == 'select_column') selectCards('guest', data.column, conn)
		if(data.type == 'deck') {
			var array_id = data.array_id
			var section = data.section
			Draft.state.guest_cards[array_id].section = section
			sendStateUpdate(conn)
		}
    });
});

function sendStateUpdate(conn){
	var update = {type: 'state', state: Draft.state}
	conn.send(update)
	buildStage(conn)
}

function sendDeckUpdate(conn, array_id, section){
	var update = {
		type: 'deck',
		array_id: array_id,
		section: section
	}
	conn.send(update)
}
