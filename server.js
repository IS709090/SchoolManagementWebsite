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
/* app.use(express.static('public')); */
const url = require('url');

app.use(cors());

/*------------------------------------------------------------*/

//AUTH FUNCS

const authenticateToken = (req, res, next) => {
    if (!req.cookies.access_token) {
        console.log("funciono");
        return res.sendStatus(403);
    }
    try {
        const token = req.cookies.access_token.token;
        console.log(token);
        console.log(req.cookies.access_token);
        if (!token) {
            return res.sendStatus(403);
        }
        try {
            const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            return next();
        } catch {
            return res.sendStatus(403);
        }
    } catch {
        return res.sendStatus(403);
    }

};


/* async function authenticateToken(req, res, next) {

    console.log("Cuenta creada con éxito!");
    const user = await db.getLoggedUsers();
    if (user.length == 0) return res.sendStatus(401);
    const token = user[0].token;
    const correo = user[0].correo;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) return res.sendStatus(403);
        next();
    });

} */


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
        console.log(user);
        console.log(user[0].correo);
        await db.updateUser(user[0].idUsuario, user[0]);
        const token = jwt.sign(user[0].correo, process.env.ACCESS_TOKEN_SECRET);
        var jsonBody = {
            "token": token,
            "correo": user[0].correo
        }

        console.log(jsonBody);
        return res
            .cookie("access_token", jsonBody, {
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



/*------------------------------------------------------------*/

app.get("/test", (req, res) => {
    res.status(200).json({
        success: true
    });
});

app.listen(1337, () => console.log("Server is running on port 1337"));