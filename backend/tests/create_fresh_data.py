#!/usr/bin/env python3
"""
Sample Data Generator Script - FRESH VERSION
Creates realistic blog data in the database (clears existing data first)
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from datetime import datetime, timedelta
from sqlmodel import Session, create_engine, SQLModel, select
from passlib.context import CryptContext

from backend.config.settings import settings as app_settings
from backend.models import *

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def clear_all_data(session: Session):
    """Clear all existing data"""
    print("🧹 Clearing existing data...")
    
    # Delete in reverse order of dependencies
    session.query(PostTag).delete()
    session.query(Like).delete()
    session.query(Comment).delete()
    session.query(Extension).delete()
    session.query(Theme).delete()
    session.query(Setting).delete()
    session.query(Post).delete()
    session.query(Tag).delete()
    session.query(Category).delete()
    session.query(UserSession).delete()
    session.query(User).delete()
    session.query(Role).delete()
    
    session.commit()
    print("✅ Cleared existing data")

def create_sample_data():
    """Create comprehensive sample data for the blog"""
    
    # Create engine and session
    database_url = app_settings.database_url
    engine = create_engine(database_url)
    
    # Create all tables
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        print("🚀 Creating fresh sample data...")
        
        # Clear existing data first
        clear_all_data(session)
        
        # Create roles
        print("📝 Creating roles...")
        admin_role = Role(name="admin", description="Administrator role")
        user_role = Role(name="user", description="Regular user role")
        
        session.add(admin_role)
        session.add(user_role)
        session.commit()
        session.refresh(admin_role)
        session.refresh(user_role)
        
        # Create users
        print("👤 Creating users...")
        admin_user = User(
            username="admin",
            email="admin@blog.com",
            password_hash=hash_password("admin123"),
            display_name="Admin User"
        )
        
        user1 = User(
            username="john_doe",
            email="john@example.com",
            password_hash=hash_password("password123"),
            display_name="John Doe",
            bio="Software developer passionate about Python and web technologies"
        )
        
        user2 = User(
            username="jane_smith",
            email="jane@example.com",
            password_hash=hash_password("password123"),
            display_name="Jane Smith",
            bio="Tech enthusiast and remote work advocate"
        )
        
        user3 = User(
            username="tech_writer",
            email="writer@tech.com",
            password_hash=hash_password("password123"),
            display_name="Tech Writer",
            bio="Technical writer specializing in AI and programming tutorials"
        )
        
        session.add_all([admin_user, user1, user2, user3])
        session.commit()
        session.refresh(admin_user)
        session.refresh(user1)
        session.refresh(user2)
        session.refresh(user3)
        
        # Create user-role associations
        print("🔐 Creating user-role associations...")
        admin_user_role = UserRole(user_id=admin_user.id, role_id=admin_role.id)
        user1_role = UserRole(user_id=user1.id, role_id=user_role.id)
        user2_role = UserRole(user_id=user2.id, role_id=user_role.id)
        user3_role = UserRole(user_id=user3.id, role_id=user_role.id)
        
        session.add_all([admin_user_role, user1_role, user2_role, user3_role])
        session.commit()
        
        # Create categories
        print("📂 Creating categories...")
        tech_cat = Category(name="Technology", slug="technology", description="Tech-related posts")
        ai_cat = Category(name="Artificial Intelligence", slug="ai", description="AI and ML content")
        startup_cat = Category(name="Startups", slug="startups", description="Startup stories and advice")
        remote_cat = Category(name="Remote Work", slug="remote-work", description="Remote work tips and insights")
        web_dev_cat = Category(name="Web Development", slug="web-development", description="Web development tutorials")
        
        session.add_all([tech_cat, ai_cat, startup_cat, remote_cat, web_dev_cat])
        session.commit()
        session.refresh(tech_cat)
        session.refresh(ai_cat)
        session.refresh(startup_cat)
        session.refresh(remote_cat)
        session.refresh(web_dev_cat)
        
        # Create tags
        print("🏷️ Creating tags...")
        tag_data = [
            ("Python", "python", "Python programming language"),
            ("JavaScript", "javascript", "JavaScript programming"),
            ("FastAPI", "fastapi", "FastAPI web framework"),
            ("React", "react", "React frontend library"),
            ("Machine Learning", "machine-learning", "Machine Learning concepts"),
            ("Blockchain", "blockchain", "Blockchain technology"),
            ("DevOps", "devops", "DevOps practices"),
            ("Productivity", "productivity", "Productivity tips"),
            ("Tutorial", "tutorial", "Step-by-step tutorials"),
            ("Career", "career", "Career advice"),
            ("Startup Life", "startup-life", "Startup experiences"),
            ("Remote Culture", "remote-culture", "Remote work culture")
        ]
        
        tags = []
        for tag_name, tag_slug, tag_desc in tag_data:
            tag = Tag(name=tag_name, slug=tag_slug, description=tag_desc)
            tags.append(tag)
        
        session.add_all(tags)
        session.commit()
        for tag in tags:
            session.refresh(tag)
        
        # Create blog posts
        print("📰 Creating blog posts...")
        
        posts = []
        post_data = []
        
        # Post 1: FastAPI Tutorial
        post1 = Post(
            title="Building Modern APIs with FastAPI",
            slug="building-modern-apis-fastapi",
            feather_type="text",
            status=PostStatus.PUBLISHED,
            published=True,
            featured=True,
            author_id=admin_user.id,
            category_id=tech_cat.id,
            published_at=datetime.utcnow() - timedelta(days=7)
        )
        posts.append(post1)
        
        post1_data = PostData(
            post_id=post1.id,
            content="""# Building Modern APIs with FastAPI

FastAPI has revolutionized the way we build APIs in Python. With its incredible performance, automatic API documentation, and type safety, it's become the go-to choice for modern Python developers.

## Why FastAPI?

- **High Performance**: One of the fastest Python frameworks
- **Type Safety**: Built-in support for Python type hints  
- **Automatic Documentation**: Interactive API docs generated automatically
- **Easy to Learn**: Intuitive design based on standard Python

## Getting Started

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
```

Start building your next API with FastAPI today!""",
            markdown_content="Learn how to build high-performance APIs using FastAPI, one of the fastest Python web frameworks."
        )
        post_data.append(post1_data)
        
        # Post 2: AI Article
        post2 = Post(
            title="The Future of AI in Development",
            slug="future-ai-development",
            feather_type="text",
            status=PostStatus.PUBLISHED,
            published=True,
            featured=False,
            author_id=user3.id,
            category_id=ai_cat.id,
            published_at=datetime.utcnow() - timedelta(days=5)
        )
        posts.append(post2)
        
        post2_data = PostData(
            post_id=post2.id,
            content="""# The Future of AI in Development

AI is transforming how we write code, from automated testing to code generation. Here's what every developer should understand about AI's impact.

## Key Areas

### Code Generation
- GitHub Copilot and similar tools
- Faster prototyping
- Reduced boilerplate

### Testing
- Automated test case generation
- Bug prediction
- Edge case identification

## Preparing for the Future

1. Embrace AI tools while understanding limitations
2. Focus on higher-level problem solving
3. Develop AI literacy alongside programming skills

The future belongs to developers who collaborate effectively with AI.""",
            markdown_content="Artificial Intelligence is reshaping the tech landscape. Here's what developers need to know."
        )
        post_data.append(post2_data)
        
        # Post 3: Startup Story
        post3 = Post(
            title="From Idea to MVP in 3 Months",
            slug="idea-to-mvp-3-months",
            feather_type="text",
            status=PostStatus.PUBLISHED,
            published=True,
            featured=True,
            author_id=user1.id,
            category_id=startup_cat.id,
            published_at=datetime.utcnow() - timedelta(days=3)
        )
        posts.append(post3)
        
        post3_data = PostData(
            post_id=post3.id,
            content="""# From Idea to MVP in 3 Months

Three months ago, I had an idea. Today, I have a working MVP with paying customers. Here's the complete journey.

## The Journey

### Month 1: Research
- Validated problem with 50+ interviews
- Created wireframes and user stories
- Chose tech stack: FastAPI + React + PostgreSQL

### Month 2: Development
- Built core features
- Focused on simplicity
- Created landing page

### Month 3: Launch
- Beta testing with 10 users
- Gathered feedback and iterated
- Soft launch to small audience

## Key Lessons

1. **Start small**: Don't build everything at once
2. **Talk to users**: Constant feedback is crucial
3. **Embrace imperfection**: Done is better than perfect

Now comes the hard part: scaling and finding product-market fit!""",
            markdown_content="The complete story of building a startup MVP, including mistakes and lessons learned."
        )
        post_data.append(post3_data)
        
        # Post 4: Remote Work
        post4 = Post(
            title="5 Tools That Transformed My Remote Work",
            slug="5-tools-remote-work", 
            feather_type="text",
            status=PostStatus.PUBLISHED,
            published=True,
            featured=False,
            author_id=user2.id,
            category_id=remote_cat.id,
            published_at=datetime.utcnow() - timedelta(days=2)
        )
        posts.append(post4)
        
        post4_data = PostData(
            post_id=post4.id,
            content="""# 5 Tools That Transformed My Remote Work

After two years of remote work, I've found the perfect toolkit. These tools have transformed my productivity.

## The Tools

### 1. Notion - Ultimate Workspace
Replaced my need for multiple apps:
- Task management
- Note-taking
- Documentation
- Team wikis

### 2. Slack - Beyond Chat  
More than messaging:
- Automated workflows
- GitHub/Jira integration
- Project channels

### 3. Zoom - Video Excellence
Beyond meetings:
- Breakout rooms for collaboration
- Screen annotation features

### 4. Toggl - Time Awareness
Understanding time usage:
- Project tracking
- Productivity patterns
- Client billing

### 5. Spotify - The Right Soundtrack
Never underestimate good music:
- Focus playlists for deep work
- Upbeat music for routine tasks

The key isn't having the most tools—it's finding what works for YOUR workflow.""",
            markdown_content="These 5 tools completely changed how I work from home and boosted my productivity."
        )
        post_data.append(post4_data)
        
        # Post 5: React Tutorial
        post5 = Post(
            title="React Hooks: Complete Beginner Guide",
            slug="react-hooks-beginner-guide",
            feather_type="text", 
            status=PostStatus.PUBLISHED,
            published=True,
            featured=False,
            author_id=user3.id,
            category_id=web_dev_cat.id,
            published_at=datetime.utcnow() - timedelta(days=1)
        )
        posts.append(post5)
        
        post5_data = PostData(
            post_id=post5.id,
            content="""# React Hooks: Complete Beginner Guide

React Hooks revolutionized functional components. If you're still using classes, it's time to switch.

## Essential Hooks

### useState - Managing State

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### useEffect - Side Effects

```jsx
import React, { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>Seconds: {seconds}</div>;
}
```

## Best Practices

1. Always specify dependencies for useEffect
2. Extract custom hooks for reusable logic
3. Keep it simple where props would work

React Hooks make functional components more powerful than ever!""",
            markdown_content="Master React Hooks with this comprehensive guide. Learn useState, useEffect, and custom hooks."
        )
        post_data.append(post5_data)
        
        session.add_all(posts)
        session.commit()
        
        # Refresh posts to get IDs and then add PostData
        for post in posts:
            session.refresh(post)
        
        session.add_all(post_data)
        session.commit()
        
        # Create post-tag associations
        print("🔗 Creating post-tag associations...")
        post_tag_associations = [
            (post1, [tags[0], tags[2], tags[8]]),  # Python, FastAPI, Tutorial
            (post2, [tags[4], tags[9]]),  # ML, Career
            (post3, [tags[9], tags[10]]),  # Career, Startup Life
            (post4, [tags[7], tags[11]]),  # Productivity, Remote Culture
            (post5, [tags[1], tags[3], tags[8]]),  # JavaScript, React, Tutorial
        ]
        
        for post, post_tags in post_tag_associations:
            for tag in post_tags:
                post_tag = PostTag(post_id=post.id, tag_id=tag.id)
                session.add(post_tag)
        
        session.commit()
        
        # Create comments
        print("💬 Creating comments...")
        comments = [
            Comment(
                content="Great tutorial! FastAPI is amazing for building APIs quickly.",
                author_id=user1.id,
                post_id=post1.id,
                is_approved=True,
                created_at=datetime.utcnow() - timedelta(hours=12)
            ),
            Comment(
                content="Thanks for the detailed examples. The automatic docs are a game-changer!",
                author_id=user2.id,
                post_id=post1.id,
                is_approved=True,
                created_at=datetime.utcnow() - timedelta(hours=8)
            ),
            Comment(
                content="Really insightful article about AI's impact. Code generation tools are changing everything.",
                author_id=user1.id,
                post_id=post2.id,
                is_approved=True,
                created_at=datetime.utcnow() - timedelta(hours=6)
            ),
            Comment(
                content="Inspiring story! How did you handle the technical challenges in month 2?",
                author_id=user3.id,
                post_id=post3.id,
                is_approved=True,
                created_at=datetime.utcnow() - timedelta(hours=4)
            ),
            Comment(
                content="Notion is indeed a game-changer. Been using it for 6 months now!",
                author_id=user1.id,
                post_id=post4.id,
                is_approved=True,
                created_at=datetime.utcnow() - timedelta(hours=2)
            ),
            Comment(
                content="Perfect timing! Just starting to learn React hooks. This guide is exactly what I needed.",
                author_id=user2.id,
                post_id=post5.id,
                is_approved=True,
                created_at=datetime.utcnow() - timedelta(hours=1)
            ),
        ]
        
        session.add_all(comments)
        session.commit()
        
        # Create likes
        print("❤️ Creating likes...")
        likes = [
            Like(user_id=user1.id, post_id=post1.id),
            Like(user_id=user2.id, post_id=post1.id),
            Like(user_id=user3.id, post_id=post2.id),
            Like(user_id=user1.id, post_id=post3.id),
            Like(user_id=user2.id, post_id=post3.id),
            Like(user_id=user3.id, post_id=post4.id),
            Like(user_id=user1.id, post_id=post5.id),
        ]
        
        session.add_all(likes)
        session.commit()
        
        # Create site settings
        print("⚙️ Creating site settings...")
        settings = [
            Setting(key="site_title", value="TechBlog Pro", description="Blog site title"),
            Setting(key="site_description", value="A modern blog about technology and programming", description="Site description"),
            Setting(key="site_url", value="https://techblog.pro", description="Main site URL"),
            Setting(key="admin_email", value="admin@techblog.pro", description="Admin email"),
            Setting(key="posts_per_page", value="10", description="Posts per page"),
            Setting(key="comments_enabled", value="true", description="Enable comments"),
            Setting(key="registration_enabled", value="true", description="Allow registration"),
            Setting(key="google_analytics", value="GA-XXXXXXXX-X", description="Analytics ID"),
            Setting(key="social_twitter", value="https://twitter.com/techblogpro", description="Twitter URL"),
            Setting(key="social_github", value="https://github.com/techblogpro", description="GitHub URL"),
        ]
        
        session.add_all(settings)
        session.commit()
        
        # Create themes
        print("🎨 Creating themes...")
        themes = [
            Theme(
                name="default",
                display_name="Default Theme", 
                description="Clean default design",
                is_active=True,
                settings="{}"
            ),
            Theme(
                name="dark",
                display_name="Dark Theme",
                description="Dark mode for night reading", 
                is_active=False,
                settings='{"primary_color": "#1a1a1a"}'
            ),
            Theme(
                name="minimal",
                display_name="Minimal Theme",
                description="Clean minimal design",
                is_active=False, 
                settings='{"typography": "serif"}'
            ),
        ]
        
        session.add_all(themes)
        session.commit()
        
        # Create extensions
        print("🔌 Creating extensions...")
        extensions = [
            Extension(
                name="seo_optimizer",
                display_name="SEO Optimizer",
                description="Optimizes posts for search engines",
                is_enabled=True,
                version="1.2.0"
            ),
            Extension(
                name="social_share", 
                display_name="Social Share",
                description="Social media sharing buttons",
                is_enabled=True,
                version="2.1.0"
            ),
            Extension(
                name="analytics",
                display_name="Advanced Analytics", 
                description="Detailed visitor analytics",
                is_enabled=False,
                version="1.0.5"
            ),
        ]
        
        session.add_all(extensions)
        session.commit()
        
        print("✅ Sample data created successfully!")
        print(f"""
🎉 Your blog is ready with sample data!

Created:
  - 2 roles (admin, user)
  - 4 users
  - 5 categories  
  - 12 tags
  - 5 blog posts
  - 6 comments
  - 7 likes
  - 10 settings
  - 3 themes
  - 3 extensions

📝 Login credentials:
  - Admin: admin / admin123
  - Users: john_doe / password123, jane_smith / password123, tech_writer / password123
""")

if __name__ == "__main__":
    create_sample_data()
