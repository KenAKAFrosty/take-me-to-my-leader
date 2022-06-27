import { GetServerSidePropsContext } from 'next';
import Head from 'next/head'
import Footer from '../components/Footer';
import Header from '../components/Header';
import getLocationFromIp from '../functions/getLocationFromIp';
import { getPoliticalLeadersByZip, Official } from '../functions/getPoliticalLeaders';
import { defaultMainContainer, defaultPageContainer } from '../styles/defaultStyles';


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
    geoData.county = countiesByZip[location?.postal];
  }

  return {
    props: { geoData }
  }
}

interface GeoData {
  city?: string;
  county?: string;
  zip?: string;
  state?: string;
  stateCode?: string;
}

export default function Home({ geoData }: { leaders: Official[], geoData: GeoData }) {
  console.log(geoData)

  return (
    <div style={defaultPageContainer}>
      <Head>
        <title>Take me to my leader 📣</title>
        <meta name="description" content="The fastest path to participating in democracy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />


      <main style={defaultMainContainer}>

        <h1 style={{
          textAlign: "center",
          width: "100%",
          margin: 0,
          padding: 10,
          lineHeight: 1.15,
          fontSize: "calc(16px + 5vw)",
          color: "rgba(0,0,0,0.82)",
        }}>
          {`The fastest path to participating in democracy`}
        </h1>


      </main>

      <Footer />

    </div>
  )
}
