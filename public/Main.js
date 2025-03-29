stage = document.getElementById('stage')
screen_width = window.innerWidth
screen_height = window.innerHeight

async function loadSorceryFont() {
	const SorceryFont = new FontFace('SorceryFont', 'url(http://173.168.139.242/SorceryFont.ttf)');

	try {
		await SorceryFont.load();
		document.fonts.add(SorceryFont);
		// Use the font
		document.body.style.fontFamily = 'SorceryFont';
	} catch (error) {
		console.error('Error loading font:', error);
	}
}

loadSorceryFont();

var inactive_tab_interval

//if the user is on another page, they might miss a state update, reload the page on page focus to stay up to date
window.addEventListener('focus', (event) => {
	clearInterval(inactive_tab_interval)
});

window.addEventListener('blur', (event) => {
	inactive_tab_interval = setInterval(()=>{
		requestStateUpdate()
	}, 1000)
});

//reload page on resize
window.addEventListener('resize', (event) => {
	window.location.reload();
});

function buildStage(state){
	if(state.phase == "configuration") configurationScreen(state)
	if(state.phase == "draft") draftScreen(state)
	if(state.phase == "await_client") awaitClientScreen(state)
}