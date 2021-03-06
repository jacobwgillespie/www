import {MDXRemote} from 'next-mdx-remote'
import Link from 'next/link'
import React from 'react'
import {Image} from '../src/components/Image'
import {SEO} from '../src/components/SEO'
import {getAllPosts, getPageBySlug} from '../src/posts'

export const getStaticProps = async () => {
  const posts = await getAllPosts()
  const page = await getPageBySlug('index')
  return {props: {posts, page}}
}

const components = {img: Image}

const BlogIndex = ({posts, page}) => {
  return (
    <>
      <SEO title="Jacob Gillespie" description={page.frontmatter.description} />
      <div className="max-w-2xl leading-7 prose prose-lg">
        <MDXRemote {...page.content} components={components} />
      </div>
      <section className="max-w-2xl pt-8 mt-8 space-y-2 border-t border-gray-200">
        <h2 className="text-lg font-semibold tracking-tight">Posts</h2>
        {posts.map((post) => {
          const title = post.frontmatter.title || post.slug
          return (
            <article
              key={post.slug}
              itemScope
              itemType="http://schema.org/BlogPosting"
              className="flex items-baseline justify-between"
            >
              <Link href={`/${post.slug}`}>
                <a itemProp="headline" className="text-lg text-blue-600">
                  {title}
                </a>
              </Link>
              <time itemProp="datePublished" className="text-xs whitespace-nowrap" dateTime={post.frontmatter.dateISO}>
                {post.frontmatter.date}
              </time>
            </article>
          )
        })}
      </section>
    </>
  )
}

export default BlogIndex
