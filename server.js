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

/*----------------------------------------------------------------------------------------------------------*/

//RUTAS POST

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

app.listen(1337, () => console.log("Server is running on port 1337"));