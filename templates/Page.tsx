import Head from 'next/head'
import Footer from '../components/Footer';
import Header from '../components/Header';
import { defaultMainContainer, defaultPageContainer } from '../styles/defaultStyles';


export default function Home() {

  return (
    <div style={defaultPageContainer}>
      <Head>
        <title>⌚▶📣 Take me to my leader</title>
        <meta name="description" content="The fastest path to participating in democracy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />

      <main style={defaultMainContainer}>

      </main>
    
        <Footer />
    </div>
  )
}
