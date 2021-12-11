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

/* function getLoggedUsers() {
    return knex("usuario").where({
        loggedIn: 1
    }).column('idUsuario', 'nombre', 'apellidos', 'correo', 'password', 'rolUsuario');
} */

function getUniqueUser(email, password) {
    return knex("usuario").where({
        correo: email,
        password: password
    }).column('idUsuario', 'nombre', 'apellidos', 'correo', 'password', 'rolUsuario');
}

function getUniqueUserByEmail(email) {
    return knex("usuario").where({
        correo: email
    }).column('correo');
}




function getAllStudentsGroup(grupo) {
    return knex("alumnos_grupo").select("alumno");
}

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    getAllUsers,
    getUniqueUser,
    getUniqueUserByEmail,
    getAllStudentsGroup
}