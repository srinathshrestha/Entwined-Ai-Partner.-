# 💕 Entwined - AI Companion

A sophisticated AI companion application built with Next.js that creates personalized, emotionally intelligent relationships through advanced psychology profiling and memory management.

## ✨ Features

- **🧠 Psychology-Based Profiling** - Deep personality analysis for authentic interactions
- **💭 Advanced Memory System** - Persistent conversations with context awareness
- **👤 Custom Companion Design** - Personalize appearance, personality, and behavior
- **🔒 Secure Authentication** - Powered by Clerk for seamless user management
- **📱 Responsive Design** - Beautiful UI that works on all devices
- **🚀 Real-time Chat** - Streaming AI responses with emotional intelligence

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: Clerk
- **AI**: Grok-3-mini, OpenAI
- **Vector Store**: Pinecone
- **UI Components**: Radix UI, shadcn/ui

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account
- Pinecone account
- OpenAI/Grok API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd entwined
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
   - `CLERK_SECRET_KEY` - Clerk secret key
   - `PINECONE_API_KEY` - Pinecone API key
   - `PINECONE_INDEX_NAME` - Pinecone index name
   - `OPENAI_API_KEY` or `GROK_API_KEY` - AI provider API key

4. **Set up database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Initialize Pinecone**

   ```bash
   npx tsx src/scripts/setup-pinecone.ts
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically!

### Other Platforms

The application supports deployment on any platform that supports Node.js:

- Railway
- Render
- DigitalOcean
- AWS/GCP/Azure

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── chat/              # Chat interface
│   ├── onboarding/        # User setup flow
│   └── settings/          # User preferences
├── components/            # Reusable UI components
├── lib/                   # Core business logic
│   ├── ai/               # AI integrations
│   ├── pinecone/         # Vector database
│   └── auth/             # Authentication helpers
└── types/                 # TypeScript definitions
```

## 🔧 Environment Variables

| Variable                            | Description                  | Required |
| ----------------------------------- | ---------------------------- | -------- |
| `DATABASE_URL`                      | PostgreSQL connection string | ✅       |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key             | ✅       |
| `CLERK_SECRET_KEY`                  | Clerk secret key             | ✅       |
| `PINECONE_API_KEY`                  | Pinecone API key             | ✅       |
| `PINECONE_INDEX_NAME`               | Pinecone index name          | ✅       |
| `OPENAI_API_KEY`                    | OpenAI API key               | ⚠️       |
| `GROK_API_KEY`                      | Grok API key                 | ⚠️       |

_Note: You need either OpenAI or Grok API key_

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](docs/)
2. Open an [issue](../../issues)
3. Join our [community discussions](../../discussions)

---

**Built with ❤️ using Next.js and modern web technologies**
