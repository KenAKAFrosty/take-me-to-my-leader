import { GetServerSidePropsContext } from 'next';
import Head from 'next/head'
import Footer from '../components/Footer';
import Header from '../components/Header';
import AddressComponent from '../components/HomePage/AddressComponent';
import ErrorMessage from '../components/HomePage/ErrorMessage';
import MessageButton from '../components/HomePage/MessageButton';
import { NamePortraitAndTitle } from '../components/HomePage/NamePortraitAndTitle';
import PhoneButton from '../components/HomePage/PhoneButton';
import LoadingSpinnerWithMessage from '../components/LoadingSpinner';
import getIndexOfPreferredLeader from '../functions/getIndexOfPreferredLeader';
import getLocationFromIp, { GeoData } from '../functions/getLocationFromIp';
import { Official, Leader } from '../functions/getPoliticalLeaders';
import usePoliticalLeaders from '../functions/hooks/usePoliticalLeaders';
import { defaultMainContainer, defaultPageContainer } from '../styles/defaultStyles';
import TwitterBioButton from '../components/TwitterBioButton';
import Image from 'next/image';
import dice from "../images/dice.svg"
import { MouseEvent, MouseEventHandler, useEffect, useState } from 'react';
import Modal from '../components/Modal';
import ZipCodeModal from '../components/HomePage/ZipCodeModal';

const subjectLines = [
  "RE: A concerned Citizen"
]


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const fs = require('fs');
  const path = require('path');
  const request = context.req;
  const forwarded = request.headers["x-forwarded-for"];
  const ip = forwarded || request.connection.remoteAddress;
  const location = await getLocationFromIp(ip);

  // if (!location) { return } // need proper return value still
  //if no zip on response, see if can use city+state instead
  //then if not, graceful exit

  const countiesByZipFile = path.join(process.cwd(), "cachedData/countiesByZip.json");
  const countiesByZip = JSON.parse(fs.readFileSync(countiesByZipFile, 'utf-8'));

  const geoData: GeoData = {
    city: location?.city,
    county: location?.country,
    zip: location?.postal,
    state: location?.region,
    stateCode: location?.region_code
  }

  if (location?.postal) {
    const raw = countiesByZip[location?.postal];
    geoData.county = raw.replaceAll("\"", "")
  }

  return {
    props: { geoData }
  }
}



export default function Home({ geoData }: { leaders: Official[], geoData: GeoData }) {

  if (!geoData) { }//need alternate "coming soon!" page, or even just let them enter a zip code here too.

  const { leaders, leadersError, leadersAreLoading, mutateLeaders } = usePoliticalLeaders(geoData);
  const [staleShowZipModal, queueUpdateShowZipModal] = useState<boolean>(false);
  const [staleLeaderIndex, queueUpdateLeaderIndex] = useState<number>(getIndexOfPreferredLeader(leaders));

  useEffect(whenLeadersUpdate, [leaders])
  function whenLeadersUpdate() {
    if (staleLeaderIndex === -1) { queueUpdateLeaderIndex(getIndexOfPreferredLeader(leaders)) }
  };

  function handleShuffle(event: MouseEvent) {
    const randomIndex = Math.floor(Math.random() * leaders.length);
    if (randomIndex === staleLeaderIndex) {
      handleShuffle(event);
      return;
    }
    queueUpdateLeaderIndex(randomIndex);
  };

  function handleLocationEdit() { queueUpdateShowZipModal(true); };

  async function updateZip(zip: string) {
    geoData.zip = zip;
    geoData.county = "";
    geoData.state = "";
    const response = await fetch("/api/getCountyAndStateByZip?zip=" + zip);
    const { county, state } = (await response.json()).countyAndState
    geoData.county = county;
    geoData.state = state
    mutateLeaders([], true);
    console.log(zip)
  }

  const title = "Take me to my leader 📣";
  const slogan = `Message your elected officials as easily as you text your friends.`

  return (
    <div style={defaultPageContainer}>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:image" content={`/social-share.png`} />
        <meta name="description" content={slogan} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:site_name" content="TakeMeToMyLeader" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:locale" content={`en_US`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <Header />
      <main style={{ ...defaultMainContainer, color: "rgba(0,0,0,0.69)", }}>
        {leadersError ? <ErrorMessage /> :
          <>
            <LoadingSpinnerWithMessage
              message={`The fastest way to participate in democracy`}
              loading={leadersAreLoading} />
            <LeaderCard leaders={leaders} index={staleLeaderIndex} geoData={geoData}
              handleShuffle={handleShuffle} handleLocationEdit={handleLocationEdit} />
          </>
        }
      </main>
      <Footer />
      {staleShowZipModal &&
        <ZipCodeModal updateZip={updateZip} queueUpdateShowModal={queueUpdateShowZipModal} />
      }
    </div>
  )
}


function Shuffle({ handleShuffle }: { handleShuffle?: MouseEventHandler }) {
  return (
    <div
      onClick={handleShuffle}
      style={{
        display: "flex", marginTop: 40, marginBottom: 40, alignItems: "center", gap: 5, cursor: "pointer",
        backgroundColor: "white", borderRadius: 8, padding: 4, boxShadow: "0px 0px 8px rgba(0,0,0,0.6)", userSelect: "none"
      }}>
      <Image style={{ opacity: 0.7 }} src={dice} height={40} width={40} />
      <h3 style={{ marginTop: -5 }}>{`Shuffle`}</h3>
    </div>
  )
}



function LeaderCard({ leaders, index, geoData, handleShuffle, handleLocationEdit }:
  { leaders: Leader[], index: number, geoData: GeoData, handleShuffle: MouseEventHandler, handleLocationEdit: MouseEventHandler }) {
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
          getLeaderComponents(selectedLeader, geoData, handleShuffle)
        }
      </article>
    </>
  )
}


function getLeaderComponents(leader: Leader, geoData: GeoData, handleShuffle: MouseEventHandler) {

  const template = `Hi ${leader.name},\nI'm from ${geoData.county} and my name is`;

  return (
    <>
      <NamePortraitAndTitle preferredLeader={leader} />
      <br></br>
      {/* <p>{preferredLeader.party}</p> */}
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
