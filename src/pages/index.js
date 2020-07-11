import {graphql, Link} from 'gatsby'
import React from 'react'
import styled from 'styled-components'
import {DateElement} from '../components/DateElement'
import {Layout} from '../components/Layout'
import {SEO} from '../components/SEO'

const ListItem = styled.article`
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 9px;
  margin-bottom: 0.69444444em;
  width: 100%;
`

const BlogIndex = ({data, location}) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.edges.filter((edge) => edge.node.parent.sourceInstanceName === 'blog')

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Jacob Gillespie" description={data.content.frontmatter.description || data.content.excerpt} />
      <div dangerouslySetInnerHTML={{__html: data.content.html}} />
      <section>
        <h2>Posts</h2>
        {posts.map(({node}) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <ListItem key={node.fields.slug} itemScope itemType="http://schema.org/BlogPosting">
              <div itemProp="headline">
                <Link to={node.fields.slug}>{title}</Link>
              </div>
              <DateElement dateString={node.frontmatter.date} itemProp="datePublished" />
            </ListItem>
          )
        })}
      </section>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date
            title
          }
          parent {
            ... on File {
              sourceInstanceName
            }
          }
        }
      }
    }

    content: markdownRemark(fields: {slug: {eq: "/"}}) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        description
      }
    }
  }
`
