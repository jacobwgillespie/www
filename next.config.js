const withOffline = require('next-offline')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  async redirects() {
    return [
      // Service worker
      {source: '/sw.js', destination: '/service-worker.js', permanent: true},

      // Renamed pages
      {source: '/hardware-and-software', destination: '/uses', permanent: true},

      // Redirects from old Medium site
      {
        source: '/from-rest-to-graphql-b4e95e94c26b',
        destination: '/2015-10-09-from-rest-to-graphql',
        permanent: true,
      },
      {
        source: '/building-basicman-co-static-dynamic-application-architecture-55f9f8021eaf',
        destination: '/2016-05-01-building-basicman-co-static-dynamic-application-architecture',
        permanent: true,
      },
      {
        source: '/replacing-react-with-rails-66e25cd23777',
        destination: '/2016-10-05-replacing-react-with-rails',
        permanent: true,
      },
      {
        source: '/seo-basics-for-photographers-868fc007f91',
        destination: '/2016-10-07-seo-basics-for-photographers',
        permanent: true,
      },
    ]
  },

  async rewrites() {
    return [{source: '/service-worker.js', destination: '/_next/static/service-worker.js'}]
  },

  images: {
    loader: 'custom',
  },

  workboxOpts: {
    swDest: process.env.NEXT_EXPORT ? 'service-worker.js' : 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {maxEntries: 200},
        },
      },
    ],
  },
}

module.exports = withOffline(nextConfig)
