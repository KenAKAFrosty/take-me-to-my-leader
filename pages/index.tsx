import Head from 'next/head'
import Image from 'next/image'
import { defaultMainContainer, defaultPageContainer } from '../styles/defaultStyles';


export default function Home() {
  console.log(process.env.TEST);

  return (
    <div style={defaultPageContainer}>
      <Head>
        <title>⌚▶📣 Take me to my leader</title>
        <meta name="description" content="The fastest path to participating in democracy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        Take me to my leader
      </header>
      
      <main style={defaultMainContainer}>
        <h1 style={{
          textAlign: "center",
          width: "100%",
          margin: 0,
          padding: 10,
          lineHeight: 1.15,
          fontSize: "calc(16px + 5vw)",
          color: "rgba(0,0,0,0.82)"
        }}>
          The fastest path to participating in democracy
        </h1>

      </main>
    
        <footer>
          Proudly hosted by Vercel
        </footer>
    </div>
  )
}
