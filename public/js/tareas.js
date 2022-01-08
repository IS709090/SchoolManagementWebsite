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

const grupoToHTML = (grupo) => {
    return `<option name="grupo" value="${grupo.idGrupo}">${grupo.nombre}</option>`
}

const tareaUsuarioToHTML = (tarea) => {
    return `
    <div class="col-md-6 col-xs-12 my-2 d-flex justify-content-center">

    <div class="card" style="width: 90%;">
        <div class="card-body">
            <div class="row my-2">
                <div class="col-md-6 col-xs-12 my-2">
                    <h5 class="card-title fw-bold mb-3">${tarea.nombre}</h5>
                    <h6 class="card-subtitle mb-2">Fecha de entrega: ${tarea.fechaLimite}</h6>

                    <p class="card-text">Fecha de revisión:</p>
                    <div id="revision${tarea.idTarea}">

                    </div>

                    <p class="card-text">Comentarios:</p>
                    <div id="comentarios${tarea.idTarea}">

                    </div>

                    

                </div>

                <div class="col-md-6 col-xs-12 my-2">

                    <p class="card-text">Puntos Máximos: ${tarea.puntosMaximos}</p>
                    <p class="card-text">Calificación:</p>
                    <div id="calificacion${tarea.idTarea}">

                    </div>
                    

                </div>
                <a href="#" type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#editar${tarea.idTarea}">Entregar Tarea</a>



            </div>
        </div>
    </div>

</div>
    `
}

const tareaToHTML = (tarea) => {
    return `<div class="col-md-6 col-xs-12 my-2 d-flex justify-content-center">

        <div class="card d-none d-sm-block" style="width: 90%;">
            <div class="card-body">
                <h5 class="card-title">${tarea.nombre}</h5>
                <p class="card-text">Fecha Creación: ${tarea.fechaCreacion}</p>
                <p class="card-text">Fecha Limite: ${tarea.fechaLimite}</p>
                <p class="card-text">Puntos Máximos: ${tarea.puntosMaximos}</p>
                <a href="#" type="button" class="btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#editar${tarea.idTarea}">Editar Tarea</a>
                <a href="#" type="button" class="btn btn-danger" data-bs-toggle="modal"
                    data-bs-target="#eliminar${tarea.idTarea}">Eliminar Tarea</a>
            </div>
        </div>
        
        <div class="card d-block d-sm-none" style="width: 90%;">
            <div class="card-body">
                <h5 class="card-title">${tarea.nombre}</h5>
                <p class="card-text">Fecha Creación: ${tarea.fechaCreacion}</p>
                <p class="card-text">Fecha Limite: ${tarea.fechaLimite}</p>
                <p class="card-text">Puntos Máximos: ${tarea.puntosMaximos}</p>
                <a href="#" type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#editar${tarea.idTarea}">Editar Tarea</a>
                <a href="#" type="button" class="btn btn-danger" data-bs-toggle="modal"
                data-bs-target="#eliminar${tarea.idTarea}">Eliminar Tarea</a>
            </div>
        </div>
    
    </div>
    
    
    <div class="modal fade" id="editar${tarea.idTarea}" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content rounded-5 shadow">
                    <div class="modal-header p-5 pb-4 border-bottom-0">
                        <!-- <h5 class="modal-title">Modal title</h5> -->
                        <h2 class="fw-bold mb-0">Editar ${tarea.nombre}</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body p-5 pt-0">
                        <form class="" action="/editTarea" method="POST">
                        <div class="form-floating mb-3">
                        <input type="text" class="form-control rounded-4" name="nombre" id="floatingNombre"
                            placeholder="Ivan" required>
                        <label for="floatingInput">Nombre</label>
                    </div>

                    <div class="form-floating mb-3">
                    <input type="date" class="form-control rounded-4" name="fechaLimite" id="floatingFecha"
                        placeholder="Canavati López" required>
                    <label for="floatingInput">Fecha Limite</label>
                </div>

                            <div class="form-check mb-3 visually-hidden">
                                <input class="form-check-input" type="radio" name="idTarea" id="floatingEstudiante"
                                    value="${tarea.idTarea}" checked>
                                <label class="form-check-label" for="floatingEstudiante">
                                    idTarea
                                </label>
                            </div>

                            <div class="form-floating mb-3">
                                <input type="number" class="form-control rounded-4" name="puntosMaximos"
                                    id="floatingPuntos" placeholder="Ivan" required>
                                <label for="floatingInput">Puntaje Máximo</label>
                            </div>


                            <div class="mb-3" id="responseSignUp">

                            </div>


                            <button class="w-100 mb-2 btn btn-lg rounded-4 btn-primary" id="editGroupBtn">Editar
                                Tarea</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal fade" id="eliminar${tarea.idTarea}" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content rounded-5 shadow">
                    <div class="modal-header p-5 pb-4 border-bottom-0">
                        <!-- <h5 class="modal-title">Modal title</h5> -->
                        <h2 class="fw-bold mb-0">Eliminar ${tarea.nombre}</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body p-5 pt-0">
                        <form class="" action="/deleteTarea" method="POST">

                            <p>¿Estás seguro de querer <b>eliminar</b> esta tarea? <b>(${tarea.nombre})</b></p>

                            <div class="form-check mb-3 visually-hidden">
                                <input class="form-check-input" type="radio" name="idTarea" id="floatingEstudiante"
                                    value="${tarea.idTarea}" checked>
                                <label class="form-check-label" for="floatingEstudiante">
                                    idTarea
                                </label>
                            </div>

                            <div class="mb-3" id="responseSignUp">

                            </div>


                            <button class="w-100 mb-2 btn btn-lg rounded-4 btn-danger" id="deleteGroupBtn">Eliminar
                                Tarea</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>`
}

function displayInfo() {

    let url = APIURL + "/getUser";

    let url2 = APIURL + "/getTareasProfesor";
    let url3 = APIURL + "/getGruposProfesor";
    let url4 = APIURL + "/getEntregasAlumno";
    let url5 = APIURL + "/getTarea";

    sendHTTPRequest(url, null, HTTTPMethods.get, (data) => {


        let info = JSON.parse(data.data);

        /* LOGICA PARA DISPLAY INFO DASHBOARD ESTUDIANTE */

        if (info.rolUsuario == 1) {
            document.getElementById('tareasBienvenida').innerHTML = `<h5 class="my-1 py-1">Aquí encontrarás todas las tareas activas a realizar.</h5>`;

            /* LOGICA PARA DISPLAY INFO ENTREGAS ALUMNO */

            sendHTTPRequest(url4, null, HTTTPMethods.get, (data) => {

                let entregasAlumno = JSON.parse(data.data);
                console.log("ENTREGAS")
                console.log(entregasAlumno)

                entregasAlumno.forEach(entrega => {

                    var number = {
                        value: entrega.idTarea
                    };
                    console.log(number);

                    sendHTTPRequest(url5, JSON.stringify(number), HTTTPMethods.post, (data) => {

                        let stringTareaAlumnoHTML = "";
                        let tarea = JSON.parse(data.data);
                        console.log("TAREA ALUMNO");
                        console.log(tarea);

                        stringTareaAlumnoHTML += tareaUsuarioToHTML(tarea[0]);

                        document.getElementById('tareasMostrar').innerHTML += stringTareaAlumnoHTML;

                        document.getElementById('comentarios' + entrega.idTarea).innerHTML = `<p class="card-text">${entrega.comentarios ? entrega.comentarios : 'No se ha asignado ningún comentario a la entrega por el revisor.'}</p><br>`;
                        document.getElementById('revision' + entrega.idTarea).innerHTML = `<p class="card-text">${entrega.fechaRevision ? entrega.fechaRevision : 'No se ha revisado la entrega por el revisor.'}</p><br>`;
                        document.getElementById('calificacion' + entrega.idTarea).innerHTML = `<p class="card-text">${entrega.calificacion ? entrega.calificacion : 'No se ha calificado la entrega por el revisor.'}</p>`;


                    }, (error) => {
                        document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
                    }, TOKEN)



                });



            }, (error) => {
                document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
            }, TOKEN)

            /* LOGICA PARA DISPLAY INFO ENTREGAS ALUMNO */

        } else {

            /* LOGICA PARA DISPLAY INFO GRUPOS PROFESOR */

            sendHTTPRequest(url3, null, HTTTPMethods.get, (data) => {

                let stringGruposProfesorHTML = "";
                let gruposProfesor = JSON.parse(data.data);
                console.log("GRUPOS PROFESOR");
                console.log(gruposProfesor);


                gruposProfesor.forEach(grupo => {
                    stringGruposProfesorHTML += grupoToHTML(grupo);
                });

                document.getElementById('mostrarGruposProfesor').innerHTML = stringGruposProfesorHTML;

            }, (error) => {
                document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
            }, TOKEN)

            /* LOGICA PARA DISPLAY INFO GRUPOS PROFESOR */


            /* LOGICA PARA DISPLAY INFO TAREAS PROFESOR */

            sendHTTPRequest(url2, null, HTTTPMethods.get, (data) => {

                let stringTareasProfesorHTML = "";
                let tareasProfesor = JSON.parse(data.data);


                tareasProfesor.forEach(tarea => {
                    stringTareasProfesorHTML += tareaToHTML(tarea);
                });

                document.getElementById('tareasMostrar').innerHTML = stringTareasProfesorHTML;

            }, (error) => {
                document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
            }, TOKEN)

            /* LOGICA PARA DISPLAY INFO TAREAS PROFESOR */


            document.getElementById('tareasBienvenida').innerHTML = `<h5 class="my-1 py-1">Aquí podrá crear nuevas tareas y administrarlas.</h5>`;
            document.getElementById('tareasCrear').innerHTML = `<div class="col-md-12 col-xs-12 my-2 d-flex justify-content-center">

            <div class="card d-none d-sm-block" style="width: 50%;">
                <div class="card-body">
                    <h5 class="card-title">Crear Nueva Tarea</h5>
                    <p class="card-text">Asegurate de seleccionar el grupo al que le dejarás la tarea y
                        de llenar todos los campos necesarios.</p>
                    <a href="#" type="button" class="btn btn-success" data-bs-toggle="modal"
                        data-bs-target="#modalCrearTarea">Crear Tarea</a>
                </div>
            </div>

            <div class="card d-block d-sm-none" style="width: 90%;">
                <div class="card-body">
                <h5 class="card-title">Crear Nueva Tarea</h5>
                <p class="card-text">Asegurate de seleccionar el grupo al que le dejarás la tarea y
                    de llenar todos los campos necesarios.</p>
                <a href="#" type="button" class="btn btn-success" data-bs-toggle="modal"
                    data-bs-target="#modalCrearTarea">Crear Tarea</a>
                </div>
            </div>

            </div>`;

        }

    }, (error) => {
        document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
    }, TOKEN)

    /* OBTENER TODOS LOS ALUMNOS */

}


function eventsHandlers() {

    displayInfo();

}


document.addEventListener('DOMContentLoaded', () => {
    eventsHandlers();
});