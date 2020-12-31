module.exports = {
  async redirects() {
    return [
      // Redirect old service worker
      {
        source: '/service-worker.js',
        destination: '/sw.js',
        permanent: true,
      },

      // Renamed pages
      {
        source: '/hardware-and-software',
        destination: '/uses',
        permanent: true,
      },

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
}
