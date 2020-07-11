const path = require(`path`)
const {createFilePath} = require(`gatsby-source-filesystem`)

exports.createPages = async ({graphql, actions}) => {
  const {createPage, createRedirect} = actions

  // Redirect old service worker
  createRedirect({
    fromPath: '/service-worker.js',
    toPath: '/sw.js',
    isPermanent: true,
  })

  // Redirects from old Medium site
  createRedirect({
    fromPath: '/from-rest-to-graphql-b4e95e94c26b',
    toPath: '/2015-10-09-from-rest-to-graphql',
    isPermanent: true,
  })
  createRedirect({
    fromPath: '/building-basicman-co-static-dynamic-application-architecture-55f9f8021eaf',
    toPath: '/2016-05-01-building-basicman-co-static-dynamic-application-architecture',
    isPermanent: true,
  })
  createRedirect({
    fromPath: '/replacing-react-with-rails-66e25cd23777',
    toPath: '/2016-10-05-replacing-react-with-rails',
    isPermanent: true,
  })
  createRedirect({
    fromPath: '/seo-basics-for-photographers-868fc007f91',
    toPath: '/2016-10-07-seo-basics-for-photographers',
    isPermanent: true,
  })

  const pageTemplate = path.resolve(`./src/templates/Page.js`)
  const result = await graphql(
    `
      {
        blog: allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}, limit: 1000) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                slug
              }
              parent {
                ... on File {
                  sourceInstanceName
                }
              }
            }
          }
        }
      }
    `,
  )

  if (result.errors) {
    throw result.errors
  }

  // Create pages
  const posts = result.data.blog.edges
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node
    const slug = post.node.frontmatter.slug ?? post.node.fields.slug
    if (slug === '/') return

    createPage({
      path: slug,
      component: pageTemplate,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })
}

exports.onCreateNode = ({node, actions, getNode}) => {
  const {createNodeField} = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({node, getNode})
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
