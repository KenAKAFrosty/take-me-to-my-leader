import { MouseEventHandler } from "react";
import { GeoData } from "../../functions/getLocationFromIp";
import { Leader } from "../../functions/getPoliticalLeaders";
import TwitterBioButton from "../TwitterBioButton";
import AddressComponent from "./AddressComponent";
import MessageButton from "./MessageButton";
import { NamePortraitAndTitle } from "./NamePortraitAndTitle";
import PhoneButton from "./PhoneButton";
import Shuffle from "./Shuffle";


export function LeaderCard({ leaders, index, geoData, handleShuffle, handleLocationEdit, subjectLines }:
    {
        leaders: Leader[];
        index: number;
        geoData: GeoData;
        handleShuffle: MouseEventHandler;
        handleLocationEdit: MouseEventHandler;
        subjectLines: string[];
    }) {

    const selectedLeader: Leader = leaders && leaders[index];

    return (
        <>
            {leaders &&
                <>
                    <p style={{ marginBottom: 0, fontSize: "calc(12px + 2vw)", fontWeight: "bold", textAlign: "center" }}>
                        {geoData.county || "Unknown county"}{geoData.state ? ", " + geoData.state : ""}
                    </p>
                    <div
                        onClick={handleLocationEdit}
                        style={{
                            display: "flex", alignItems: "center", marginBottom: 25, marginTop: 8, gap: 5, zIndex: 2,
                            boxShadow: "0 0 4px rgba(0, 0, 100, 0.4)", padding: 4, borderRadius: 6, cursor: "pointer", userSelect: "none"
                        }}>
                        <p style={{ fontSize: 12 }}>
                            {`Wrong place?`}
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="rgba(0,0,100,0.9)" d="M14.078 4.232l-12.64 12.639-1.438 7.129 7.127-1.438 12.641-12.64-5.69-5.69zm-10.369 14.893l-.85-.85 11.141-11.125.849.849-11.14 11.126zm2.008 2.008l-.85-.85 11.141-11.125.85.85-11.141 11.125zm18.283-15.444l-2.816 2.818-5.691-5.691 2.816-2.816 5.691 5.689z" /></svg>

                    </div>
                </>
            }


            <article
                style={{
                    transition: "580ms ease-out",
                    backgroundColor: "rgba(0,0,0, 0.02)",
                    boxShadow: "0px 0px 7px rgba(0,0,0, 0.26)",
                    borderRadius: 5,
                    padding: 8,
                    minWidth: 280,
                    maxWidth: 390,
                    width: "80%",
                    opacity: leaders ? 1 : 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: selectedLeader ? "flex-start" : "center",
                    alignItems: "center",
                    position: "relative"
                }}>
                {selectedLeader &&
                    <LeaderComponents
                        leader={selectedLeader}
                        geoData={geoData}
                        handleShuffle={handleShuffle}
                        subjectLines={subjectLines}
                    />
                }
            </article>
        </>
    )
}


function LeaderComponents({ leader, geoData, handleShuffle, subjectLines }:
    {
        leader: Leader,
        geoData: GeoData,
        handleShuffle: MouseEventHandler,
        subjectLines: string[];
    }) {

    const template = `Hi ${leader.name},\nI'm from ${geoData.county} and my name is`;

    return (
        <>
            <NamePortraitAndTitle preferredLeader={leader} />
            <br></br>
            {leader.addresses &&
                <AddressComponent address={leader.addresses[0]} />
            }
            <Shuffle handleShuffle={handleShuffle} />

            <div style={{
                display: "flex", alignItems: "center", gap: "10px", marginTop: 10, marginBottom: 10,
            }}>
                <div style={{ display: "flex", gap: "10px" }}>
                    {leader.phones && leader.phones.length &&
                        <PhoneButton phoneNumber={leader.phones[0]} />
                    }

                    {leader.twitterLink &&
                        <TwitterBioButton twitterUserLink={leader.twitterLink} />
                    }
                </div>

                {leader.emails && leader.emails.length > 0 &&
                    <MessageButton preferredLeader={leader} subjectLines={subjectLines} body={template || ""} />
                }
            </div>

        </>
    )
}
