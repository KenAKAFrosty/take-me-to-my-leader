import type { NextApiRequest, NextApiResponse } from 'next'
import { getPoliticalLeadersByZip } from '../../functions/getPoliticalLeaders'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const zip = req.body.zip || req.query.zip;
    if (!zip) {
        res.status(400).json({ error: "No zip provided" });
        return
    }

    try {
        const leaders = await getPoliticalLeadersByZip(zip);

        res.status(200).json({ success: true, leaders })
    } catch (error: any) {
        console.log(error.data);
        res.status(500).json({ error: "Unknown error. Please try again." });
        return;
    }
}
