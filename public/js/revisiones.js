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

const userToHTML = (alumno) => {
    return `<div class="col-6 my-1">
    <div class="form-check">
        <input class="form-check-input" type="radio" value="${alumno.alumno}" name="revisor" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
        ${alumno.alumno}
        </label>
    </div>
</div>`
}

const tareaToHTML = (tarea) => {
    return `
    <label for="customRange2" class="form-label">Calificación</label>
<input type="range" name="calificacion"  class="form-range" min="0" max="${tarea.puntosMaximos}" id="customRange2" oninput="this.nextElementSibling.value = this.value">
<output></output>
    `
}

const revisionToHTML = (entrega) => {
    return `<div class="col-md-6 col-xs-12 my-2 d-flex justify-content-center">

    <div class="card" style="width: 90%;">
        <div class="card-body">
            <h5 class="card-title mb-3">${entrega.nombre}</h5>
            <p class="card-text">Alumno (Se oculta el nombre para evitar calificaciones sesgadas):<br>${entrega.idUsuario}</p>
            
            <a href="#" type="button" class="btn btn-success" data-bs-toggle="modal"
                data-bs-target="#calificar${entrega.idEntrega}">Calificar</a>
            
        </div>
    </div>
    </div>
    

<div class="modal fade" id="calificar${entrega.idEntrega}" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content rounded-5 shadow">
            <div class="modal-header p-5 pb-4 border-bottom-0">
                <!-- <h5 class="modal-title">Modal title</h5> -->
                <h2 class="fw-bold mb-0">Calificar ${entrega.nombre} al Alumno ${entrega.idUsuario}</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body p-5 pt-0">
                <form class="" action="/editEntrega" method="POST">

                <div class="form-floating mb-3 visually-hidden">
                    <input type="date" class="form-control rounded-4" name="fechaRevision" id="floatingFecha${entrega.idEntrega}"
                        placeholder="Canavati López" required>
                    <label for="floatingInput">Fecha Revision</label>
                </div>

                    <div class="row my-3" id="califMax${entrega.idEntrega}">


                    </div>

                    <div class="form-floating mb-3">
                                <input type="text" class="form-control rounded-4" name="comentarios" id="floatingNombre"
                                    placeholder="Comentarios" required>
                                <label for="floatingInput">Comentarios</label>
                            </div>

                    <div class="form-check mb-3 visually-hidden">
                        <input class="form-check-input" type="radio" name="idEntrega" id="floatingEstudiante"
                            value="${entrega.idEntrega}" checked>
                        <label class="form-check-label" for="floatingEstudiante">
                            idEntrega
                        </label>
                    </div>

                    <div class="mb-3" id="responseSignUp">

                    </div>


                    <button class="w-100 mb-2 btn btn-lg rounded-4 btn-success"
                        id="editGroupBtn">Calificar</button>

                </form>
            </div>
        </div>
    </div>
</div>

    `
}

const entregaToHTML = (entrega) => {
    return `<div class="col-md-6 col-xs-12 my-2 d-flex justify-content-center">

    <div class="card d-none d-sm-block" style="width: 90%;">
        <div class="card-body">
            <h5 class="card-title">${entrega.nombre}</h5>
            <p class="card-text">Fecha Creación: ${entrega.fechaCreacion}</p>
            <p class="card-text">Fecha Entrega: ${entrega.fechaEntrega}</p>
            <p class="card-text">Alumno (ID): ${entrega.idUsuario}</p>
            <p class="card-text">Revisor (ID): ${entrega.revisor ? entrega.revisor : 'No se ha asignado ningún revisor.'}</p>
            <a href="#" type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#asignar${entrega.idEntrega}">Asignar Revisor</a>
            
        </div>
    </div>
    
    <div class="card d-block d-sm-none" style="width: 90%;">
        <div class="card-body">
            <h5 class="card-title">${entrega.nombre}</h5>
            <p class="card-text">Fecha Creación: ${entrega.fechaCreacion}</p>
            <p class="card-text">Fecha Entrega: ${entrega.fechaEntrega}</p>
            <p class="card-text">Alumno (ID): ${entrega.idUsuario}</p>
            <p class="card-text">Revisor (ID): ${entrega.revisor ? entrega.revisor : 'No se ha asignado ningún revisor.'}</p>
            <a href="#" type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#asignar${entrega.idEntrega}">Asignar Revisor</a>
            
        </div>
    </div>

</div>

<div class="modal fade" id="asignar${entrega.idEntrega}" tabindex="-1" aria-labelledby="exampleModalLabel"
aria-hidden="true">
<div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content rounded-5 shadow">
        <div class="modal-header p-5 pb-4 border-bottom-0">
            <!-- <h5 class="modal-title">Modal title</h5> -->
            <h2 class="fw-bold mb-0">Asignar Revisor al Alumno con ID ${entrega.idUsuario}</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body p-5 pt-0">
            <form class="" action="/editEntrega" method="POST">

            <h5 class="my-3">Alumno (ID) que será el revisor</h5>
                
            <div class="row my-3" id="alumnosGrupo${entrega.idEntrega}">


            </div>

            <div class="form-check mb-3 visually-hidden">
                                <input class="form-check-input" type="radio" name="idEntrega" id="floatingEstudiante"
                                    value="${entrega.idEntrega}" checked>
                                <label class="form-check-label" for="floatingEstudiante">
                                    idEntrega
                                </label>
                            </div>

                <div class="mb-3" id="responseSignUp">

                </div>


                <button class="w-100 mb-2 btn btn-lg rounded-4 btn-primary" id="editGroupBtn">Asignar Revisor</button>

            </form>
        </div>
    </div>
</div>
</div>

`
}

function displayInfo() {

    let url = APIURL + "/getUser";

    let url2 = APIURL + "/getAlumnosProfesor";
    let url3 = APIURL + "/getEntregasProfesor";
    let url4 = APIURL + "/getRevisionesAlumno";
    let url5 = APIURL + "/getTarea";

    sendHTTPRequest(url, null, HTTTPMethods.get, (data) => {

        let info = JSON.parse(data.data);

        /* LOGICA PARA DISPLAY INFO DASHBOARD ESTUDIANTE */

        if (info.rolUsuario == 1) {
            document.getElementById('revisionesBienvenida').innerHTML = `<h5 class="my-1 py-1">Aquí encontrarás todas las revisiones activas a realizar. No olvides
            dejar comentarios a las revisiones que realizes.</h5>`;


            /* LOGICA PARA DISPLAY INFO REVISION ALUMNO */

            var number = {
                value: info.idUsuario
            };

            sendHTTPRequest(url4, JSON.stringify(number), HTTTPMethods.post, (data) => {

                let revisionesAlumno = JSON.parse(data.data);
                var date = new Date();
                var currentDate = date.toISOString().slice(0, 10);

                revisionesAlumno.forEach(revision => {

                    console.log(revision);
                    document.getElementById('revisionesMostrar').innerHTML += revisionToHTML(revision);

                });

                revisionesAlumno.forEach(revision => {

                    document.getElementById('floatingFecha' + revision.idEntrega).defaultValue  = currentDate;

                    var number = {
                        value: revision.idTarea
                    };

                    sendHTTPRequest(url5, JSON.stringify(number), HTTTPMethods.post, (data) => {

                        let tarea = JSON.parse(data.data);
                        
                        document.getElementById('califMax' + revision.idEntrega).innerHTML = tareaToHTML(tarea[0]);


                    }, (error) => {
                        document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
                    }, TOKEN)

                });

            }, (error) => {
                document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
            }, TOKEN)

            /* LOGICA PARA DISPLAY INFO REVISION ALUMNO */

        } else {

            /* LOGICA PARA DISPLAY INFO ENTREGAS PROFESOR */

            sendHTTPRequest(url3, null, HTTTPMethods.get, (data) => {

                let stringEntregasProfesorHTML = "";
                let entregasProfesor = JSON.parse(data.data);

                entregasProfesor.forEach(entrega => {

                    stringEntregasProfesorHTML += `<hr class="my-4">`;

                    entrega.forEach(element => {

                        stringEntregasProfesorHTML += entregaToHTML(element);

                        /* OBTENER TODOS LOS ALUMNOS */

                        var number = {
                            value: element.idGrupo
                        };

                        sendHTTPRequest(url2, JSON.stringify(number), HTTTPMethods.post, (data) => {

                            let alumnos = JSON.parse(data.data);
                            let stringAlumnosHTML = "";

                            alumnos.forEach(alumno => {
                                stringAlumnosHTML += userToHTML(alumno);
                            });

                            document.getElementById('alumnosGrupo' + element.idEntrega).innerHTML = stringAlumnosHTML;

                        }, (error) => {
                            document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
                        }, TOKEN)

                        /* OBTENER TODOS LOS ALUMNOS */

                    });

                });

                document.getElementById('revisionesCrear').innerHTML = stringEntregasProfesorHTML;

            }, (error) => {
                document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
            }, TOKEN)

            /* LOGICA PARA DISPLAY INFO ENTREGAS PROFESOR */

            document.getElementById('revisionesBienvenida').innerHTML = `<h5 class="my-1 py-1">Aquí podrá asignar revisiones.</h5>`;

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