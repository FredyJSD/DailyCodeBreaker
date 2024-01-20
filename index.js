import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import fs from 'fs/promises';

const app = express();
const port = process.env.PORT || 3000;
const http = require('http');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const API_ENDPOINT = 'https://api.jdoodle.com/v1/execute';
const CLIENT_ID = '9b9f34615ede798398cbd85d1cc827ab';
const CLIENT_SECRET = 'bf8d2de58753ee1d5493060e39bead1a8633fb65bc180bc1a54a10336f1be96f';

const today = new Date();
const day = today.getDate();

async function loadJson(difficulty) {
    try {
        const difficultyJSON = await fs.readFile(`./${difficulty}.json`, 'utf-8');
        return JSON.parse(difficultyJSON)[day % 3];
    } catch (err) {
        console.error('Error reading or parsing the JSON file:', err);
        throw err; // Re-throw the error to handle it in the calling function
    }
}

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.get("/easy", async (req, res) => {
    const easyDifficulty = await loadJson(`easy`);
    res.render("easy.ejs", {
        date: day,
        dailyQuestion: easyDifficulty
    });
});

app.get("/medium", async (req, res) => {
    const medDifficulty = await loadJson('medium');
    res.render("medium.ejs",{
        date: day,
        dailyQuestion: medDifficulty
    });
});

app.get("/hard", async (req, res) => {
    const hardDifficulty = await loadJson('hard');
    res.render("hard.ejs", {
        date: day,
        dailyQuestion: hardDifficulty
    });
});

app.post("/hard", async (req, res) => {
    const hardDifficulty = await loadJson(`hard`);
    const code = req.body.code;
    const userLanguage = req.body.languageSelection;
    console.log(userLanguage);
    try{
        const result = await axios.post(API_ENDPOINT, {
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            script: code,
            language: userLanguage,
            versionIndex: "3"
        });
        console.log(result.data);
        res.render("hard.ejs", {
            response: result.data, 
            date: day,
            dailyQuestion: hardDifficulty
        });
    }catch(error){
        res.render("hard.ejs", {response: { error: error.message }});
    }
})

app.post("/medium", async (req, res) => {
    const medDifficulty = await loadJson(`medium`);
    const code = req.body.code;
    const userLanguage = req.body.languageSelection;
    console.log(userLanguage);
    try{
        const result = await axios.post(API_ENDPOINT, {
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            script: code,
            language: userLanguage,
            versionIndex: "3"
        });
        console.log(result.data);
        res.render("medium.ejs", {
            response: result.data,
            date: day,
            dailyQuestion: medDifficulty
        });
    }catch(error){
        res.render("medium.ejs", {response: { error: error.message }});
    }
})

app.post("/easy", async (req, res) => {
    const easyDifficulty = await loadJson(`easy`);
    const code = req.body.code;
    const userLanguage = req.body.languageSelection;
    console.log(userLanguage);
    try{
        const result = await axios.post(API_ENDPOINT, {
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            script: code,
            language: userLanguage,
            versionIndex: "3"
        });
        console.log(result.data);
        res.render("easy.ejs", {
            response: result.data, 
            date: day,
            dailyQuestion: easyDifficulty
        });
    }catch(error){
        res.render("easy.ejs", {response: { error: error.message }});
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


