const knex = require("./knex");

/* 1ST CRUD USERS */

function createUser(user) {
    return knex("usuario").insert(user);
}

function deleteUser(id) {
    return knex("usuario").where("id", id).del();
}

function updateUser(id, user) {
    return knex("usuario").where({
        idUsuario: id
    }).update(user);
}

function getAllUsers() {
    return knex("usuario").select("nombre, apellidoPaterno, apellidoMaterno, rolUsuario");
}

function getUniqueUser(email, password) {
    return knex("usuario").where({
        correo: email,
        password: password
    }).column('idUsuario', 'nombre', 'apellidos', 'correo', 'password', 'rolUsuario');
}

function getUniqueUserByEmail(email) {
    return knex("usuario").where({
        correo: email
    }).column('idUsuario', 'nombre', 'apellidos', 'correo', 'password', 'rolUsuario');
}

/* 1ST CRUD USERS */


/* 2ND CRUD ALUMNOS */

function getAllAlumnos() {
    return knex("usuario").where({
        rolUsuario: 1
    }).column('idUsuario', 'nombre', 'apellidos', 'correo', 'password', 'rolUsuario');
}

/* 2ND CRUD ALUMNOS */


/* 3RD CRUD GRUPOS */

function createGroup(grupo) {
    return knex("grupo").insert(grupo);
}

function updateGroup(id, grupo) {
    return knex("grupo").where({
        idGrupo: id
    }).update(grupo);
}

function getGroup(id) {
    return knex("grupo").where({
        idGrupo: id
    });
}

function getAllSProfesorGroups(id) {
    return knex("grupo").where({
        profesor: id
    }).column('idGrupo', 'nombre', 'profesor', 'descripcion');
}

function deleteGroup(id) {
    return knex("grupo").where({
        idGrupo: id
    }).del();
}

/* 3RD CRUD GRUPOS */


/* 4TH CRUD ALUMNO-GRUPO */

function createAlumnoGroup(alumno) {
    return knex("alumnos_grupo").insert(alumno);
}

function getAllStudentsGroup(id) {
    return knex("alumnos_grupo").where({
        grupo: id
    }).select("alumno");
}

function getAllGroupsStudent(id) {
    return knex("alumnos_grupo").where({
        alumno: id
    });
}

function deleteAlumnoGroup(id) {
    return knex("alumnos_grupo").where({
        grupo: id
    }).del();
}

/* 4TH CRUD ALUMNO-GRUPO */


/* 5TH CRUD TAREAS */


function createTarea(tarea) {
    return knex("tareas").insert(tarea);
}

function getAllSTareasGroups(id) {
    return knex("tareas").where({
        grupo: id
    }).column('idTarea', 'nombre', 'fechaLimite', 'puntosMaximos', 'grupo', 'fechaCreacion');
}

function updateTarea(id, tarea) {
    return knex("tareas").where({
        idTarea: id
    }).update(tarea);
}

function getTarea(id) {
    return knex("tareas").where({
        idTarea: id
    });
}

function deleteTarea(id) {
    return knex("tareas").where({
        idTarea: id
    }).del();
}


/* 5TH CRUD TAREAS */


/* 6TH CRUD ENTREGA */

function createEntrega(entrega) {
    return knex("entrega").insert(entrega);
}

function deleteEntrega(id) {
    return knex("entrega").where({
        idTarea: id
    }).del();
}

function getAllEntregasGroups(id) {
    return knex("entrega").where({
        idTarea: id
    });
}

function getAllEntregasAlumno(id) {
    return knex("entrega").where({
        idUsuario: id
    });
}

function getRevisionesAlumno(id) {
    return knex("entrega").where({
        revisor: id
    });
}

function updateEntrega(id, entrega) {
    return knex("entrega").where({
        idEntrega: id
    }).update(entrega);
}

module.exports = {
    createUser,
    createGroup,
    createTarea,
    createAlumnoGroup,
    createEntrega,
    deleteUser,
    deleteGroup,
    deleteAlumnoGroup,
    deleteTarea,
    deleteEntrega,
    updateUser,
    updateGroup,
    updateTarea,
    updateEntrega,
    getAllUsers,
    getUniqueUser,
    getUniqueUserByEmail,
    getAllAlumnos,
    getRevisionesAlumno,
    getGroup,
    getTarea,
    getAllSTareasGroups,
    getAllGroupsStudent,
    getAllEntregasAlumno,
    getAllSProfesorGroups,
    getAllStudentsGroup,
    getAllEntregasGroups
}