#!/usr/bin/env python3
"""
Sample Data Generator Script
Creates realistic blog data in the database
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

import asyncio
from datetime import datetime, timedelta
from sqlmodel import Session, create_engine, select, SQLModel
from passlib.context import CryptContext

from backend.config.settings import settings as app_settings
from backend.models import *

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_sample_data():
    """Create comprehensive sample data for the blog"""
    
    # Create engine and session
    database_url = app_settings.database_url
    engine = create_engine(database_url)
    
    # Create all tables
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        print("🚀 Creating sample data...")
        
        # Create roles first
        print("📝 Creating roles...")
        
        # Check if roles already exist
        admin_role = session.exec(select(Role).where(Role.name == "admin")).first()
        if not admin_role:
            admin_role = Role(name="admin", description="Administrator role")
            session.add(admin_role)
        
        user_role = session.exec(select(Role).where(Role.name == "user")).first()
        if not user_role:
            user_role = Role(name="user", description="Regular user role")
            session.add(user_role)
        
        session.commit()
        session.refresh(admin_role)
        session.refresh(user_role)
        
        # Create users
        print("👤 Creating users...")
        
        # Check if admin user already exists
        admin_user = session.exec(select(User).where(User.username == "admin")).first()
        if not admin_user:
            admin_user = User(
                username="admin",
                email="admin@blog.com",
                hashed_password=hash_password("admin123"),
                first_name="Admin",
                last_name="User",
                is_active=True,
                role_id=admin_role.id
            )
            session.add(admin_user)
        
        user1 = session.exec(select(User).where(User.username == "john_doe")).first()
        if not user1:
            user1 = User(
                username="john_doe",
                email="john@example.com",
                hashed_password=hash_password("password123"),
                first_name="John",
                last_name="Doe",
                is_active=True,
                role_id=user_role.id
            )
            session.add(user1)
        
        user2 = session.exec(select(User).where(User.username == "jane_smith")).first()
        if not user2:
            user2 = User(
                username="jane_smith",
                email="jane@example.com",
                hashed_password=hash_password("password123"),
                first_name="Jane",
                last_name="Smith",
                is_active=True,
                role_id=user_role.id
            )
            session.add(user2)
        
        user3 = session.exec(select(User).where(User.username == "tech_writer")).first()
        if not user3:
            user3 = User(
                username="tech_writer",
                email="writer@tech.com",
                hashed_password=hash_password("password123"),
                first_name="Tech",
                last_name="Writer",
                is_active=True,
                role_id=user_role.id
            )
            session.add(user3)
        
        session.commit()
        session.refresh(admin_user)
        session.refresh(user1)
        session.refresh(user2)
        session.refresh(user3)
        
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
        tags_data = [
            ("python", "Python programming language"),
            ("javascript", "JavaScript programming"),
            ("fastapi", "FastAPI web framework"),
            ("react", "React frontend library"),
            ("machine-learning", "Machine Learning concepts"),
            ("blockchain", "Blockchain technology"),
            ("devops", "DevOps practices"),
            ("productivity", "Productivity tips"),
            ("tutorial", "Step-by-step tutorials"),
            ("career", "Career advice"),
            ("startup-life", "Startup experiences"),
            ("remote-culture", "Remote work culture")
        ]
        
        tags = []
        for tag_name, tag_desc in tags_data:
            tag = Tag(name=tag_name, slug=tag_name, description=tag_desc)
            tags.append(tag)
        
        session.add_all(tags)
        session.commit()
        for tag in tags:
            session.refresh(tag)
        
        # Create posts with real content
        print("📰 Creating blog posts...")
        
        # Post 1: Tech Tutorial
        post1 = Post(
            title="Building Modern APIs with FastAPI and Python",
            slug="building-modern-apis-fastapi-python",
            excerpt="Learn how to build high-performance APIs using FastAPI, one of the fastest Python web frameworks available today.",
            content="""# Building Modern APIs with FastAPI and Python

FastAPI has revolutionized the way we build APIs in Python. With its incredible performance, automatic API documentation, and type safety, it's become the go-to choice for modern Python developers.

## Why FastAPI?

- **High Performance**: One of the fastest Python frameworks available
- **Type Safety**: Built-in support for Python type hints
- **Automatic Documentation**: Interactive API docs generated automatically
- **Easy to Learn**: Intuitive design based on standard Python type hints

## Getting Started

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
```

## Advanced Features

FastAPI comes with many advanced features out of the box:
- Request validation
- Dependency injection
- Background tasks
- WebSocket support

Start building your next API with FastAPI today!""",
            published=True,
            featured=True,
            author_id=admin_user.id,
            category_id=tech_cat.id,
            published_at=datetime.utcnow() - timedelta(days=7)
        )
        
        # Post 2: AI Content
        post2 = Post(
            title="The Future of AI: What Developers Need to Know",
            slug="future-ai-developers-guide",
            excerpt="Artificial Intelligence is reshaping the tech landscape. Here's what every developer should understand about AI's impact on software development.",
            content="""# The Future of AI: What Developers Need to Know

Artificial Intelligence isn't just a buzzword anymore—it's fundamentally changing how we approach software development. From code generation to automated testing, AI is becoming an integral part of the developer toolkit.

## AI in Development

### Code Generation
Tools like GitHub Copilot and ChatGPT are transforming how we write code:
- Faster prototyping
- Reduced boilerplate code
- Learning new languages and frameworks

### Automated Testing
AI-powered testing tools can:
- Generate test cases automatically
- Identify edge cases humans might miss
- Predict potential bugs before they occur

## Preparing for the AI Future

As developers, we need to:
1. Embrace AI tools while understanding their limitations
2. Focus on higher-level problem solving
3. Develop AI literacy alongside traditional programming skills

The future belongs to developers who can effectively collaborate with AI systems.""",
            published=True,
            featured=False,
            author_id=user3.id,
            category_id=ai_cat.id,
            published_at=datetime.utcnow() - timedelta(days=5)
        )
        
        # Post 3: Startup Story
        post3 = Post(
            title="From Idea to MVP: My Startup Journey",
            slug="idea-to-mvp-startup-journey",
            excerpt="The story of how I went from a simple idea to a working MVP in 3 months, including all the mistakes and lessons learned along the way.",
            content="""# From Idea to MVP: My Startup Journey

Three months ago, I had an idea. Today, I have a working MVP with paying customers. Here's the complete story of my startup journey, including all the mistakes I made along the way.

## The Idea

It started with a simple frustration: managing client feedback was a nightmare. Email chains, scattered documents, and missed deadlines were killing productivity.

## The Build

### Month 1: Research and Planning
- Validated the problem with 50+ potential customers
- Created wireframes and user stories
- Chose the tech stack: FastAPI + React + PostgreSQL

### Month 2: Development Sprint
- Built the core features
- Focused on simplicity over complexity
- Created a basic landing page

### Month 3: Testing and Launch
- Beta testing with 10 friendly users
- Iterated based on feedback
- Soft launch to a small audience

## Key Lessons

1. **Start small**: Don't try to build everything at once
2. **Talk to users**: Constant feedback is crucial
3. **Embrace imperfection**: Done is better than perfect

## What's Next?

Now comes the hard part: scaling and finding product-market fit. But having a working MVP makes everything feel possible.

*Want to follow my journey? Connect with me on [Twitter](https://twitter.com) for regular updates.*""",
            published=True,
            featured=True,
            author_id=user1.id,
            category_id=startup_cat.id,
            published_at=datetime.utcnow() - timedelta(days=3)
        )
        
        # Post 4: Remote Work
        post4 = Post(
            title="5 Tools That Transformed My Remote Work Setup",
            slug="5-tools-transformed-remote-work-setup",
            excerpt="Working remotely can be challenging. Here are the 5 tools that completely changed how I work from home and boosted my productivity.",
            content="""# 5 Tools That Transformed My Remote Work Setup

After two years of remote work, I've finally found the perfect toolkit. These 5 tools have completely transformed my productivity and work-life balance.

## 1. Notion - The Ultimate Workspace

Notion replaced my need for:
- Task management apps
- Note-taking tools  
- Project documentation
- Team wikis

Everything lives in one place, accessible from anywhere.

## 2. Slack - Beyond Chat

Slack isn't just for messaging:
- Automated workflows with Slack apps
- Integration with GitHub, Jira, and more
- Custom channels for different projects

## 3. Zoom - Video Calls Done Right

While everyone knows Zoom for meetings, the breakout rooms and screen annotation features are game-changers for team collaboration.

## 4. Toggl - Time Awareness

Understanding where your time goes is crucial for remote workers. Toggl helps me:
- Track time spent on different projects
- Identify productivity patterns
- Bill clients accurately

## 5. Spotify - The Right Soundtrack

Never underestimate the power of good music:
- Focus playlists for deep work
- Upbeat music for routine tasks
- Nature sounds for calls

## The Setup That Works

The key isn't having the most tools—it's finding the right combination that works for YOUR workflow.

*What tools have transformed your remote work experience? Share in the comments below!*""",
            published=True,
            featured=False,
            author_id=user2.id,
            category_id=remote_cat.id,
            published_at=datetime.utcnow() - timedelta(days=2)
        )
        
        # Post 5: Web Development
        post5 = Post(
            title="React Hooks: A Complete Guide for Beginners",
            slug="react-hooks-complete-guide-beginners",
            excerpt="Master React Hooks with this comprehensive guide. Learn useState, useEffect, and custom hooks with practical examples.",
            content="""# React Hooks: A Complete Guide for Beginners

React Hooks revolutionized how we write React components. If you're still using class components, it's time to make the switch. This guide will get you up to speed.

## What Are React Hooks?

Hooks let you use state and other React features in functional components. They're:
- Easier to understand
- More reusable
- Better for testing

## Essential Hooks

### useState - Managing State

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
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
      setSeconds(seconds => seconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Seconds: {seconds}</div>;
}
```

## Custom Hooks

Create your own hooks for reusable logic:

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

## Best Practices

1. **Use the dependency array**: Always specify dependencies for useEffect
2. **Extract custom hooks**: Reuse stateful logic between components
3. **Keep it simple**: Don't overuse hooks where simple props would work

React Hooks make functional components more powerful than ever. Start using them today!""",
            published=True,
            featured=False,
            author_id=user3.id,
            category_id=web_dev_cat.id,
            published_at=datetime.utcnow() - timedelta(days=1)
        )
        
        # Post 6: DevOps
        post6 = Post(
            title="Docker for Developers: From Zero to Production",
            slug="docker-developers-zero-production",
            excerpt="Learn Docker from basics to production deployment. A practical guide for developers who want to containerize their applications.",
            content="""# Docker for Developers: From Zero to Production

Docker has become essential for modern development. Whether you're a backend developer or full-stack engineer, understanding containers is crucial. Let's dive in!

## Why Docker?

- **Consistency**: Same environment everywhere
- **Isolation**: No more "it works on my machine"
- **Scalability**: Easy horizontal scaling
- **Deployment**: Simplified production deployments

## Getting Started

### Basic Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose for Development

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
  
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
```

## Production Best Practices

### Multi-stage Builds

```dockerfile
# Build stage
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Security Considerations

1. **Use specific image tags**: Avoid `latest`
2. **Run as non-root user**: Create dedicated user
3. **Scan for vulnerabilities**: Use tools like Snyk
4. **Minimize image size**: Use alpine images

## Deployment Strategies

### Docker Swarm
Simple orchestration for small teams

### Kubernetes
Enterprise-grade orchestration

### Cloud Services
- AWS ECS/EKS
- Google Cloud Run
- Azure Container Instances

Docker transforms how we build, ship, and run applications. Start containerizing your projects today!""",
            published=True,
            featured=True,
            author_id=admin_user.id,
            category_id=tech_cat.id,
            published_at=datetime.utcnow() - timedelta(hours=12)
        )
        
        # Post 7: Career Advice
        post7 = Post(
            title="10 Soft Skills Every Developer Should Master",
            slug="10-soft-skills-every-developer-should-master",
            excerpt="Technical skills get you in the door, but soft skills determine how far you'll go. Here are the 10 most important ones for developers.",
            content="""# 10 Soft Skills Every Developer Should Master

We spend so much time learning new frameworks and languages that we often forget about soft skills. But here's the truth: technical skills get you in the door, soft skills determine how far you'll go.

## 1. Communication

**Why it matters**: You'll spend more time explaining code than writing it.

**How to improve**:
- Write clear commit messages
- Document your code thoroughly
- Practice explaining technical concepts to non-technical people

## 2. Problem-Solving

**Why it matters**: Programming is problem-solving with code.

**How to improve**:
- Break down complex problems into smaller pieces
- Learn different problem-solving frameworks
- Practice algorithmic thinking

## 3. Time Management

**Why it matters**: Deadlines are real, and estimation is hard.

**How to improve**:
- Use time-tracking tools
- Learn to estimate better through experience
- Prioritize ruthlessly

## 4. Collaboration

**Why it matters**: Software is built by teams, not individuals.

**How to improve**:
- Practice code reviews
- Contribute to open source
- Learn Git collaboration workflows

## 5. Adaptability

**Why it matters**: Technology changes fast.

**How to improve**:
- Embrace new technologies
- Stay curious about different approaches
- Learn from failures

## 6. Critical Thinking

**Why it matters**: Not every solution is the right solution.

**How to improve**:
- Question assumptions
- Consider trade-offs
- Think about edge cases

## 7. Empathy

**Why it matters**: You're building software for humans.

**How to improve**:
- Talk to users
- Consider accessibility
- Think about different use cases

## 8. Leadership

**Why it matters**: Even junior developers lead in some capacity.

**How to improve**:
- Mentor newcomers
- Take ownership of features
- Suggest improvements

## 9. Continuous Learning

**Why it matters**: The only constant is change.

**How to improve**:
- Set learning goals
- Follow industry blogs
- Attend conferences and meetups

## 10. Emotional Intelligence

**Why it matters**: Code reviews, debugging sessions, and tight deadlines can be stressful.

**How to improve**:
- Practice self-awareness
- Learn to manage stress
- Develop emotional regulation

## The Bottom Line

These skills aren't just nice-to-have—they're essential for a successful career in tech. Start working on them today, and you'll see the impact in every aspect of your development career.

*Which soft skill do you want to improve most? Let me know in the comments!*""",
            published=True,
            featured=False,
            author_id=user1.id,
            category_id=tech_cat.id,
            published_at=datetime.utcnow() - timedelta(hours=6)
        )
        
        # Post 8: Productivity
        post8 = Post(
            title="The Pomodoro Technique for Developers",
            slug="pomodoro-technique-for-developers",
            excerpt="Boost your coding productivity with the Pomodoro Technique. Learn how to adapt this time management method specifically for development work.",
            content="""# The Pomodoro Technique for Developers

Staying focused while coding can be challenging. Emails, Slack notifications, and that interesting Stack Overflow thread can derail your productivity. The Pomodoro Technique might be the solution you need.

## What is the Pomodoro Technique?

Developed by Francesco Cirillo, the Pomodoro Technique is a time management method that uses 25-minute focused work periods followed by 5-minute breaks.

### The Basic Steps

1. **Choose a task** to work on
2. **Set a timer** for 25 minutes
3. **Work on the task** until the timer rings
4. **Take a 5-minute break**
5. **Repeat** 3 more times
6. **Take a longer break** (15-30 minutes)

## Adapting Pomodoros for Development

### Task Breakdown

Not all coding tasks fit neatly into 25 minutes:

- **Bug fixes**: Usually perfect for one pomodoro
- **New features**: Break into smaller sub-tasks
- **Research**: Set specific research goals
- **Code reviews**: Group similar PRs together

### Tools for Developers

#### Timer Apps
- **Forest**: Gamified focus with virtual trees
- **Toggl**: Time tracking with pomodoro features
- **Be Focused**: Simple, clean interface

#### IDE Integration
- **VS Code extensions**: Pomodoro Timer, Tomato Timer
- **IntelliJ plugins**: Pomodoro Timer Pro
- **Vim plugins**: For the terminal enthusiasts

### Handling Interruptions

In development, interruptions are inevitable:

**Internal interruptions** (ideas, distractions):
- Write them down quickly
- Return to your current task
- Address during breaks

**External interruptions** (meetings, urgent bugs):
- If it takes less than 2 minutes, handle it
- Otherwise, schedule it for after your pomodoro

## Customizing for Your Workflow

### Different Time Intervals

Experiment with different durations:
- **50/10 minutes**: Better for complex debugging
- **90 minutes**: For deep, creative work
- **15/5 minutes**: When you're struggling to focus

### Team Pomodoros

Try synchronized pomodoros with your team:
- Shared focus time
- Coordinated breaks
- Better for pair programming

## Common Pitfalls

1. **Being too rigid**: Adapt the technique to your needs
2. **Ignoring breaks**: Breaks are crucial for sustained focus
3. **Overestimating tasks**: Better to finish early than stress about time
4. **Multitasking**: Stick to one task per pomodoro

## Measuring Success

Track your pomodoros to improve:
- **Completed pomodoros per day**
- **Types of tasks** that work best
- **Time of day** when you're most productive
- **Interruption patterns**

## The Developer's Advantage

Developers already think in terms of:
- Breaking down complex problems
- Iterative improvement
- Measuring and optimizing

The Pomodoro Technique fits naturally into this mindset.

## Getting Started

1. **Start small**: Try just 4 pomodoros your first day
2. **Track your results**: Note what works and what doesn't
3. **Adjust as needed**: Make the technique work for you
4. **Be consistent**: Give it at least a week before judging

The Pomodoro Technique isn't magic, but it's a proven way to boost focus and productivity. Give it a try—your future, more productive self will thank you.

*Do you use the Pomodoro Technique? What time management strategies work best for your development workflow?*""",
            published=True,
            featured=False,
            author_id=user2.id,
            category_id=tech_cat.id,
            published_at=datetime.utcnow() - timedelta(hours=2)
        )
        
        session.add_all([post1, post2, post3, post4, post5, post6, post7, post8])
        session.commit()
        
        # Refresh all posts to get their IDs
        for post in [post1, post2, post3, post4, post5, post6, post7, post8]:
            session.refresh(post)
        
        # Create post-tag associations
        print("🔗 Creating post-tag associations...")
        post_tags = [
            (post1, [tags[0], tags[2], tags[8]]),  # python, fastapi, tutorial
            (post2, [tags[4], tags[9]]),  # machine-learning, career
            (post3, [tags[9], tags[10]]),  # career, startup-life
            (post4, [tags[7], tags[11]]),  # productivity, remote-culture
            (post5, [tags[1], tags[3], tags[8]]),  # javascript, react, tutorial
            (post6, [tags[6], tags[8]]),  # devops, tutorial
            (post7, [tags[9], tags[7]]),  # career, productivity
            (post8, [tags[7]]),  # productivity
        ]
        
        for post, post_tag_list in post_tags:
            for tag in post_tag_list:
                post_tag = PostTag(post_id=post.id, tag_id=tag.id)
                session.add(post_tag)
        
        session.commit()
        
        # Create comments
        print("💬 Creating comments...")
        comments_data = [
            (post1.id, user1.id, "Great tutorial! FastAPI is indeed amazing for building APIs quickly.", False),
            (post1.id, user2.id, "Thanks for the detailed examples. The automatic documentation feature is a game-changer!", False),
            (post2.id, user3.id, "Really insightful article about AI's impact on development. The code generation tools are already changing how I work.", False),
            (post3.id, user2.id, "Inspiring story! How did you handle the technical challenges during month 2?", False),
            (post4.id, user1.id, "Notion is indeed a game-changer. I've been using it for 6 months and can't imagine working without it.", False),
            (post5.id, user2.id, "Perfect timing! I was just starting to learn React hooks. This guide is exactly what I needed.", False),
            (post6.id, user1.id, "Docker can be intimidating at first, but your examples make it much clearer. Thanks!", False),
            (post7.id, user3.id, "Communication skills are so underrated in our field. Great list of actionable advice!", False),
        ]
        
        comments = []
        for post_id, user_id, content, is_approved in comments_data:
            comment = Comment(
                content=content,
                author_id=user_id,
                post_id=post_id,
                is_approved=is_approved,
                created_at=datetime.utcnow() - timedelta(days=1, hours=2)
            )
            comments.append(comment)
        
        session.add_all(comments)
        session.commit()
        
        # Create likes
        print("❤️ Creating likes...")
        likes_data = [
            (post1.id, user1.id),
            (post1.id, user2.id),
            (post2.id, user1.id),
            (post3.id, user2.id),
            (post3.id, user3.id),
            (post4.id, user1.id),
            (post5.id, user2.id),
            (post6.id, user1.id),
            (post6.id, user3.id),
            (post7.id, user2.id),
        ]
        
        likes = []
        for post_id, user_id in likes_data:
            like = Like(
                user_id=user_id,
                post_id=post_id,
                created_at=datetime.utcnow() - timedelta(hours=1)
            )
            likes.append(like)
        
        session.add_all(likes)
        session.commit()
        
        # Create site settings
        print("⚙️ Creating site settings...")
        settings_data = [
            ("site_title", "TechBlog Pro", "The title of the blog site"),
            ("site_description", "A modern blog about technology, programming, and innovation", "Description of the blog"),
            ("site_url", "https://techblog.pro", "The main URL of the site"),
            ("admin_email", "admin@techblog.pro", "Administrator email address"),
            ("posts_per_page", "10", "Number of posts to display per page"),
            ("comments_enabled", "true", "Whether comments are enabled"),
            ("registration_enabled", "true", "Whether new user registration is allowed"),
            ("site_logo", "/static/images/logo.png", "Path to the site logo"),
            ("favicon", "/static/images/favicon.ico", "Path to the site favicon"),
            ("google_analytics", "GA-XXXXXXXX-X", "Google Analytics tracking ID"),
            ("social_twitter", "https://twitter.com/techblogpro", "Twitter profile URL"),
            ("social_github", "https://github.com/techblogpro", "GitHub profile URL"),
            ("social_linkedin", "https://linkedin.com/company/techblogpro", "LinkedIn profile URL"),
            ("email_notifications", "true", "Whether email notifications are enabled"),
            ("maintenance_mode", "false", "Whether the site is in maintenance mode"),
            ("max_upload_size", "10485760", "Maximum file upload size in bytes (10MB)"),
            ("allowed_file_types", "jpg,jpeg,png,gif,pdf,txt,md", "Allowed file extensions for uploads"),
        ]
        
        settings = []
        for key, value, description in settings_data:
            setting = Setting(
                key=key,
                value=value,
                description=description
            )
            settings.append(setting)
        
        session.add_all(settings)
        session.commit()
        
        # Create themes
        print("🎨 Creating themes...")
        themes_data = [
            ("default", "Default Theme", "The default blog theme with clean design", True, "{}"),
            ("dark", "Dark Theme", "Dark mode theme for night readers", False, '{"primary_color": "#1a1a1a", "accent_color": "#007acc"}'),
            ("minimal", "Minimal Theme", "Clean and minimal design focused on content", False, '{"typography": "serif", "layout": "centered"}'),
        ]
        
        themes = []
        for name, display_name, description, is_active, settings_json in themes_data:
            theme = Theme(
                name=name,
                display_name=display_name,
                description=description,
                is_active=is_active,
                settings=settings_json
            )
            themes.append(theme)
        
        session.add_all(themes)
        session.commit()
        
        # Create extensions
        print("🔌 Creating extensions...")
        extensions_data = [
            ("seo_optimizer", "SEO Optimizer", "Automatically optimizes posts for search engines", True, "1.2.0"),
            ("social_share", "Social Share Buttons", "Adds social media sharing buttons to posts", True, "2.1.0"),
            ("analytics", "Advanced Analytics", "Provides detailed visitor analytics and insights", False, "1.0.5"),
            ("newsletter", "Newsletter Subscription", "Allows visitors to subscribe to email newsletters", True, "1.4.2"),
            ("spam_filter", "Comment Spam Filter", "Automatically filters spam comments", True, "2.0.1"),
        ]
        
        extensions = []
        for name, display_name, description, is_enabled, version in extensions_data:
            extension = Extension(
                name=name,
                display_name=display_name,
                description=description,
                is_enabled=is_enabled,
                version=version
            )
            extensions.append(extension)
        
        session.add_all(extensions)
        session.commit()
        
        print("✅ Sample data created successfully!")
        print(f"Created:")
        print(f"  - 2 roles")
        print(f"  - 4 users (admin: admin/admin123, users: john_doe/password123, jane_smith/password123, tech_writer/password123)")
        print(f"  - 5 categories")
        print(f"  - 12 tags")
        print(f"  - 8 blog posts")
        print(f"  - 8 comments")
        print(f"  - 10 likes")
        print(f"  - 17 site settings")
        print(f"  - 3 themes")
        print(f"  - 5 extensions")
        print("")
        print("🎉 Your blog is now ready with realistic sample data!")
        print("📝 Login with: admin / admin123")

if __name__ == "__main__":
    create_sample_data()
