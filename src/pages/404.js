import {graphql} from 'gatsby'
import React from 'react'
import {Layout} from '../components/Layout'
import {SEO} from '../components/SEO'

const NotFoundPage = ({data, location}) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="404: Not Found" />
      <p>404, page not found</p>
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
