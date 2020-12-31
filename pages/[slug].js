import React from 'react'
import styled from 'styled-components'
import {getAllPosts, getPostBySlug} from '../src/posts'
import {DateElement} from '../src/components/DateElement'
import {Layout} from '../src/components/Layout'
import {SEO} from '../src/components/SEO'

const Title = styled.h1`
  margin-top: 0;
`

export const getStaticProps = async ({params}) => {
  const post = await getPostBySlug(params.slug)
  return {props: {post}}
}

export async function getStaticPaths() {
  const posts = await getAllPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

const Page = ({post}) => {
  return (
    <Layout>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <article itemScope itemType="http://schema.org/BlogPosting">
        {post.frontmatter.dateISO && (
          <div itemProp="datePublished">
            <DateElement dateString={post.frontmatter.dateISO} />
          </div>
        )}
        <Title itemProp="headline">{post.frontmatter.title}</Title>

        <div itemProp="articleBody" dangerouslySetInnerHTML={{__html: post.content}} />
      </article>
    </Layout>
  )
}

export default Page

// export const pageQuery = graphql`
//   query PageBySlug($slug: String!) {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//     markdownRemark(fields: {slug: {eq: $slug}}) {
//       id
//       excerpt(pruneLength: 160)
//       html
//       frontmatter {
//         title
//         date
//         description
//       }
//     }
//   }
// `
