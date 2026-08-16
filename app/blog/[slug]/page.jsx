
import React, { use } from 'react'
import Link from "next/link";
import Image from "next/image";


import Comments from "/components/shop-elements/Comments";
import RelatedPosts from "/components/shop-elements/RelatedPosts";
import BlogView from "/components/shop-elements/BlogView";
import EmailSubscribe from "/components/EmailSubscribe";



import { getBlogPost } from "/lib/getBlogPost";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;


export async function generateMetadata({ params }) {
  const { slug } = await params; // ✅ await params
  const productResponse = await getBlogPost(slug);

  if (!productResponse) return { title: "Blog Not Found" };


  var postData = productResponse?.post;



  return {
    title: postData.title,
    description: postData.post_excerpt || postData.description?.slice(0, 160),
    openGraph: {
      title: postData.title,
      description: postData.post_excerpt || postData.post_excerpt?.slice(0, 160),
      url: `${appUrl}blog/${slug}`,
      images: [{ url: postData.post_thumbnail?.src, alt: postData.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: postData.title,
      description: postData.post_excerpt || postData.post_excerpt?.slice(0, 160),
      images: [postData.post_thumbnail?.src],
    },
  };
}





export default async function page({ params }) {
  const { slug } = await params; // ✅ await params


  const productResponse = await getBlogPost(slug);

  if (!productResponse) return { title: "Blog Not Found" };


  var postData = productResponse?.post;





  return (
    <div>

      <BlogView postData={postData} />


    </div>
  )
}

