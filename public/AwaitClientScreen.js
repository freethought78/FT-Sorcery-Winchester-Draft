function awaitClientScreen(state){
    stage.innerHTML = ""
    stage.innerHTML += `<center><br><br><br><br><br><a href = "http://${state.IP}/?id=${state.clientID}">send this link to your draft partner</a>`
}
