import NextImage from 'next/image'

/** @type {import('next/image').ImageLoader} */
const cloudflareLoader = ({src, width, quality}) => {
  const params = [`width=${width}`]
  if (quality) params.push(`quality=${quality}`)

  const paramsString = params.join(',')
  const normalizedSrc = src[0] === '/' ? src.slice(1) : src

  return `/cdn-cgi/image/${paramsString}/${normalizedSrc}`
}

export const Image = (props) => <NextImage layout="responsive" loader={cloudflareLoader} {...props} />
