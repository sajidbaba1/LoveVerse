# 🚀 Vercel Deployment Guide for LoveVerse

This guide will help you deploy LoveVerse to Vercel with step-by-step instructions.

## 📋 Prerequisites

- [Vercel account](https://vercel.com/signup)
- [GitHub repository](https://github.com/sajidbaba1/LoveVerse) connected
- Node.js 18+ (for local testing)

## 🔧 Step-by-Step Deployment

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**

```bash
vercel login
```

### **Step 3: Deploy from GitHub**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**: `sajidbaba1/LoveVerse`
4. **Configure the project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### **Step 4: Set Environment Variables**

In your Vercel project settings, add these environment variables:

```bash
# Required
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_random_secret_key

# Optional (for AI features)
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Production settings
NODE_ENV=production
```

### **Step 5: Deploy**

```bash
# From your project directory
vercel --prod
```

## 🔧 Alternative: Deploy via CLI

### **Option 1: Deploy from Local Directory**

```bash
# Navigate to your project
cd LoveVerse

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [your-account]
# - Link to existing project? N
# - Project name: loveverse
# - Directory: ./
# - Override settings? N
```

### **Option 2: Deploy with Custom Settings**

```bash
vercel --prod --build-env NODE_ENV=production
```

## 🌐 Environment Variables Setup

### **Required Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `SESSION_SECRET` | Random secret for sessions | `your-32-character-secret` |

### **Optional Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `HUGGINGFACE_API_KEY` | Hugging Face API key | `hf_your_api_key_here` |
| `NODE_ENV` | Environment setting | `production` |

### **How to Set Environment Variables**

1. **Via Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add each variable with its value

2. **Via CLI**:
```bash
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
vercel env add HUGGINGFACE_API_KEY
```

## 🔍 Troubleshooting

### **Common Issues**

1. **Build Fails**
   ```bash
   # Check build logs
   vercel logs
   
   # Rebuild locally
   npm run build
   ```

2. **Environment Variables Not Working**
   ```bash
   # Verify environment variables
   vercel env ls
   
   # Redeploy with new variables
   vercel --prod
   ```

3. **API Routes Not Working**
   - Check that `api/index.js` exists
   - Verify `vercel.json` configuration
   - Test locally with `vercel dev`

### **Debug Commands**

```bash
# Test locally
vercel dev

# Check deployment status
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod
```

## 📊 Performance Optimization

### **Vercel-Specific Optimizations**

1. **Enable Edge Functions** (if needed):
   ```json
   {
     "functions": {
       "api/index.js": {
         "maxDuration": 30,
         "runtime": "nodejs18.x"
       }
     }
   }
   ```

2. **Optimize Build**:
   - Use `npm ci` instead of `npm install`
   - Enable build caching
   - Minimize bundle size

## 🔐 Security Considerations

### **Environment Variables**
- Never commit sensitive data to Git
- Use Vercel's encrypted environment variables
- Rotate secrets regularly

### **Database Security**
- Use SSL connections
- Enable connection pooling
- Monitor database performance

## 📈 Monitoring

### **Vercel Analytics**
- Enable Vercel Analytics in project settings
- Monitor performance metrics
- Track user engagement

### **Custom Domain**
1. **Add Custom Domain**:
   - Go to project settings
   - Navigate to "Domains"
   - Add your domain

2. **Configure DNS**:
   - Follow Vercel's DNS instructions
   - Wait for propagation (up to 48 hours)

## 🚀 Post-Deployment

### **Verify Deployment**

1. **Check your deployed URL** (e.g., `https://loveverse.vercel.app`)
2. **Test all features**:
   - Frontend loads correctly
   - API endpoints respond
   - Database connections work
   - AI features function

### **Continuous Deployment**

- **Automatic**: Every push to `main` branch
- **Manual**: Use `vercel --prod` command
- **Preview**: Every pull request gets a preview URL

## 📞 Support

### **Vercel Support**
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Status](https://vercel-status.com/)

### **LoveVerse Support**
- [GitHub Issues](https://github.com/sajidbaba1/LoveVerse/issues)
- [README.md](README.md) for project details
- [DEPLOYMENT.md](DEPLOYMENT.md) for other deployment options

---

**🎉 Your LoveVerse will be live at: `https://your-project-name.vercel.app`**

**Happy Deploying!** 🚀💕 