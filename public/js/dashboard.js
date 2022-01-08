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

const entregaToHTML = (entrega) => {
    return `
    
    <div class="col-md-8 col-xs-12 my-2 d-flex justify-content-center">

                <div class="card" style="width: 100%;">
                    <div class="card-body">
                        <div class="row my-2">

                            <div class="col-md-4 col-xs-12 my-2">
                                <h5 class="card-title fw-bold mb-3">${entrega.nombre}</h5>
                            </div>

                            <div class="col-md-4 col-xs-12 my-2">
                                <p class="card-text">Alumno (ID): ${entrega.idUsuario}</p>
                                <p class="card-text">Fecha de entrega: ${entrega.fechaEntrega}</p>
                                <p class="card-text">Fecha de revisión: ${entrega.fechaRevision ? entrega.fechaRevision : 'No se ha revisado la entrega por el revisor.'}</p>
                                <p class="card-text">Revisor (ID): ${entrega.revisor ? entrega.revisor : 'No se ha asignado ningún revisor.'}</p>
                            </div>

                            <div class="col-md-4 col-xs-12 my-2">
                                <p class="card-text">Pts: ${entrega.calificacion ? entrega.calificacion : 'No se ha calificado esta entrega por el revisor asignado.'}</p>
                                <p class="card-text">Comentarios: ${entrega.comentarios ? entrega.comentarios : 'No se ha asignado ningún comentario a la entrega por el revisor.'}</p>

                                
                            </div>

                        </div>

                    </div>
                </div>

    </div>
    `
}

const entregaAlumnoToHTML = (entrega) => {
    return `
    
    <div class="col-md-8 col-xs-12 my-2 d-flex justify-content-center">

                <div class="card" style="width: 100%;">
                    <div class="card-body">
                        <div class="row my-2">

                            <div class="col-md-4 col-xs-12 my-2">
                                <h5 class="card-title fw-bold mb-3">${entrega.nombre}</h5>
                            </div>

                            <div class="col-md-4 col-xs-12 my-2">
                               
                                <p class="card-text">Fecha de entrega: ${entrega.fechaEntrega}</p>
                                <p class="card-text">Fecha de revisión: ${entrega.fechaRevision ? entrega.fechaRevision : 'No se ha revisado la entrega por el revisor.'}</p>
                                <p class="card-text">Revisor: ${entrega.revisor ? entrega.revisor : 'No se ha asignado ningún revisor.'}</p>
                            </div>

                            <div class="col-md-4 col-xs-12 my-2">
                                <p class="card-text">Pts: ${entrega.calificacion ? entrega.calificacion : 'No se ha calificado esta entrega por el revisor asignado.'}</p>
                                <p class="card-text">Comentarios: ${entrega.comentarios ? entrega.comentarios : 'No se ha asignado ningún comentario a la entrega por el revisor.'}</p>
                            </div>

                        </div>

                    </div>
                </div>

    </div>
    `
}

function displayInfo() {

    let url = APIURL + "/getUser";
    let url2 = APIURL + "/getEntregasAlumno";
    let url3 = APIURL + "/getEntregasProfesor";

    sendHTTPRequest(url, null, HTTTPMethods.get, (data) => {


        let info = JSON.parse(data.data);

        /* LOGICA PARA DISPLAY INFO DASHBOARD ESTUDIANTE */

        if (info.rolUsuario == 1) {
            document.getElementById('dashboardBienvenida').innerHTML = `<h1 class="display-4 my-2 py-2">Bienvenido ${info.nombre} ${info.apellidos}!</h1>`;
            document.getElementById('dashboardEstado').innerHTML = `<h5 class="my-1 py-1">Estado de las Entregas</h5>`;


            /* LOGICA PARA DISPLAY INFO ENTREGAS ALUMNO */

            sendHTTPRequest(url2, null, HTTTPMethods.get, (data) => {

                let stringEntregasAlumnoHTML = "";
                let entregasAlumno = JSON.parse(data.data);
                console.log("ENTREGAS")
                console.log(entregasAlumno)

                entregasAlumno.forEach(entrega => {

                    stringEntregasAlumnoHTML += entregaAlumnoToHTML(entrega);

                    stringEntregasAlumnoHTML += `<hr class="my-4">`;

                });

                document.getElementById('dashboardContenido').innerHTML = stringEntregasAlumnoHTML;

            }, (error) => {
                document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
            }, TOKEN)

            /* LOGICA PARA DISPLAY INFO ENTREGAS ALUMNO */

        } else {

            /* LOGICA PARA DISPLAY INFO DASHBOARD PROFESOR */

            document.getElementById('dashboardBienvenida').innerHTML = `<h1 class="display-4 my-2 py-2">Bienvenido ${info.nombre} ${info.apellidos}!</h1>`;
            document.getElementById('dashboardEstado').innerHTML = `<h5 class="my-1 py-1">Estado de las Entregas</h5>`;

            /* LOGICA PARA DISPLAY INFO ENTREGAS PROFESOR */

            sendHTTPRequest(url3, null, HTTTPMethods.get, (data) => {

                let stringEntregasProfesorHTML = "";
                let entregasProfesor = JSON.parse(data.data);

                entregasProfesor.forEach(entrega => {

                    entrega.forEach(element => {

                        stringEntregasProfesorHTML += entregaToHTML(element);

                    });

                    stringEntregasProfesorHTML += `<hr class="my-4">`;

                });

                document.getElementById('dashboardContenido').innerHTML = stringEntregasProfesorHTML;

            }, (error) => {
                document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
            }, TOKEN)

            /* LOGICA PARA DISPLAY INFO ENTREGAS PROFESOR */

        }



    }, (error) => {
        document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
    }, TOKEN)

}

function eventsHandlers() {

    displayInfo();

}

document.addEventListener('DOMContentLoaded', () => {
    eventsHandlers();
});