const fs = require('fs');
const path = require('path');
//Data courtesy of https://www.unitedstateszipcodes.org/zip-code-database/
//Obtained with free license. Okay to use for non-commercial. 
//If commercial usage begins at some point, make sure to purchase proper license from above URL

run();

async function run() {
    const text = fs.readFileSync("./zip_code_database.csv", "utf-8");
    const rows = text.split("\n");
    const headers = rows[0].split(",");
    const zipIndex = headers.indexOf("zip");
    const stateIndex = headers.indexOf("state");

    const jsonVersion = {};

    for (let i = 0; i< rows.length; i++) { 
        const row = rows[i].split(",");
        const zip = row[zipIndex];
        const state = row[stateIndex];
        jsonVersion[zip] = state;
    }
    console.log(Object.keys(jsonVersion).length)
    fs.writeFileSync("./statesByZip.json", JSON.stringify(jsonVersion));
}