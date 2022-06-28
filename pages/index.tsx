import { GetServerSidePropsContext } from 'next';
import Head from 'next/head'
import { useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import getLocationFromIp, { GeoData } from '../functions/getLocationFromIp';
import { Official, Leader, Address } from '../functions/getPoliticalLeaders';
import usePoliticalLeaders from '../functions/hooks/usePoliticalLeaders';
import { defaultMainContainer, defaultPageContainer } from '../styles/defaultStyles';

const subjectLines = [
  "RE: A concerned Citizen"
]

const slogan = `The fastest way to participate in democracy`

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



function getIndexOfPreferredLeader(leaders: Official[]) {
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


export default function Home({ geoData }: { leaders: Official[], geoData: GeoData }) {

  const { leaders, leadersError, leadersAreLoading } = usePoliticalLeaders(geoData);

  return (
    <div style={defaultPageContainer}>
      <Head>
        <title>Take me to my leader 📣</title>
        <meta name="description" content={slogan} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />


      <main style={{ ...defaultMainContainer, color: "rgba(0,0,0,0.69)", }}>

        {/* 
          Rather than waiting for data to render the following, they were designed to start with 
          opacity 0 and height 0, that way they can "animate in" once the data is loaded.
        */}
        {leadersError ? <ErrorMessage /> :
          <>
            <LoadingSpinnerWithMessage message={slogan} loading={leadersAreLoading} />
            <LeaderCard leaders={leaders} index={getIndexOfPreferredLeader(leaders)} geoData={geoData} />
          </>
        }

      </main>

      <Footer />

    </div>
  )
}

function LoadingSpinnerWithMessage({ message, loading }: { message: string, loading: boolean }) {

  return (
    <>
      <h1 style={{
        textAlign: "center",
        lineHeight: 1.15,
        marginBottom: 20,
        fontSize: "calc(16px + 5vw)",
        transition: "220ms ease-in-out",
        opacity: loading ? 1 : 0,
        height: loading ? "auto" : 0
      }}>
        {message}
      </h1>

      <img
        className='spinning'
        src="/apple-touch-icon.png"
        height={75}
        width={75}
        style={{
          opacity: loading ? 1 : 0,
          height: loading ? "auto" : 0
        }} />
    </>
  )
}



function LeaderCard({ leaders, index, geoData }: { leaders: Leader[], index: number, geoData: GeoData }) {
  const preferredLeader: Leader = leaders && leaders[index];

  return (
    <>
      {leaders && geoData && geoData.county && geoData.state &&
        <p style={{ marginBottom: 20, fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          {geoData.county}{', '}{geoData.state}
        </p>
      }
      <article
        style={{
          transition: "580ms ease-out",
          backgroundColor: "rgba(0,0,0, 0.02)",
          boxShadow: "0px 0px 7px rgba(0,0,0, 0.26)",
          borderRadius: 5,
          padding: 8,
          width: 280,
          opacity: leaders ? 1 : 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: preferredLeader ? "flex-start" : "center",
          alignItems: "center",
          position: "relative"
        }}>
        {getLeaderContent(preferredLeader, geoData)}
      </article>
    </>
  )
}


function getLeaderContent(preferredLeader: Leader, geoData: GeoData) {

  const template = !preferredLeader ? null : `Hi ${preferredLeader.name},\nI'm from ${geoData.county} and my name is`;

  if (!preferredLeader) { return <ErrorMessage /> }
  const shadow = "0px 0px 7px rgba(0,0,0,0.44)"

  return (
    <>
      <NamePortraitAndTitle preferredLeader={preferredLeader} />
      <br></br>
      {/* <p>{preferredLeader.party}</p> */}
      {preferredLeader.addresses &&
        <AddressComponent address={preferredLeader.addresses[0]} />
      }

      {template &&
        <div style={{
          backgroundColor: "white", padding: 4, borderRadius: 4, border: "1px solid rgba(0,0,0,0.2)",
          marginTop: 30, marginBottom: 30, fontSize: 14
        }}>
          <p>
            {`When you click 'Message Me!', the following template will load into your clipboard to start you off and keep it easy:`}
          </p>
          <br />
          <i>
            {template.split("\n").map(line => <p key={line}>{line}</p>)}
          </i>
        </div>
      }

      <div style={{
        display: "flex", alignItems: "center", gap: "10px", marginTop: 10, marginBottom: 10,
      }}>
        <div style={{ display: "flex", gap: "10px" }}>
          {preferredLeader.phones && preferredLeader.phones.length &&
            <Phone phoneNumber={preferredLeader.phones[0]} />
          }

          {preferredLeader.twitterLink &&
            <Twitter twitterUserLink={preferredLeader.twitterLink} />
          }
        </div>

        <MessageButton preferredLeader={preferredLeader} subjectLines={subjectLines} template={template || ""} />
      </div>

    </>
  )
}

function AddressComponent({ address }: { address: Address }) {
  return (
    <>
      <p>{address.locationName}</p>
      <p>{address.line1}</p>
      <span>{address.line2}</span>
      <p>{address.line3}</p>
      <p>{`${address.city}, ${address.state} ${address.zip}`}</p>
    </>
  )
}

function NamePortraitAndTitle({ preferredLeader }: { preferredLeader: Leader }) {
  const shadow = "0px 0px 7px rgba(0,0,0,0.24)"

  return (
    <div style={{ display: "flex", width: "100%", gap: 8 }}>
      <img
        src={preferredLeader.image}
        height={120}
        style={{
          background: "linear-gradient(60deg, #f800df, #ad00f8, #010ff8, #0173f8)",
          borderRadius: 4,
          boxShadow: shadow
        }}
      />
      <div style={{ margin: "auto", }}>
        <p style={{
          boxShadow: shadow,
          height: "fit-content",
          padding: 4,
          fontSize: 26,
          zIndex: 2,
          borderTopRightRadius: 4,
          borderTopLeftRadius: 4,
          fontWeight: "bold",
          wordBreak: "break-word",
          backgroundColor: "white"
        }}>
          {preferredLeader.name}
        </p>
        <p style={{
          boxShadow: shadow,
          height: "fit-content",
          padding: 4,
          fontSize: 22,
          marginTop: 4,
          fontWeight: "bold",
          textAlign: "center",
          borderBottomRightRadius: 4,
          borderBottomLeftRadius: 4,
          backgroundColor: "white"
        }}>
          {preferredLeader.office}
        </p>
      </div>
    </div>
  )
}


function Phone({ phoneNumber }: { phoneNumber: string }) {
  const shadow = "0px 0px 7px rgba(0,0,0,0.44)"
  return (
    <a href={`tel:${phoneNumber}`}>
      <div style={{
        backgroundColor: "white", display: "flex", alignItems: "center",
        paddingTop: 2, paddingBottom: 2, borderRadius: 4, boxShadow: shadow
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M19 2c0-1.104-.896-2-2-2h-10c-1.104 0-2 .896-2 2v20c0 1.104.896 2 2 2h10c1.104 0 2-.896 2-2v-20zm-8.5 0h3c.276 0 .5.224.5.5s-.224.5-.5.5h-3c-.276 0-.5-.224-.5-.5s.224-.5.5-.5zm1.5 20c-.553 0-1-.448-1-1s.447-1 1-1c.552 0 .999.448.999 1s-.447 1-.999 1zm5-3h-10v-14.024h10v14.024z" /></svg>
      </div>
    </a>
  )
}

function Twitter({ twitterUserLink }: { twitterUserLink: string }) {
  return (
    <a href={twitterUserLink} target="_blank" rel="noreferrer" >
      <div style={{
        backgroundColor: "white", display: "flex", alignItems: "center", cursor: "pointer",
        paddingTop: 2, paddingBottom: 2, borderRadius: 4, boxShadow: "0px 0px 7px rgb(29, 155, 240)"
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="rgb(29, 155, 240)" d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
      </div>
    </a>
  )
}

function MessageButton({ preferredLeader, subjectLines, template }:
  { preferredLeader: Leader, subjectLines?: string[], template: string }) {

  let href = `mailto:${preferredLeader.emails[0]}`
  if (subjectLines) {
    const randomIndex = Math.floor(Math.random() * subjectLines.length);
    href += `?subject=${subjectLines[randomIndex]}`
  }

  const shadow = "0px 0px 7px rgba(0,0,0,0.44)"
  return (
    <a href={href} >
      <button
        className='gradient-border'
        onClick={async () => {
          navigator.clipboard.writeText(template).then(() => {
            //no op
          })
        }}
        style={{
          cursor: "pointer",
          padding: 4,
          borderRadius: 4,
          boxShadow: shadow,
          fontSize: 24,
          fontWeight: "bold",
          fontFamily: "inherit",
          border: "none",
          backgroundColor: "white"
        }}>
        Message Me!
      </button>
    </a >
  )
}



function ErrorMessage() {
  return (
    <h3 style={{ width: "95%", textAlign: "left" }}>
      {`😩 An error has occurred.`}
      <br />
      {`🙏 Usually this is temporary.`}
      <br />
      {`🔧 We're working to fix moments like these.`}
      <br />
      {`🤗 Please try again soon!`}
    </h3>
  )
}