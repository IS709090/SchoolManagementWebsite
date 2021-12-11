const HTTTPMethods = {
    "put": "PUT",
    "post": "POST",
    "get": "GET",
    "delete": "DELETE"
}
const APIURL = window.location.protocol + '//' + window.location.host;
let TOKEN = getTokenValue('token');

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


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    console.log(d);
    console.log(expires);
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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

function login() {
    console.log('login...');
    let user = document.getElementById('floatingInput').value;
    let pass = document.getElementById('floatingPassword').value;
    let data = JSON.stringify({
        "correo": user,
        "password": pass
    });
    let url = APIURL + "/login";
    console.log(url);
    sendHTTPRequest(url, data, HTTTPMethods.post, (data) => {
        document.getElementById('responseLogIn').innerHTML = '<p class="text-success">Bienvenido a tu portal escolar!</p>'
    }, (error) => {
        console.log('error');
        document.getElementById('responseLogIn').innerHTML = '<p class="text-danger">' + error + '. Tus datos son incorrectos.</p>'
    })
}

function createUser() {

    let eles = document.getElementById('modalSignup').getElementsByTagName('input');
    let user = {};

    for (let i = 0; i < eles.length; i++) {
        if (eles[i].getAttribute('type') === 'text') {
            user[eles[i].getAttribute('name')] = eles[i].value;
        }
        if (eles[i].getAttribute('type') === 'email') {
            user[eles[i].getAttribute('name')] = eles[i].value;
        }
        if (eles[i].getAttribute('type') === 'password') {
            user['password'] = eles[i].value;
        }

        if (eles[i].getAttribute('type') === 'radio') {
            if (eles[i].checked)
                user[eles[i].getAttribute('name')] = eles[i].value;
        }
    }

    console.log(user);

    let url = APIURL + "/createUser";
    console.log(url);

    sendHTTPRequest(url, JSON.stringify(user), HTTTPMethods.post, (data) => {
        
        document.getElementById('responseSignUp').innerHTML = '<p class="text-success">Se creo una cuenta con éxito! Inicia sesión con el siguiente botón.</p>' +
            '<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalLogin">Log In</button>';
    }, (error) => {
        document.getElementById('responseSignUp').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
    }, TOKEN)

}


function eventsHandlers() {
    /* let addUserBtn = document.getElementById('addUserBtn');
    addUserBtn.addEventListener('click', createUser); */

    let signUpForm = document.getElementById('modalSignup');

    signUpForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('signup!');
        createUser(e.target);
    };

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