#!/usr/bin/env python3
"""
SIMPLE Sample Data Creator
Uses the existing test infrastructure to create sample data
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from datetime import datetime, timedelta
from sqlmodel import Session, create_engine, SQLModel, select
from passlib.context import CryptContext

from backend.config.settings import settings as app_settings
from backend.models import *
from backend.models.post import PostStatus
from backend.models.comment import CommentStatus

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_sample_data():
    """Create simple sample data for the blog"""
    
    # Create engine and session
    database_url = app_settings.database_url
    engine = create_engine(database_url)
    
    # Create all tables
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        print("🚀 Creating simple sample data...")
        
        # Create roles if they don't exist
        print("📝 Creating roles...")
        admin_role = session.exec(select(Role).where(Role.name == "admin")).first()
        if not admin_role:
            admin_role = Role(name="admin", description="Administrator role")
            session.add(admin_role)
            session.commit()
            session.refresh(admin_role)
        
        user_role = session.exec(select(Role).where(Role.name == "user")).first()
        if not user_role:
            user_role = Role(name="user", description="Regular user role")
            session.add(user_role)
            session.commit()
            session.refresh(user_role)
        
        # Create users if they don't exist  
        print("👤 Creating users...")
        admin_user = session.exec(select(User).where(User.username == "admin")).first()
        if not admin_user:
            admin_user = User(
                username="admin",
                email="admin@blog.com", 
                password_hash=hash_password("admin123"),
                display_name="Admin User"
            )
            session.add(admin_user)
            session.commit()
            session.refresh(admin_user)
        
        user1 = session.exec(select(User).where(User.username == "john_doe")).first()
        if not user1:
            user1 = User(
                username="john_doe",
                email="john@example.com",
                password_hash=hash_password("password123"),
                display_name="John Doe",
                bio="Software developer"
            )
            session.add(user1)
            session.commit()
            session.refresh(user1)
        
        # Create user-role associations if they don't exist
        print("🔐 Creating user-role associations...")
        admin_user_role = session.exec(select(UserRole).where(
            UserRole.user_id == admin_user.id,
            UserRole.role_id == admin_role.id
        )).first()
        if not admin_user_role:
            admin_user_role = UserRole(user_id=admin_user.id, role_id=admin_role.id)
            session.add(admin_user_role)
        
        user1_role = session.exec(select(UserRole).where(
            UserRole.user_id == user1.id,
            UserRole.role_id == user_role.id
        )).first()
        if not user1_role:
            user1_role = UserRole(user_id=user1.id, role_id=user_role.id)
            session.add(user1_role)
        
        session.commit()
        
        # Create categories if they don't exist
        print("� Creating categories...")  
        tech_cat = session.exec(select(Category).where(Category.slug == "technology")).first()
        if not tech_cat:
            tech_cat = Category(name="Technology", slug="technology", description="Tech posts")
            session.add(tech_cat)
            session.commit()
            session.refresh(tech_cat)
        
        # Create tags if they don't exist
        print("🏷️ Creating tags...")
        python_tag = session.exec(select(Tag).where(Tag.slug == "python")).first()
        if not python_tag:
            python_tag = Tag(name="Python", slug="python", description="Python programming")
            session.add(python_tag)
            session.commit()
            session.refresh(python_tag)
            
        tutorial_tag = session.exec(select(Tag).where(Tag.slug == "tutorial")).first()
        if not tutorial_tag:
            tutorial_tag = Tag(name="Tutorial", slug="tutorial", description="Tutorials")
            session.add(tutorial_tag)
            session.commit()
            session.refresh(tutorial_tag)
        
        # Create a simple post if it doesn't exist
        print("📰 Creating a sample blog post...")
        post1 = session.exec(select(Post).where(Post.slug == "welcome-to-techblog-pro")).first()
        if not post1:
            post1 = Post(
                title="Welcome to TechBlog Pro", 
                slug="welcome-to-techblog-pro",
                feather_type="text",
                status=PostStatus.PUBLISHED,
                author_id=admin_user.id,
                published_at=datetime.utcnow() - timedelta(days=1)
            )
            session.add(post1)
            session.commit()
            session.refresh(post1)
            
            # Create post data
            post1_data = PostData(
                post_id=post1.id,
                content="""# Welcome to TechBlog Pro!

This is your new blog powered by FastAPI and modern web technologies.

## Features

- Fast and modern blog engine
- User authentication and roles
- Categories and tags
- Comments and likes
- Themes and extensions

## Getting Started

1. Login with admin credentials
2. Create your first post
3. Customize your blog settings
4. Start writing amazing content!

Happy blogging! 🎉""",
                markdown_content="Welcome to your new blog! Get started with creating amazing content."
            )
            session.add(post1_data)
            session.commit()
            
            # Create post-tag associations
            post_tag1 = PostTag(post_id=post1.id, tag_id=tutorial_tag.id)
            session.add(post_tag1)
            session.commit()
        
        # Create a comment if it doesn't exist
        print("💬 Creating sample comment...")
        comment1 = session.exec(select(Comment).where(Comment.post_id == post1.id)).first()
        if not comment1:
            comment1 = Comment(
                content="Great start to the blog! Looking forward to more content.",
                author_id=user1.id,
                post_id=post1.id,
                status=CommentStatus.APPROVED
            )
            session.add(comment1)
            session.commit()
        
        # Create a like if it doesn't exist
        print("❤️ Creating sample like...")
        try:
            like1 = Like(
                user_id=user1.id,
                post_id=post1.id
            )
            session.add(like1)
            session.commit()
        except Exception as e:
            print(f"Note: Like might already exist ({e})")
            session.rollback()
        
        # Create basic settings if they don't exist
        print("⚙️ Creating basic settings...")
        basic_settings = [
            ("site_title", "TechBlog Pro", "Blog site title"),
            ("site_description", "A modern blog powered by FastAPI", "Site description"),
            ("posts_per_page", "10", "Posts per page"),
            ("comments_enabled", "true", "Enable comments"),
        ]
        
        for key, value, description in basic_settings:
            existing_setting = session.exec(select(Setting).where(Setting.key == key)).first()
            if not existing_setting:
                setting = Setting(key=key, value=value, description=description)
                session.add(setting)
        
        session.commit()
        
        # Create default theme if it doesn't exist
        print("🎨 Creating default theme...")
        default_theme = session.exec(select(Theme).where(Theme.slug == "default")).first()
        if not default_theme:
            default_theme = Theme(
                name="default",
                slug="default",
                version="1.0.0",
                author="TechBlog Pro",
                is_active=True
            )
            session.add(default_theme)
            session.commit()
        
        print("✅ Sample data created successfully!")
        print(f"""
🎉 Your blog is ready!

Created:
  - 2 roles (admin, user)
  - 2 users
  - 1 category  
  - 2 tags
  - 1 blog post
  - 1 comment
  - 1 like
  - 4 settings
  - 1 theme

📝 Login credentials:
  - Admin: admin / admin123
  - User: john_doe / password123

🚀 Your blog is now ready to use!
""")

if __name__ == "__main__":
    create_sample_data()
