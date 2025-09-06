import { useParams, useLocation } from "wouter";
import Layout from "../components/Layout";
import PostView from "../components/PostView";
import {
  deletePostPostsPostIdDelete,
  likePostPostsPostIdLikePost,
  updatePostPostsPostIdPut,
  uploadFilesUploadPost,
  useGetPostPostsSlugGet,
  type PostCreate,
  type PostUpdate,
} from "../api/generated";
import { useState } from "react";
import PostEdit from "../components/PostEdit";
import type { AxiosError } from "axios";
import { useAuthStore } from "../state/auth";

export default function PostPage() {
  const authStore = useAuthStore();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [, setLocation] = useLocation();

  const { data: post, isLoading, error, mutate } = useGetPostPostsSlugGet(slug);
  const [editing, setEditing] = useState(false);

  async function like() {
    if (!post) return;
    try {
      likePostPostsPostIdLikePost(post.id);
    } catch (e) {
      console.error("Failed to like post", e);
    }
  }

  async function handleDelete() {
    const ok = confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!ok || !post) return;

    try {
      await deletePostPostsPostIdDelete(post.id);
      alert("Post deleted");
      setLocation("/");
    } catch (e) {
      console.error("Failed to delete post", e);
      alert("Failed to delete post");
    }
  }

  async function handleSave(
    data: PostCreate,
    files: { photoFile?: File; audioFile?: File; videoFile?: File }
  ) {
    try {
      const isFileUpload =
        data.feather_type === "photo" ||
        data.feather_type === "uploader" ||
        data.feather_type === "audio" ||
        data.feather_type === "video";

      if (isFileUpload) {
        const filesToUpload = [];
        if (files.photoFile) filesToUpload.push(files.photoFile);
        if (files.audioFile) filesToUpload.push(files.audioFile);
        if (files.videoFile) filesToUpload.push(files.videoFile);

        if (filesToUpload.length > 0) {
          const res = await uploadFilesUploadPost({
            files: filesToUpload,
            post_id: null,
          });
          if (res && res.length > 0) {
            const fileId = res[0].id;
            data.media_url = `/upload/${fileId}/download`;
          } else {
            alert("File upload failed");
            return;
          }
        }
      }

      const res = await updatePostPostsPostIdPut(post!.id, data as PostUpdate);
      if (res && res.id) {
        alert("Post updated!");
        mutate();
        setTimeout(() => {
          mutate();
          setEditing(false);
        }, 1000);
      }
    } catch (e: any | AxiosError) {
      console.log(e);
      alert(
        "Failed to create post: " +
          (e?.response?.data?.message || e.message || "Unknown error")
      );
    }
  }

  if (error) {
    return (
      <Layout>
        <p>{JSON.stringify(error)}</p>
      </Layout>
    );
  }

  if (isLoading || !post) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  if (editing) {
    return (
      <Layout>
        <PostEdit
          mode="edit"
          onPublish={async () => {}}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          post={post}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {post.author_id === authStore.accountInformation?.id && (
        <div className="flex justify-end w-full">
          <button
            onClick={() => setEditing(true)}
            className="mb-4 px-4 py-2 bg-black text-white w-auto rounded hover:bg-[rgb(162,213,198)] hover:text-black transition"
          >
            Edit Post
          </button>
        </div>
      )}

      <PostView post={post} handleLike={() => like()} />

      {post.author_id === authStore.accountInformation?.id && (
        <div className="flex justify-end w-full">
          <button
            onClick={handleDelete}
            className="mb-4 px-4 py-2 bg-black text-white w-auto rounded hover:bg-[rgb(162,213,198)] hover:text-black transition"
          >
            Delete Post
          </button>
          <button
        onClick={() => setLocation("/")}
        className="fixed bottom-6 right-6 px-6 py-3 rounded-full bg-secondary text-dark font-semibold shadow-lg hover:primary transition"
      >
        ⬅ Home
      </button>

        </div>
      )}
    </Layout>
  );
}
