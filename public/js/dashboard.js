const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host;

function getTokenValue(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

let TOKEN = getTokenValue('access_token');
console.log(TOKEN);


function sendHTTPRequest(urlAPI, data, method, cbOK, cbError, authToken) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  PUT actualizar archivo
    xhr.open(method, urlAPI);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (authToken)
        xhr.setRequestHeader('x-auth-user', authToken);
    // 4. Enviar solicitud al servidor
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { // analizar el estatus de la respuesta HTTP 
            // Ocurrió un error
            cbError(xhr.status + ': ' + xhr.statusText);
        } else {
            console.log(xhr.responseText); // Significa que fue exitoso
            cbOK({
                status: xhr.status,
                data: xhr.responseText
            });
        }
    };
}

function displayInfo() {

    let url = APIURL + "/getUser";

    sendHTTPRequest(url, null, HTTTPMethods.get, (data) => {


        let info = JSON.parse(data.data);

        /* LOGICA PARA DISPLAY INFO DASHBOARD ESTUDIANTE */

        if (info.idUsuario == 1) {
            document.getElementById('dashboardBienvenida').innerHTML = `<h1 class="display-4 my-2 py-2">Bienvenido ${info.nombre} ${info.apellidos}!</h1>`;
        } else {

            /* LOGICA PARA DISPLAY INFO DASHBOARD PROFESOR */

            document.getElementById('dashboardBienvenida').innerHTML = `<h1 class="display-4 my-2 py-2">Bienvenido ${info.nombre} ${info.apellidos}!</h1>`;

        }



    }, (error) => {
        document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
    }, TOKEN)

}



function eventsHandlers() {
    /* let addUserBtn = document.getElementById('addUserBtn');
    addUserBtn.addEventListener('click', createUser); */

    /*  let signUpForm = document.getElementById('modalSignup');

     signUpForm.onsubmit = (e) => {
         e.preventDefault();
         console.log('signup!');
         createUser(e.target);
     }; */
    displayInfo();


    /* let logInForm = document.getElementById('modalLogin');

    logInForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('login!');
        login(e.target);
    }; */

    /* let loginForm = document.getElementById('modelId');
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('stopped!');
        createUser(e.target);
    }
    loginForm.addEventListener('change', (e) => {
        let disableBtn = false;
        let list = loginForm.querySelectorAll('input:invalid');
        if (list.length > 0) disableBtn = true;
        if (document.getElementById('password1').value !== document.getElementById('password2').value) disableBtn = true;
        document.getElementById('createUserBtn').disabled = disableBtn;
        console.log(`Status of createUserBtn:${disableBtn}`)
    }); */

}


document.addEventListener('DOMContentLoaded', () => {
    eventsHandlers();
});