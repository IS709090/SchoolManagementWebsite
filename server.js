const express = require("express");
const app = express();
const db = require("./db/school")
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
require('dotenv').config();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true
}));
app.use(express.static(__dirname + '/public'));
const url = require('url');
const {
    Console
} = require("console");

app.use(cors());

/*----------------------------------------------------------------------------------------------------------*/

//AUTH FUNCS

const authenticateToken = (req, res, next) => {

    const token = req.cookies.access_token;

    if (!token) {
        return res.sendStatus(403);
    }
    try {
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.correo = data;

        return next();
    } catch {
        return res.sendStatus(403);
    }


};

/*----------------------------------------------------------------------------------------------------------*/

//RUTAS GET

// Mandar index.html

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

// Mandar tareas.html

app.get('/tareas', authenticateToken, (req, res) => {
    res.sendFile(__dirname + '/tareas.html');
})

// Mandar revisiones.html

app.get('/revisiones', authenticateToken, (req, res) => {
    res.sendFile(__dirname + '/revisiones.html');
})

// Mandar dashboard.html

app.get('/dashboard', authenticateToken, (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
})


// Mandar grupos.html

app.get('/grupos', authenticateToken, (req, res) => {
    res.sendFile(__dirname + '/grupos.html');
})


// Mandar User INFO

app.get('/getUser', authenticateToken, async (req, res) => {
    let correo = req.correo;
    let userInfo = await db.getUniqueUserByEmail(correo);

    res.send({
        idUsuario: userInfo[0].idUsuario,
        nombre: userInfo[0].nombre,
        apellidos: userInfo[0].apellidos,
        correo: userInfo[0].correo,
        password: userInfo[0].password,
        rolUsuario: userInfo[0].rolUsuario
    });
})

// Mandar Alumnos

app.get('/getAlumnos', authenticateToken, async (req, res) => {

    let userInfo = await db.getAllAlumnos();

    res.send(userInfo);
})


// Mandar Grupos Profesor

app.get('/getGruposProfesor', authenticateToken, async (req, res) => {
    let correo = req.correo;
    let userInfo = await db.getUniqueUserByEmail(correo);

    let gruposProfesor = await db.getAllSProfesorGroups(userInfo[0].idUsuario);

    res.send(gruposProfesor);
})


// Mandar Tareas Profesor

app.get('/getTareasProfesor', authenticateToken, async (req, res) => {
    let correo = req.correo;
    let userInfo = await db.getUniqueUserByEmail(correo);

    let gruposProfesor = await db.getAllSProfesorGroups(userInfo[0].idUsuario);
    let tareas = [];

    if (gruposProfesor.length >= 1) {

        for await (const grupo of gruposProfesor) {
            let tarea = await db.getAllSTareasGroups(grupo.idGrupo);

            if (tarea.length >= 1) {

                for await (const element of tarea) {
                    tareas.push(element);
                }

            }

        }

        res.send(tareas);
    } else {
        res.status(400).send('Ya existe una cuenta con ese correo');
    }



})

// Mandar Entregas Profesor

app.get('/getEntregasProfesor', authenticateToken, async (req, res) => {
    let correo = req.correo;
    let userInfo = await db.getUniqueUserByEmail(correo);

    let gruposProfesor = await db.getAllSProfesorGroups(userInfo[0].idUsuario);
    let entregasFinal = [];

    if (gruposProfesor.length >= 1) {

        for await (const grupo of gruposProfesor) {
            let tarea = await db.getAllSTareasGroups(grupo.idGrupo);

            if (tarea.length >= 1) {

                tarea.forEach(async element => {

                    let entregas = await db.getAllEntregasGroups(element.idTarea);
                    entregasFinal.push(entregas);
                });

            }

        }

        res.send(entregasFinal);
    } else {
        res.status(400).send('Ya existe una cuenta con ese correo');
    }

})

// Mandar Entregas Alumno

app.get('/getEntregasAlumno', authenticateToken, async (req, res) => {
    let correo = req.correo;
    let userInfo = await db.getUniqueUserByEmail(correo);

    let entregasAlumno = await db.getAllEntregasAlumno(userInfo[0].idUsuario);

    res.send(entregasAlumno);


})

// Mandar Grupos Alumno

app.get('/getGroupsAlumno', authenticateToken, async (req, res) => {
    let correo = req.correo;
    let userInfo = await db.getUniqueUserByEmail(correo);

    let gruposAlumno = await db.getAllGroupsStudent(userInfo[0].idUsuario);

    res.send(gruposAlumno);


})



/*----------------------------------------------------------------------------------------------------------*/

//RUTAS POST

// Mandar Grupo Alumno POST

app.post('/getGroup', authenticateToken, async (req, res) => {

    let grupoAlumno = await db.getGroup(req.body.value);

    res.send(grupoAlumno);

})

// Mandar Tarea Alumno POST

app.post('/getTarea', authenticateToken, async (req, res) => {

    let tareaAlumno = await db.getTarea(req.body.value);

    res.send(tareaAlumno);

})

// Mandar Revisiones Alumno POST

app.post('/getRevisionesAlumno', authenticateToken, async (req, res) => {

    let revisionesAlumno = await db.getRevisionesAlumno(req.body.value);

    res.send(revisionesAlumno);

})

//create user POST

app.post("/createUser", async (req, res) => {
    console.log(req.body);
    const isUserCreated = await db.getUniqueUserByEmail(req.body.correo);

    if (isUserCreated.length == 0) {

        const user = await db.createUser(req.body);

        if (user.length == 1) {
            console.log("Cuenta creada con éxito!");
            res.status(201).send("Cuenta creada con éxito!");
        } else {
            console.log("Tus datos no coinciden con nuestros formatos de entrada");
            res.status(400).send('Tus datos no coinciden con nuestros formatos de entrada');
        }
    } else {
        console.log("Ya existe una cuenta con ese correo");
        res.status(400).send('Ya existe una cuenta con ese correo');
    }
});

//create group POST

app.post("/createGroup", async (req, res) => {

    const grupo = await db.createGroup(req.body[0]);

    if (grupo.length == 1) {
        console.log("Grupo creado con éxito!");

        req.body[1].forEach(async idAlumno => {

            let alumno = {
                alumno: idAlumno,
                grupo: grupo[0]
            }
            const insertAlumno = await db.createAlumnoGroup(alumno);

        });
        console.log("Redirect!");
        return res.redirect('/grupos');
        /* res.status(303).redirect('/grupos'); */
    } else {
        console.log("Tus datos no coinciden con nuestros formatos de entrada");
        res.status(400).send('Tus datos no coinciden con nuestros formatos de entrada');
    }

});

//EDIT group POST

app.post("/editGroup", async (req, res) => {

    const grupo = await db.updateGroup(req.body.idGrupo, req.body);

    if (grupo == 1) {
        res.status(201).redirect('/grupos');
    } else {
        console.log("Tus datos no coinciden con nuestros formatos de entrada");
        res.status(400).send('Tus datos no coinciden con nuestros formatos de entrada');
    }
});

//DELETE group POST

app.post("/deleteGroup", async (req, res) => {

    const AlumnoGrupoEliminado = await db.deleteAlumnoGroup(req.body.idGrupo);
    const GrupoEliminado = await db.deleteGroup(req.body.idGrupo);

    res.status(201).redirect('/grupos');
});


//create tarea POST

app.post("/createTarea", async (req, res) => {

    const tarea = await db.createTarea(req.body);
    console.log(tarea);

    if (tarea.length == 1) {
        let alumnos = await db.getAllStudentsGroup(req.body.grupo);
        console.log(alumnos);

        for await (const estudiante of alumnos) {
            let entregaCuerpo = {
                idTarea: tarea[0],
                idGrupo: req.body.grupo,
                nombre: req.body.nombre,
                idUsuario: estudiante.alumno,
                fechaCreacion: req.body.fechaCreacion,
                fechaEntrega: req.body.fechaLimite
            }
            let entrega = await db.createEntrega(entregaCuerpo);
            console.log(entrega);
        }


        console.log("Tarea creada con éxito!")
        res.status(201).redirect('/tareas');
    } else {
        console.log("Tus datos no coinciden con nuestros formatos de entrada");
        res.status(400).send('Tus datos no coinciden con nuestros formatos de entrada');
    }

});

//EDIT tarea POST

app.post("/editTarea", async (req, res) => {

    const tarea = await db.updateTarea(req.body.idTarea, req.body);

    if (tarea == 1) {
        res.status(201).redirect('/tareas');
    } else {
        console.log("Tus datos no coinciden con nuestros formatos de entrada");
        res.status(400).send('Tus datos no coinciden con nuestros formatos de entrada');
    }
});

//DELETE tarea POST

app.post("/deleteTarea", async (req, res) => {

    const TareaEliminada = await db.deleteTarea(req.body.idTarea);
    const EntregaEliminada = await db.deleteEntrega(req.body.idTarea);

    res.status(201).redirect('/tareas');
});

//GET AlumnosProfesor POST
app.post('/getAlumnosProfesor', authenticateToken, async (req, res) => {
    var num = req.body.value;

    let alumnos = await db.getAllStudentsGroup(num);

    res.send(alumnos);

})

//EDIT entrega POST

app.post("/editEntrega", async (req, res) => {

    console.log(req.body);

    const entrega = await db.updateEntrega(req.body.idEntrega, req.body);

    if (entrega == 1) {
        res.status(201).redirect('/revisiones');
    } else {
        console.log("Tus datos no coinciden con nuestros formatos de entrada");
        res.status(400).send('Tus datos no coinciden con nuestros formatos de entrada');
    }
});

//login POST

app.post("/login", async (req, res) => {
    console.log(req.body);
    const email = req.body.correo;
    const password = req.body.password;
    const user = await db.getUniqueUser(email, password);
    if (user.length == 1) {
        console.log("Datos correctos!");
        await db.updateUser(user[0].idUsuario, user[0]);
        const token = jwt.sign(user[0].correo, process.env.ACCESS_TOKEN_SECRET);

        return res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            }).status(200).redirect('/dashboard');
    } else {
        console.log("Tus datos de inicio de sesión no coinciden con los nuestros.");
        res.status(400).send('Tus datos de inicio de sesión no coinciden con los nuestros.');
    }

});

app.get("/logout", authenticateToken, (req, res) => {
    console.log("Logging out");
    res.clearCookie("access_token");
    return res.status(200).redirect('/');
});



/*----------------------------------------------------------------------------------------------------------*/

app.listen(process.env.PORT || 1337, () => console.log("Server is running on port 1337"));