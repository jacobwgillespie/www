import {MDXRemote} from 'next-mdx-remote'
import React from 'react'
import {Image} from '../src/components/Image'
import {SEO} from '../src/components/SEO'
import {getAllPages, getAllPosts, getPageBySlug, getPostBySlug} from '../src/posts'

export const getStaticProps = async ({params}) => {
  try {
    const post = await getPostBySlug(params.slug)
    return {props: {post}}
  } catch {
    const post = await getPageBySlug(params.slug)
    return {props: {post}}
  }
}

const components = {img: Image}

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
  return (
    <>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <article itemScope itemType="http://schema.org/BlogPosting" className="max-w-2xl leading-7 prose prose-lg">
        {post.frontmatter.dateISO && (
          <div itemProp="datePublished">
            <time dateTime={post.frontmatter.dateISO}>{post.frontmatter.date}</time>
          </div>
        )}
        <h1 itemProp="headline">{post.frontmatter.title}</h1>
        <div itemProp="articleBody">
          <MDXRemote {...post.content} components={components} />
        </div>
      </article>
    </>
  )
}

export default Page
