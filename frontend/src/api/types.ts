// db_types.ts
// Auto-generated interfaces from your PostgreSQL schema.
// These mirror your tables for convenient typing on the frontend.

export interface User {
  id: string; // UUID
  username: string;
  email: string;
  password_hash: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: number;
  name: string;
  description?: string | null;
}

export interface UserRole {
  user_id: string; // UUID
  role_id: number;
}

export interface Permission {
  id: number;
  name: string;
  description?: string | null;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}

export interface Post {
  id: string; // UUID
  author_id: string; // UUID
  feather_type: string;
  slug: string;
  title?: string | null;
  status: "published" | "draft" | "pending" | "archived";
  published_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  is_private: boolean;
  view_count: number;
}

export interface PostData {
  id: string; // UUID
  post_id: string; // UUID
  content?: string | null;
  markdown_content?: string | null;
  raw_markup?: string | null;
  media_url?: string | null;
  media_thumbnail_url?: string | null;
  media_type?: string | null;
  quote_source?: string | null;
  quote_url?: string | null;
  link_url?: string | null;
  embed_code?: string | null;
  attribution?: string | null;
  copyright?: string | null;
}

export interface PostFile {
  id: string; // UUID
  post_id: string; // UUID
  file_url: string;
  filename: string;
  file_type?: string | null;
  file_size?: number | null;
  description?: string | null;
  uploaded_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface PostCategory {
  post_id: string; // UUID
  category_id: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface PostTag {
  post_id: string; // UUID
  tag_id: number;
}

export interface Comment {
  id: string; // UUID
  post_id: string; // UUID
  author_id?: string | null;
  author_name?: string | null;
  author_email?: string | null;
  author_url?: string | null;
  content: string;
  parent_comment_id?: string | null;
  status: "approved" | "pending" | "spam";
  created_at: Date;
  updated_at: Date;
  ip_address?: string | null; // INET
}

export interface Like {
  id: string; // UUID
  post_id: string; // UUID
  user_id?: string | null;
  ip_address?: string | null;
  created_at: Date;
}

export interface Webmention {
  id: string; // UUID
  post_id: string; // UUID
  source_url: string;
  target_url: string;
  mention_type?: string | null;
  content?: string | null;
  author_name?: string | null;
  author_url?: string | null;
  author_photo?: string | null;
  status: "approved" | "pending" | "spam";
  created_at: Date;
}

export interface Setting {
  id: number;
  key: string;
  value?: string | null;
  description?: string | null;
  type?: "string" | "boolean" | "integer" | "json" | null;
}

export interface Theme {
  id: number;
  name: string;
  slug: string;
  version?: string | null;
  author?: string | null;
  is_active: boolean;
}

export interface Extension {
  id: number;
  name: string;
  slug: string;
  version?: string | null;
  is_active: boolean;
  config?: Record<string, unknown> | null; // JSONB
}
