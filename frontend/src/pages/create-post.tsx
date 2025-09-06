"use client";
import { useLocation } from "wouter";
import { createPostPostsPost, uploadFilesUploadPost, type PostCreate } from "../api/generated";
import type { AxiosError } from "axios";
import PostEdit from "../components/PostEdit";

const EmptyPost = undefined;

export default function CreatePostPage() {
  const [, setLocation] = useLocation();

  const handlePublish = async () => {
    alert("Post published!");
    setLocation("/");
  };

  const handleSave = async (data: PostCreate, files: { photoFile?: File; audioFile?: File; videoFile?: File }) => {
    try {
      const isFileUpload = data.feather_type === "photo" || data.feather_type === "uploader" || data.feather_type === "audio" || data.feather_type === "video";

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

      const res = await createPostPostsPost(data);
      if (res && res.id) {
        alert("Post created!");
        setTimeout(() => {
          setLocation(`/posts/${res.slug}`);
        }, 1000);
      }
    } catch (e: any | AxiosError) {
      console.log(e);
      alert("Failed to create post: " + (e?.response?.data?.message || e.message || "Unknown error"));
    }
  };

  const handleCancel = () => {
    setLocation("/");
  };

  return (
    <PostEdit
      post={EmptyPost}
      onSave={handleSave}
      onPublish={handlePublish}
      onCancel={handleCancel}
      mode="create"
    />
  );
}