# Document Intelligence Platform - Vite React

A modern Document Intelligence Platform built with Vite, React, TypeScript, and Tailwind CSS. Upload documents and ask AI-powered questions about their content using RAG (Retrieval Augmented Generation) technology.

## Features

- **Modern React Stack**: Built with Vite, React 18, TypeScript, and Tailwind CSS
- **Document Upload**: Drag-and-drop interface for uploading text files
- **AI-Powered Q&A**: Ask natural language questions about document content
- **Responsive Design**: Mobile-first design with shadcn/ui components
- **Mock Data Support**: Works with mock data for development and demos
- **Real-time Processing**: Background document processing with status updates
- **Real AI Responses**: Powered by state-of-the-art language models
- **Model Selection**: Choose from multiple AI models based on your needs
- **Usage Tracking**: Monitor token usage and response times
- **Fallback Support**: Graceful degradation to mock data if API fails
- **Document Summaries**: AI-generated summaries of uploaded documents

## Tech Stack

### Frontend
- **Vite** - Fast build tool and dev server
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible UI components
- **React Router** - Client-side routing
- **React Dropzone** - File upload with drag-and-drop

### Backend Integration
- **Django REST Framework** - API backend (separate repository)
- **RAG Pipeline** - Vector embeddings and AI question answering
- **Mock Data** - Fallback for development without backend

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd document-intelligence-platform
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env`:
\`\`\`env
VITE_API_URL=http://localhost:8000/api
VITE_USE_MOCK_DATA=true
VITE_TOGETHER_API_KEY=your-together-ai-api-key-here
VITE_TOGETHER_MODEL=meta-llama/Llama-2-70b-chat-hf
\`\`\`

4. **Start the development server**
\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── DocumentList.tsx
│   ├── FileUploader.tsx
│   ├── QAInterface.tsx
│   ├── Layout.tsx
│   └── Navbar.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── DocumentsPage.tsx
│   ├── UploadPage.tsx
│   └── QAPage.tsx
├── lib/                # Utilities and API client
│   ├── api-client.ts
│   └── utils.ts
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
\`\`\`

## Configuration

### Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:8000/api)
- `VITE_USE_MOCK_DATA` - Use mock data instead of real API (default: true)
- `VITE_TOGETHER_API_KEY` - Together AI API Key
- `VITE_TOGETHER_MODEL` - Together AI Model (default: meta-llama/Llama-2-70b-chat-hf)

### Mock Data vs Real API

The application supports two modes:

1. **Mock Data Mode** (default): Uses predefined mock data for development and demos
2. **API Mode**: Connects to a real Django backend

To switch modes, update the `VITE_USE_MOCK_DATA` environment variable.

## Together AI Integration

This application uses Together AI for generating intelligent responses to document questions.

### Setup

1. **Get Together AI API Key**
   - Sign up at [Together AI](https://together.ai)
   - Get your API key from the dashboard

2. **Configure Environment Variables**
   \`\`\`env
   VITE_TOGETHER_API_KEY=your-together-ai-api-key-here
   VITE_TOGETHER_MODEL=meta-llama/Llama-2-70b-chat-hf
   \`\`\`

3. **Available Models**
   - `meta-llama/Llama-2-70b-chat-hf` - Best quality, slower
   - `meta-llama/Llama-2-13b-chat-hf` - Good balance
   - `meta-llama/Llama-2-7b-chat-hf` - Fastest
   - `mistralai/Mixtral-8x7B-Instruct-v0.1` - High performance
   - `NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO` - Fine-tuned

## Features Overview

### Document Upload
- Drag-and-drop interface
- File validation (TXT files, max 10MB)
- Progress tracking
- Batch upload support

### Document Library
- Grid view of all documents
- Status indicators (uploading, processing, ready, error)
- File metadata display
- Quick access to Q&A interface

### Q&A Interface
- Document selection
- Natural language question input
- AI-powered answers with source citations
- Loading states and error handling

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

## Backend Integration

This frontend is designed to work with a Django REST Framework backend. The expected API endpoints are:

- `GET /api/documents/` - List all documents
- `POST /api/documents/` - Upload a new document
- `POST /api/questions/` - Ask a question about a document

For the complete backend implementation, refer to the Django backend code provided separately.

## Development

### Adding New Components

1. Create component in `src/components/`
2. Export from the component file
3. Import and use in pages or other components

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Navbar.tsx`

### Styling

The project uses Tailwind CSS with a custom design system. UI components are built with shadcn/ui for consistency and accessibility.

## Building for Production

\`\`\`bash
npm run build
\`\`\`

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## Deployment

The application can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Make sure to set the correct environment variables for your production backend.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
