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
import { LeaderCard } from '../components/HomePage/LeaderCard';

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
        <meta property="og:title" content={slogan} />
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
              isLoading={leadersAreLoading} 
            />
            <LeaderCard
              leaders={leaders}
              index={staleLeaderIndex}
              geoData={geoData}
              handleShuffle={handleShuffle}
              handleLocationEdit={handleLocationEdit}
              subjectLines={subjectLines}
            />

          </>
        }
      </main>
      <Footer />
      {staleShowZipModal &&
        <ZipCodeModal updateZip={updateZip} queueSetShowModal={queueUpdateShowZipModal} />
      }
    </div>
  )
}