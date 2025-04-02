function awaitClientScreen(state){
    base_url = 'freethought78.github.io/FT-Sorcery-Winchester-Draft/public/index.html'
    stage.innerHTML = ""
    if (localtest) url = `https://${state.IP}/index.html?session=${state.session}&localtest=true`
    else url = `https://${base_url}?session=${state.session}`
    stage.innerHTML += `<center><h1><br><br><br><br><br><a href = ${url}>send this link to your draft partner</h1></a>`
    console.log(state)
}
