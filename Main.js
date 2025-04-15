stage = document.getElementById('stage')
screen_width = window.innerWidth
screen_height = window.innerHeight

// URL encoding
function encode(str) {
    return encodeURIComponent(btoa(str));
}
function decode(str) {
    return atob(decodeURIComponent(str));
}

function getRandomElements(arr, numElements) {
  const result = [];
  const arrCopy = [...arr]; // Create a copy to avoid modifying the original array

  for (let i = 0; i < numElements; i++) {
    if (arrCopy.length === 0) {
      break; // Exit if the array is empty
    }
    const randomIndex = Math.floor(Math.random() * arrCopy.length);
    result.push(arrCopy.splice(randomIndex, 1)[0]);
  }
  return result;
}

async function loadSorceryFont() {
	const SorceryFont = new FontFace('SorceryFont', 'url(SorceryFont.ttf)');

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

//redraw stage on screen resize
window.addEventListener('resize', (event) => {
	buildStage(conn)
});

function buildStage(conn){
	if(Draft.state.phase){
		if(Draft.state.phase == "draft") showDraftScreen(conn)
		if(Draft.state.phase == "await_client") showAwaitGuestScreen()
		if(Draft.state.phase == "post_deck") showPostDeckScreen()
	} else showConfigurationScreen()
}