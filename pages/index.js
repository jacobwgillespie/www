import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import {DateElement} from '../src/components/DateElement'
import {Layout} from '../src/components/Layout'
import {SEO} from '../src/components/SEO'
import {getAllPosts, getPageBySlug} from '../src/posts'
import hydrate from 'next-mdx-remote/hydrate'
import Image from 'next/image'

const ListItem = styled.article`
  display: grid;
  grid-template-columns: auto auto;
  grid-column-gap: 9px;
  margin-bottom: 0.69444444em;
  width: 100%;
`

export const getStaticProps = async () => {
  const posts = await getAllPosts()
  const page = await getPageBySlug('index')
  return {props: {posts, page}}
}

const BlogIndex = ({posts, page}) => {
  const hydratedContent = hydrate(page.content, {components: {Image: Image}})
  return (
    <Layout title="Jacob Gillespie">
      <SEO title="Jacob Gillespie" description={page.frontmatter.description} />
      <div>{hydratedContent}</div>
      <section>
        <h2>Posts</h2>
        {posts.map((post) => {
          const title = post.frontmatter.title || post.slug
          return (
            <ListItem key={post.slug} itemScope itemType="http://schema.org/BlogPosting">
              <div itemProp="headline">
                <Link href={`/${post.slug}`}>{title}</Link>
              </div>
              <DateElement dateString={post.frontmatter.dateISO} itemProp="datePublished" />
            </ListItem>
          )
        })}
      </section>
    </Layout>
  )
}

export default BlogIndex

// export const pageQuery = graphql`
//   query {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//     allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
//       edges {
//         node {
//           fields {
//             slug
//           }
//           frontmatter {
//             date
//             title
//           }
//           parent {
//             ... on File {
//               sourceInstanceName
//             }
//           }
//         }
//       }
//     }

//     content: markdownRemark(fields: {slug: {eq: "/"}}) {
//       id
//       excerpt(pruneLength: 160)
//       html
//       frontmatter {
//         title
//         description
//       }
//     }
//   }
// `
