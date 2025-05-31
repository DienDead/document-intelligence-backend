import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, MessageSquare, Brain } from "lucide-react"
import AISettings from "@/components/AISettings"

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Document Intelligence Platform</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your documents and ask AI-powered questions to extract insights and information instantly.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Upload className="h-6 w-6 text-blue-600" />
              <CardTitle>Upload Documents</CardTitle>
            </div>
            <CardDescription>Upload text files and let our AI process them for intelligent analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/upload">Upload Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-green-600" />
              <CardTitle>Document Library</CardTitle>
            </div>
            <CardDescription>View and manage all your uploaded documents in one place.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/documents">View Library</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-purple-600" />
              <CardTitle>Ask Questions</CardTitle>
            </div>
            <CardDescription>
              Ask natural language questions about your documents and get AI-powered answers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/qa">Start Q&A</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* How it Works Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span>How It Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold">Upload</h3>
              <p className="text-sm text-muted-foreground">Upload your text documents to our secure platform</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold">Process</h3>
              <p className="text-sm text-muted-foreground">
                AI analyzes and creates searchable embeddings from your content
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold">Ask</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions and get intelligent answers with source citations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AISettings />

      {/* Quick Start */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Ready to get started?</h3>
            <p className="text-muted-foreground">
              Upload your first document and experience the power of AI-driven document analysis.
            </p>
            <Button asChild size="lg">
              <Link to="/upload">Upload Your First Document</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
