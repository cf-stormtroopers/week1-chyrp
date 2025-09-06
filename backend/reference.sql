-- ====================================
-- Chyrp-like Blog Schema (PostgreSQL)
-- ====================================
-- Enable pgcrypto for UUID generation if not already enabled
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
--
-- 1. Users and Authentication
--
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users (username);

CREATE INDEX idx_users_email ON users (email);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

--
-- 2. Core Blog Content (Posts & Feathers)
--
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    feather_type VARCHAR(50) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft' NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_private BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0
);

CREATE INDEX idx_posts_author_id ON posts (author_id);

CREATE INDEX idx_posts_status_published_at ON posts (status, published_at DESC);

CREATE INDEX idx_posts_feather_type ON posts (feather_type);

CREATE TABLE post_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID UNIQUE NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT,
    markdown_content TEXT,
    raw_markup TEXT,
    media_url VARCHAR(255),
    media_thumbnail_url VARCHAR(255),
    media_type VARCHAR(50),
    quote_source VARCHAR(255),
    quote_url VARCHAR(255),
    link_url VARCHAR(255),
    embed_code TEXT,
    attribution VARCHAR(255),
    copyright VARCHAR(255),
    CONSTRAINT chk_post_data_content_or_media CHECK (
        content IS NOT NULL
        OR media_url IS NOT NULL
        OR link_url IS NOT NULL
        OR embed_code IS NOT NULL
    )
);

CREATE TABLE post_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    file_url VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_size INT,
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_files_post_id ON post_files (post_id);

--
-- 3. Modules & Enhancements
--
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE post_categories (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE
    SET
        NULL,
        author_name VARCHAR(100),
        author_email VARCHAR(255),
        author_url VARCHAR(255),
        content TEXT NOT NULL,
        parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        ip_address INET
);

CREATE INDEX idx_comments_post_id ON comments (post_id);

CREATE INDEX idx_comments_parent_comment_id ON comments (parent_comment_id);

CREATE INDEX idx_comments_status ON comments (status);

CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure uniqueness (one like per post per user/IP)
CREATE UNIQUE INDEX unique_like_per_user_post ON likes (post_id, user_id)
WHERE
    user_id IS NOT NULL;

CREATE UNIQUE INDEX unique_like_per_ip_post ON likes (post_id, ip_address)
WHERE
    user_id IS NULL
    AND ip_address IS NOT NULL;

CREATE INDEX idx_likes_post_id ON likes (post_id);

CREATE INDEX idx_likes_user_id ON likes (user_id);

CREATE TABLE webmentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    source_url VARCHAR(255) NOT NULL,
    target_url VARCHAR(255) NOT NULL,
    mention_type VARCHAR(50),
    content TEXT,
    author_name VARCHAR(255),
    author_url VARCHAR(255),
    author_photo VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_webmention_source_target UNIQUE (source_url, target_url)
);

CREATE INDEX idx_webmentions_post_id ON webmentions (post_id);

CREATE INDEX idx_webmentions_source_url ON webmentions (source_url);

--
-- 4. System & Configuration
--
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    type VARCHAR(50)
);

INSERT INTO
    settings (key, value, description, type)
VALUES
    (
        'blog_title',
        'My Modern Chyrp Blog',
        'The title of the blog.',
        'string'
    ),
    (
        'posts_per_page',
        '10',
        'Number of posts to display per page.',
        'integer'
    ),
    (
        'default_theme',
        'default',
        'The slug of the currently active theme.',
        'string'
    ),
    (
        'comments_moderation_required',
        'true',
        'Whether comments require moderation before appearing.',
        'boolean'
    );

CREATE TABLE themes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    version VARCHAR(20),
    author VARCHAR(100),
    is_active BOOLEAN DEFAULT FALSE
);

CREATE TABLE extensions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    version VARCHAR(20),
    is_active BOOLEAN DEFAULT FALSE,
    config JSONB
);