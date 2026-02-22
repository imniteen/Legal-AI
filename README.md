# JurisAI - Legal Case Analysis Platform

An AI-powered legal case analysis tool that provides **dual-lens** prosecution and defense strategy evaluation with strict citation compliance and zero hallucination tolerance.

## Features

- **PDF Upload & Processing**: Upload legal case files (FIRs, witness statements, evidence logs) with automatic text extraction and page number preservation
- **Dual-Lens Analysis**: AI-generated strategy reports from both prosecution and defense perspectives
- **Citation Compliance**: Every claim, fact, date, or name includes a citation mapping back to the original PDF (e.g., [Page 12])
- **Interactive Q&A**: Chat interface for follow-up questions about the case
- **Zero Hallucination**: AI only references facts present in the documents

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Docker)
- **AI**: Google Gemini 1.5 Pro (1M+ context window)
- **PDF Processing**: pdf-parse with page marker injection

## Prerequisites

- Node.js 18+
- Docker Desktop (for PostgreSQL)
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

## Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd Legal-AI
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL="postgresql://jurisai:jurisai_secret@localhost:5432/jurisai?schema=public"
```

### 3. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

### 4. Initialize the Database

```bash
npm run db:generate
npm run db:push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload a Case**: Navigate to the Upload page and drag & drop your PDF case file
2. **Start Analysis**: Click "Start AI Analysis" to generate the dual-lens report
3. **Review Results**: View the case synopsis, prosecution strengths, and defense opportunities
4. **Ask Questions**: Use the Chat tab to ask follow-up questions about the case

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── upload/page.tsx       # Upload page
│   ├── analysis/[caseId]/    # Analysis dashboard
│   └── api/
│       ├── upload/           # PDF upload endpoint
│       ├── analyze/          # AI analysis endpoint
│       ├── chat/             # Chat endpoint
│       ├── pdf/              # PDF serving endpoint
│       └── cases/            # Case CRUD operations
├── components/
│   ├── analysis/             # Analysis components
│   ├── chat/                 # Chat interface
│   ├── layout/               # Header, navigation
│   ├── pdf/                  # PDF viewer
│   └── upload/               # Upload components
├── lib/
│   ├── gemini.ts             # Gemini AI integration
│   ├── pdf-parser.ts         # PDF text extraction
│   ├── prisma.ts             # Database client
│   └── utils.ts              # Utilities
└── types/
    └── index.ts              # TypeScript interfaces
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Docker Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# View logs
docker-compose logs -f
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload` | POST | Upload PDF and extract text |
| `/api/analyze` | POST/GET | Trigger or fetch AI analysis |
| `/api/chat` | POST/GET | Send or fetch chat messages |
| `/api/cases` | GET/DELETE | List or delete cases |
| `/api/pdf` | GET | Serve PDF file |

## Configuration

Environment variables in `.env.local`:

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `UPLOAD_DIR` | PDF upload directory | `./uploads` |
| `MAX_FILE_SIZE_MB` | Maximum file size | `50` |

## License

MIT
