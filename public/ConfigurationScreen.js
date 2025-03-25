    function configurationScreen(state){
        stage.innerHTML = ""
        stage.innerHTML += "<h1> Configuration placeholder</h1>"
        stage.innerHTML += "<h2>Cube Size: <input id='cube_size_input' value='120'></input>"
        stage.innerHTML += "<button id='finish_configuration_button'>Done</button>"

        finish_configuration_button = document.getElementById("finish_configuration_button")
        cube_size_input = document.getElementById("cube_size_input")

        finish_configuration_button.onclick = ()=>{
            message = {}
            message.config_data = {
                cube_size: cube_size_input.value,
                user: userID
            }

            message = JSON.stringify(message)
            socket.send(message)
        }
    }