import {graphql} from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import {DateElement} from '../components/DateElement'
import {Layout} from '../components/Layout'
import {SEO} from '../components/SEO'

const Title = styled.h1`
  margin-top: 0;
`

const Page = ({data, pageContext, location}) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <article itemScope itemType="http://schema.org/BlogPosting">
        {post.frontmatter.date && (
          <div itemProp="datePublished">
            <DateElement dateString={post.frontmatter.date} />
          </div>
        )}
        <Title itemProp="headline">{post.frontmatter.title}</Title>

        <div itemProp="articleBody" dangerouslySetInnerHTML={{__html: post.html}} />
      </article>
    </Layout>
  )
}

export default Page

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: {slug: {eq: $slug}}) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date
        description
      }
    }
  }
`
