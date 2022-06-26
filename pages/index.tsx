import { GetServerSidePropsContext } from 'next';
import Head from 'next/head'
import Footer from '../components/Footer';
import Header from '../components/Header';
import { defaultMainContainer, defaultPageContainer } from '../styles/defaultStyles';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const request = context.req;
  const forwarded = request.headers["x-forwarded-for"];
  const ip = forwarded || request.connection.remoteAddress;
  console.log(ip);

  return {
    props: { ip }
  }
}


export default function Home({ ip }: { ip: string }) {
  console.log('Server says ip is ', ip)

  return (
    <div style={defaultPageContainer}>
      <Head>
        <title>⌚▶📣 Take me to my leader</title>
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
