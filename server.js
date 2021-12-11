const express = require("express");
const app = express();
const db = require("./db/school")
const randomize = require('randomatic');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static(__dirname + '/public'));
/* app.use(express.static('public')); */
const url = require('url');

app.use(cors());

/*------------------------------------------------------------*/

//AUTH FUNCS

async function authenticateToken(req, res, next) {

    const user = await db.getLoggedUsers();
    if (user.length == 0) return res.sendStatus(401);
    const token = user[0].token;
    const correo = user[0].correo;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) return res.sendStatus(403);
        next();
    });
    /* const authHeader = req.headers['authorization'];
    console.log(req.headers['authorization']);
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, correo) => {
        if (err) return res.sendStatus(403);
        req.correo = correo;
        next();
    }) */
}


/* app.use('/tareas', authentication, usersRouter);
app.use('/dashboard', authentication, usersRouter); */

/*------------------------------------------------------------*/

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

/*------------------------------------------------------------*/

//RUTAS POST

app.post("/createUser", async (req, res) => {
    console.log(req.body);
    const isUserCreated = await db.getUniqueUserByEmail(req.body.correo);

    if (isUserCreated.length == 0) {

        // Create token
        var jsonBody = req.body;
        const token = jwt.sign(req.body.correo, process.env.ACCESS_TOKEN_SECRET);
        jsonBody.token = token;
        jsonBody.loggedIn = 0;

        const user = await db.createUser(jsonBody);

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
        console.log(user);
        console.log(user[0].correo);
        user[0].loggedIn = 1;
        console.log(user[0].loggedIn);
        await db.updateUser(user[0].idUsuario, user[0]);
        res.status(200).redirect('/dashboard');
    } else {
        console.log("Tus datos de inicio de sesión no coinciden con los nuestros.");
        res.status(400).send('Tus datos de inicio de sesión no coinciden con los nuestros.');
    }

});


/*------------------------------------------------------------*/

app.get("/test", (req, res) => {
    res.status(200).json({
        success: true
    });
});

app.listen(1337, () => console.log("Server is running on port 1337"));