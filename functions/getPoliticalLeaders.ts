
const baseUrl = "https://www.googleapis.com/civicinfo/v2/representatives?address="
import axios from "axios"

export async function getPoliticalLeadersByZip(zip: string | number) {
    console.log(zip);
    const url = baseUrl + zip + "&key=" + process.env.CIVIC_API_KEY;
    const civicData: CivicApiResponse = (await axios.get(url)).data;
    return getOfficalsWithContactInfo(civicData).map(leader => {
        return {
            addresses: leader.address,
            emails: leader.emails,
            name: leader.name,
            phones: leader.phones,
            twitterLink: getTwitterLinkFromLeaderChannels(leader.channels),
            office: leader.office,
            party: leader.party,
            image: leader.photoUrl
        }
    });

}

function getTwitterLinkFromLeaderChannels(channels: Array<Channel>) {
    if (!channels) return "";
    const twitterObject = channels.find(channel => channel.type === "Twitter");
    if (!twitterObject) return ""
    else return "https://twitter.com/" + twitterObject.id;
}



export function getOfficalsWithContactInfo(civicData: CivicApiResponse): Official[] {
    const officials = getOfficialsWithNameOfOffice(civicData);
    return officials.filter(official => {
        return (official.phones || official.emails) &&  //leaving the pres and VP out of this
            official.office !== "President of the United States" &&
            official.office !== "Vice President of the United States"
    })
}

export function getOfficialsWithNameOfOffice(civicData: CivicApiResponse): Official[] {
    const officeNameByOfficialIndex: string[] = [];
    for (const office of civicData.offices) {
        for (const index of office.officialIndices) {
            officeNameByOfficialIndex[Number(index)] = office.name
        }
    }

    return civicData.officials.map((official, i) => {
        official.office = officeNameByOfficialIndex[i]
        return official;
    })
}

export type CivicApiResponse = {
    "kind": "civicinfo#representativeInfoResponse",
    "normalizedInput": Address,
    "divisions": {
        [key: string]: {
            "name": string,
            "alsoKnownAs": string[],
            "officeIndices": number[]
        }
    },
    "offices": Array<
        {
            "name": string,
            "divisionId": string,
            "levels": string[],
            "roles": string[],
            "sources": Array<
                {
                    "name": string,
                    "official": boolean
                }
            >,
            "officialIndices": number[]
        }
    >,
    "officials": Array<Official>
}


type Address = {
    "locationName": string,
    "line1": string,
    "line2": string,
    "line3": string,
    "city": string,
    "state": string,
    "zip": string
}

type Channel = {
    "type": string,
    "id": string
}

export type Official = {
    "name": string,
    "address": Address[],
    "party": string,
    "phones": string[],
    "urls": string[],
    "photoUrl": string,
    "emails": string[],
    "channels": Array<Channel>
    "office"?: string
}