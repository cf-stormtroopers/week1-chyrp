"use client";

import { useListPostsPostsGet } from "../api/generated";
import { useAuthStore } from "../state/auth";
import dayjs from "dayjs";
import Markdown from "react-markdown";
import Layout from "../components/Layout";
import { useState } from "react";
import { convertUrlToAbsolute } from "../api/axios";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";
import PostView from "../components/PostView";
import { Link } from "wouter";


export default function HomePage() {
  const authStore = useAuthStore();
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, error } = useListPostsPostsGet();
  const posts = data ?? [];

  // fuse.js search for posts by search text
  const filteredPosts = posts.filter((post) => {
    if (!searchText) return true;
    const lowerSearchText = searchText.toLowerCase();
    return (
      post.title?.toLowerCase().includes(lowerSearchText) ||
      post.content?.toLowerCase().includes(lowerSearchText) ||
      post.author_name?.toLowerCase().includes(lowerSearchText) ||
      post.tags?.some((tag) =>
        (tag.name as string).toLowerCase().includes(lowerSearchText)
      )
    );
  });

  return <Layout onSearchTextChange={setSearchText}>
    {isLoading && <p>Loading...</p>}
    {error && (
      <p>Failed with error {JSON.stringify(error)}</p>
    )}

    {filteredPosts.map((post) =>
      <Link key={post.id} to={`/post/${post.slug}`} className="mb-4"><PostView post={post} /></Link>)}
  </Layout>
}
