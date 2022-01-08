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
        <input class="form-check-input" type="checkbox" value="${alumno.idUsuario}" name="alumno" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
        ${alumno.nombre} ${alumno.apellidos}
        </label>
    </div>
</div>`
}

const grupoAlumnoToHTML = (grupo) => {
    return `
    <div class="col-md-4 col-xs-12 my-2 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <img src="/images/grupos.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${grupo.nombre}</h5>
                        <p class="card-text">Descripción de la materia:<br>${grupo.descripcion}</p>
                        
                    </div>
                </div>
    </div>
    `
}

const grupoToHTML = (grupo) => {
    return `<div class="col-md-6 col-xs-12 my-2 d-flex justify-content-center">

        <div class="card d-none d-sm-block" style="width: 90%;">
            <div class="card-body">
                <h5 class="card-title">${grupo.nombre}</h5>
                <p class="card-text">${grupo.descripcion}</p>
                <a href="#" type="button" class="btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#editar${grupo.idGrupo}">Editar Grupo</a>
                <a href="#" type="button" class="btn btn-danger" data-bs-toggle="modal"
                    data-bs-target="#eliminar${grupo.idGrupo}">Eliminar Grupo</a>
            </div>
        </div>
        
        <div class="card d-block d-sm-none" style="width: 90%;">
            <div class="card-body">
                <h5 class="card-title">${grupo.nombre}</h5>
                <p class="card-text">${grupo.descripcion}</p>
                <a href="#" type="button" class="btn btn-primary" data-bs-toggle="modal"
                data-bs-target="#editar${grupo.idGrupo}">Editar Grupo</a>
                <a href="#" type="button" class="btn btn-danger" data-bs-toggle="modal"
                data-bs-target="#eliminar${grupo.idGrupo}">Eliminar Grupo</a>
            </div>
        </div>
    
    </div>
    
    
    <div class="modal fade" id="editar${grupo.idGrupo}" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content rounded-5 shadow">
                    <div class="modal-header p-5 pb-4 border-bottom-0">
                        <!-- <h5 class="modal-title">Modal title</h5> -->
                        <h2 class="fw-bold mb-0">Editar ${grupo.nombre}</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body p-5 pt-0">
                        <form class="" action="/editGroup" method="POST">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control rounded-4" name="nombre" id="floatingNombre"
                                    placeholder="Ivan" required>
                                <label for="floatingInput">Nombre</label>
                            </div>

                            <div class="form-floating mb-3">
                                <input type="text" class="form-control rounded-4" name="descripcion"
                                    id="floatingDescripcion" placeholder="Canavati López" required>
                                <label for="floatingInput">Descripción</label>
                            </div>

                            <div class="form-check mb-3 visually-hidden">
                                <input class="form-check-input" type="radio" name="idGrupo" id="floatingEstudiante"
                                    value="${grupo.idGrupo}" checked>
                                <label class="form-check-label" for="floatingEstudiante">
                                    idGrupo
                                </label>
                            </div>


                            <div class="mb-3" id="responseSignUp">

                            </div>


                            <button class="w-100 mb-2 btn btn-lg rounded-4 btn-primary" id="editGroupBtn">Editar
                                Grupo</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="modal fade" id="eliminar${grupo.idGrupo}" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content rounded-5 shadow">
                    <div class="modal-header p-5 pb-4 border-bottom-0">
                        <!-- <h5 class="modal-title">Modal title</h5> -->
                        <h2 class="fw-bold mb-0">Eliminar ${grupo.nombre}</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body p-5 pt-0">
                        <form class="" action="/deleteGroup" method="POST">

                            <p>¿Estás seguro de querer <b>eliminar</b> este grupo? <b>(${grupo.nombre})</b></p>

                            <div class="form-check mb-3 visually-hidden">
                                <input class="form-check-input" type="radio" name="idGrupo" id="floatingEstudiante"
                                    value="${grupo.idGrupo}" checked>
                                <label class="form-check-label" for="floatingEstudiante">
                                    idGrupo
                                </label>
                            </div>

                            <div class="mb-3" id="responseSignUp">

                            </div>


                            <button class="w-100 mb-2 btn btn-lg rounded-4 btn-danger" id="deleteGroupBtn">Eliminar
                                Grupo</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>`
}

const profesorToHTML = (profesor) => {
    return `<div class="form-check mb-3">
    <input class="form-check-input" type="radio" name="profesor" id="floatingEstudiante"
        value="${profesor.idUsuario}" checked>
    <label class="form-check-label" for="floatingEstudiante">
        Profesor
    </label>
</div>`
}

function newGroup() {

    let eles = document.getElementById('modalCrearGrupo').getElementsByTagName('input');
    let group = {};
    let alumnosGrupo = [];
    let alumnosCounter = 0;
    let finalGroupArray = [];

    for (let i = 0; i < eles.length; i++) {
        if (eles[i].getAttribute('type') === 'text') {
            group[eles[i].getAttribute('name')] = eles[i].value;
        }
        if (eles[i].getAttribute('type') === 'email') {
            group[eles[i].getAttribute('name')] = eles[i].value;
        }
        if (eles[i].getAttribute('type') === 'radio') {
            group[eles[i].getAttribute('name')] = eles[i].value;
        }
        if (eles[i].getAttribute('type') === 'checkbox') {
            if (eles[i].checked) {
                alumnosGrupo[alumnosCounter] = eles[i].value;
                alumnosCounter++;
            }
        }

    }

    finalGroupArray[0] = group;
    finalGroupArray[1] = alumnosGrupo;

    let url = APIURL + "/createGroup";

    sendHTTPRequest(url, JSON.stringify(finalGroupArray), HTTTPMethods.post, (data) => {

        document.getElementById('responseSignUp').innerHTML = `<p class="text-success">Se creo un Grupo con éxito!</p>`;
        document.getElementById('responseGrupo').innerHTML = `<p class="text-success">Se creo un Grupo con éxito! Asegurate de actualizar la página para ver tus cambios reflejados</p>`;
        setTimeout(() => {
            window.location.href = "/grupos";
        }, 1700);

    }, (error) => {

        document.getElementById('responseSignUp').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
    }, TOKEN)

    /* window.location.href = "/grupos"; */

}


function displayInfo() {

    let url = APIURL + "/getUser";

    let url2 = APIURL + "/getAlumnos";
    let url3 = APIURL + "/getGruposProfesor";
    let url4 = APIURL + "/getGroupsAlumno";
    let url5 = APIURL + "/getGroup";

    sendHTTPRequest(url, null, HTTTPMethods.get, (data) => {


        let info = JSON.parse(data.data);

        /* LOGICA PARA DISPLAY INFO DASHBOARD ESTUDIANTE */

        if (info.rolUsuario == 1) {
            document.getElementById('gruposBienvenida').innerHTML = `<h5 class="my-1 py-1">Usted está inscrito en los siguientes grupos de trabajo. En caso de que
            no visualice algún grupo, favor de notificar al profesor.</h5>`;

            sendHTTPRequest(url4, null, HTTTPMethods.get, (data) => {

                let gruposAlumno = JSON.parse(data.data);
                console.log("GRUPOS ALUMNO");
                console.log(gruposAlumno);

                gruposAlumno.forEach(grupo => {

                    var number = {
                        value: grupo.grupo
                    };
                    console.log(number);

                    sendHTTPRequest(url5, JSON.stringify(number), HTTTPMethods.post, (data) => {

                        let stringGruposAlumnoHTML = "";
                        let grupo = JSON.parse(data.data);
                        console.log("GRUPO ALUMNO");
                        console.log(grupo);

                        stringGruposAlumnoHTML += grupoAlumnoToHTML(grupo[0]);

                        document.getElementById('gruposMostrar').innerHTML += stringGruposAlumnoHTML;

                    }, (error) => {
                        document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
                    }, TOKEN)

                });

            }, (error) => {
                document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
            }, TOKEN)

        } else {

            let stringProfesorHTML = profesorToHTML(info);


            /* LOGICA PARA DISPLAY INFO GRUPOS PROFESOR */

            sendHTTPRequest(url3, null, HTTTPMethods.get, (data) => {

                let stringGruposProfesorHTML = "";
                let gruposProfesor = JSON.parse(data.data);
                console.log("GRUPOS PROFESOR");
                console.log(gruposProfesor);


                gruposProfesor.forEach(grupo => {
                    stringGruposProfesorHTML += grupoToHTML(grupo);
                });

                document.getElementById('gruposMostrar').innerHTML = stringGruposProfesorHTML;

            }, (error) => {
                document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
            }, TOKEN)

            document.getElementById('gruposBienvenida').innerHTML = `<h5 class="my-1 py-1">Aquí podrá crear nuevos grupos y administrarlos.</h5>`;
            document.getElementById('profesorNuevoGrupo').innerHTML = stringProfesorHTML;
            document.getElementById('gruposCrear').innerHTML = `<div class="col-md-12 col-xs-12 my-2 d-flex justify-content-center">

            <div class="card d-none d-sm-block" style="width: 50%;">
                <div class="card-body">
                    <h5 class="card-title">Crear Nuevo Grupo</h5>
                    <p class="card-text">Asegurate de agregar a todos los alumnos que planeas inscribir al grupo y
                        de llenar todos los campos necesarios.</p>
                    <a href="#" type="button" class="btn btn-success" data-bs-toggle="modal"
                        data-bs-target="#modalCrearGrupo">Crear Grupo</a>
                </div>
            </div>

            <div class="card d-block d-sm-none" style="width: 90%;">
                <div class="card-body">
                    <h5 class="card-title">Crear Nuevo Grupo</h5>
                    <p class="card-text">Asegurate de agregar a todos los alumnos que planeas inscribir al grupo y
                        de llenar todos los campos necesarios.</p>
                    <a href="#" type="button" class="btn btn-success" data-bs-toggle="modal"
                        data-bs-target="#modalCrearGrupo">Crear Grupo</a>
                </div>
            </div>

            </div>`;

        }

    }, (error) => {
        document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
    }, TOKEN)

    /* OBTENER TODOS LOS ALUMNOS */

    sendHTTPRequest(url2, null, HTTTPMethods.get, (data) => {

        let alumnos = JSON.parse(data.data);
        let stringAlumnosHTML = "";


        alumnos.forEach(alumno => {
            stringAlumnosHTML += userToHTML(alumno);
        });

        document.getElementById('alumnosNuevoGrupo').innerHTML = stringAlumnosHTML;

    }, (error) => {
        document.getElementById('dashboardBienvenida').innerHTML = '<p class="text-danger">' + error + '. Ya existe un usuario con ese correo.</p>';
    }, TOKEN)

}



function eventsHandlers() {

    let newGroupForm = document.getElementById('modalCrearGrupo');

    newGroupForm.onsubmit = (e) => {
        e.preventDefault();
        console.log('New Group!');
        newGroup(e.target);

    };
    displayInfo();

}


document.addEventListener('DOMContentLoaded', () => {
    eventsHandlers();
});