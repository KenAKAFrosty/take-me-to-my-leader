import Head from 'next/head'
import Image from 'next/image'


export default function Home() {
  console.log(process.env.TEST);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    }}>
      <Head>
        <title>⌚▶📣 Take me to my leader</title>
        <meta name="description" content="The fastest path to participating in democracy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          flexGrow: 1,
          display:"flex",
          alignItems: "center"
      }}>
        <h1 style={{
          textAlign: "center",
          margin: 0,
          lineHeight: 1.15,
          fontSize: "4rem",
          color: "rgba(0,0,0,0.82)"
        }}>
          The fastest path to participating in democracy
        </h1>

      </main>

    </div>
  )
}
