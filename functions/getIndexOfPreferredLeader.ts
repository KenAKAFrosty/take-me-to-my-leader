import { Official } from "./getPoliticalLeaders";


export default function getIndexOfPreferredLeader(leaders: Official[]) {
    if (!leaders || leaders.length === 0) return -1;
    //Leaders are naturally sorted 0 -> length from Highest position -> most local
    //So we just want to grab the highest possible leader that has an email.
    //If NONE of them have an email, then just grab the highest one (we'll show phone# if no email)
    for (let i = 0; i < leaders.length; i++) {
        const leader = leaders[i];
        if (leader.emails) { return i }
    }

    return 0;
}
