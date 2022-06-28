import useSWR from "swr";
import { GeoData } from "../getLocationFromIp";
import fetcher from "./fetcher";

export default function usePoliticalLeaders(geoData: GeoData) {
    const {data, error} = useSWR("/api/getPoliticalLeadersByZip?zip="+geoData.zip, fetcher);

    return { 
        leaders: data?.leaders,
        leadersError: error || data?.error,
        leadersAreLoading: !error && !data
    }
}