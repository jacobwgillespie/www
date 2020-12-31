import React from 'react'
import styled from 'styled-components'
import {getAllPages, getAllPosts, getPageBySlug, getPostBySlug} from '../src/posts'
import {DateElement} from '../src/components/DateElement'
import {Layout} from '../src/components/Layout'
import {SEO} from '../src/components/SEO'
import hydrate from 'next-mdx-remote/hydrate'
import Image from 'next/image'

const Title = styled.h1`
  margin-top: 0;
`

export const getStaticProps = async ({params}) => {
  try {
    const post = await getPostBySlug(params.slug)
    return {props: {post}}
  } catch {
    const post = await getPageBySlug(params.slug)
    return {props: {post}}
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts()
  const pages = await getAllPages()

  const all = posts.concat(...pages)

  return {
    paths: all.map((post) => {
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
  const hydratedContent = hydrate(post.content, {components: {Image: Image}})
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
        <div itemProp="articleBody">{hydratedContent}</div>
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
