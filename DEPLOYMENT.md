# LoveVerse Deployment Guide 🚀

This guide will help you deploy LoveVerse to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- A PostgreSQL database (Neon recommended)
- Hugging Face API key (optional but recommended)
- Git repository access

## 🔧 Environment Setup

### Required Environment Variables

```bash
# Database (Required)
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# Session Security (Required)
SESSION_SECRET=your_random_secret_key_here

# AI Service (Optional - has fallback)
HUGGINGFACE_API_KEY=your_huggingface_api_key

# For Replit Deployment (Production)
REPLIT_DOMAINS=your-domain.replit.co
REPL_ID=your_replit_project_id
```

### Generate Session Secret

```bash
# Generate a random 32-byte hex string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🏠 Local Development

1. **Clone the repository**
```bash
git clone https://github.com/sajidbaba1/LoveVerse.git
cd LoveVerse
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment**
```bash
# Create .env.local file with your variables
echo "DATABASE_URL=your_database_url" > .env.local
echo "SESSION_SECRET=your_session_secret" >> .env.local
echo "NODE_ENV=development" >> .env.local
echo "HUGGINGFACE_API_KEY=your_api_key" >> .env.local
```

4. **Set up database**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

6. **Access the application**
Open `http://localhost:5000` in your browser

## ☁️ Replit Deployment

LoveVerse is optimized for Replit deployment:

1. **Fork the repository** to your GitHub account
2. **Create a new Repl** and import from GitHub
3. **Set up environment variables** in Replit Secrets:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `HUGGINGFACE_API_KEY` (optional)
   - `REPLIT_DOMAINS`
   - `REPL_ID`

4. **Install dependencies**
```bash
npm install
```

5. **Set up database**
```bash
npm run db:push
```

6. **Run the application**
```bash
npm run dev
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  loveverse:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SESSION_SECRET=${SESSION_SECRET}
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
      - NODE_ENV=production
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=loveverse
      - POSTGRES_USER=loveverse
      - POSTGRES_PASSWORD=your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🌐 Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables** in Vercel dashboard

## 🔥 Railway Deployment

1. **Connect your GitHub repository** to Railway
2. **Set environment variables** in Railway dashboard
3. **Deploy automatically** on push to main branch

## 📊 Database Setup

### Neon (Recommended)

1. **Create a Neon account** at [neon.tech](https://neon.tech)
2. **Create a new project**
3. **Get your connection string**
4. **Set up the database schema**
```bash
npm run db:push
```

### Self-hosted PostgreSQL

1. **Install PostgreSQL**
2. **Create a database**
3. **Update connection string**
4. **Run migrations**
```bash
npm run db:push
```

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use strong, random session secrets
- Rotate API keys regularly

### Database Security
- Use SSL connections for production databases
- Implement proper backup strategies
- Monitor database performance

### Application Security
- Enable HTTPS in production
- Set secure cookie options
- Implement rate limiting
- Regular dependency updates

## 📈 Performance Optimization

### Development
- Use `npm run dev` for hot reloading
- Monitor memory usage
- Use TypeScript for type safety

### Production
- Use `npm run build` for optimized builds
- Enable compression
- Implement caching strategies
- Monitor application performance

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` is correct
   - Check database is accessible
   - Ensure SSL is configured properly

2. **Authentication Issues**
   - Verify `SESSION_SECRET` is set
   - Check Replit Auth configuration
   - Ensure proper redirect URLs

3. **AI Service Errors**
   - Verify Hugging Face API key
   - Check API rate limits
   - Monitor API response times

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript compilation
   - Verify all dependencies are installed

### Logs and Debugging

```bash
# Check application logs
npm run dev

# Check database connection
npm run db:push

# Type checking
npm run check

# Build verification
npm run build
```

## 📞 Support

For deployment issues:
1. Check the [GitHub repository](https://github.com/sajidbaba1/LoveVerse)
2. Review the [README.md](README.md)
3. Check environment variable configuration
4. Verify database connectivity

---

**Happy Deploying!** 🚀💕 