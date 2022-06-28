import axios from 'axios';

export default async function getLocationFromIp(ip: string | string[] | undefined){ 
    const ipToUse = getSanitizedIp(ip);
    if (!ip) return null;

    const location: Location = (await axios.get(`https://ipwho.is/${ipToUse}`)).data;
    return location.success ? location : null;
}

function getSanitizedIp(ip: string | string[] | undefined) { 
    const failure = null

    if (!ip) return failure;
    if (Array.isArray(ip)) return failure;
    if (ip.includes("::1")) return process.env.TEST_IP || null;
    
    return ip;
}


export interface Location { 
    ip: string;
    success: boolean;
    message?: string;
    type?: 'IPv4' | 'IPv6';
    continent?: string;
    continent_code?: string;
    country?: string;
    region?: string;
    region_code?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    is_eu?: boolean;
    postal?: string;
    calling_code?: string;
    capital?: string;
    flag?: {
        asn: number;
        org: string;
        isp: string;
        domain: string;
    },
    timezone?: { 
        id: string;
        abbr: string;
        is_dst: boolean;
        offset: number;
        utc: string;
        current_time: string;
    }
}

export interface GeoData {
  city?: string;
  county?: string;
  zip?: string;
  state?: string;
  stateCode?: string;
}