import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const zip = req.body.zip || req.query.zip;
    console.log('zip provided', zip)
    if (!zip) {
        res.status(400).json({ error: "No zip provided" });
        return
    }

    try {
        const statesPath = path.join(process.cwd(), "cachedData/statesByZip.json");
        const countiesPath = path.join(process.cwd(), "cachedData/countiesByZip.json");
        const states = JSON.parse(fs.readFileSync(statesPath, "utf-8"));
        const counties = JSON.parse(fs.readFileSync(countiesPath, "utf-8"));;

        const state = states[zip.trim()].replaceAll('"',"") || "";
        const county = counties[zip.trim()].replaceAll('"',"") || "";
        const countyAndState = {county, state}
        res.status(200).json({ success: true, countyAndState })
    } catch (error: any) {
        console.log(error.response.data);
        res.status(500).json({ error: "Unknown error. Please try again." });
        return;
    }
}
