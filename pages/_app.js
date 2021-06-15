import 'tailwindcss/tailwind.css'
import {Layout} from '../src/components/Layout'
import '../src/custom.css'

function MyApp({Component, pageProps}) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
