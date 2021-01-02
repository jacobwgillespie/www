import 'tailwindcss/tailwind.css'
import '../src/custom.css'
import {Layout} from '../src/components/Layout'

function MyApp({Component, pageProps}) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
