function awaitClientScreen(state){
    stage.innerHTML = ""
    stage.innerHTML += `<center><h1><br><br><br><br><br><a href = "http://${state.IP}/?session=${state.session}&id=${state.clientID}">send this link to your draft partner</h1></a>`
    console.log(state)
}
