function awaitClientScreen(state){
    base_url = 'freethought78.github.io/FT-Sorcery-Winchester-Draft/public/index.html'
    stage.innerHTML = ""
    stage.innerHTML += `<center><h1><br><br><br><br><br><a href = "http://${base_url}/?session=${state.session}">send this link to your draft partner</h1></a>`
    console.log(state)
}
