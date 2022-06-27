import { CivicApiResponse, getOfficalsWithContactInfo } from "./getPoliticalLeaders";
import fs from 'fs'
import path from 'path';


test(`Jest itself is working properly`, ()=>{expect(true).toEqual(true)});


describe(`Looking up political leaders`, ()=> { 
    const sampleFileName = path.join(process.cwd(), "cachedData/sampleCivicApiResponse.json");
    const sampleData = JSON.parse(fs.readFileSync(sampleFileName,'utf-8')) as CivicApiResponse;

    test(`Getting officials that have contact information, except for Pres/VP`, async ()=> { 
        const officials = getOfficalsWithContactInfo(sampleData);

        expect(officials.length).toBeGreaterThan(0);
        expect(officials.every( official => official.phones || official.emails)).toEqual(true);
        expect(officials.find( official => official.name === "Joseph R. Biden")).toEqual(undefined);
        expect(officials.find( official => official.name === "Kamala D. Harris")).toEqual(undefined);
        expect(officials.find( official => official.name === "Bob Henriquez")).not.toBeFalsy();
    })
})