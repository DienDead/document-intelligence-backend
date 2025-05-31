"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { togetherAI, type AIResponse } from "@/lib/together-client"
import { FileText, Loader2, Sparkles } from "lucide-react"

interface DocumentSummaryProps {
  documentId: string
  documentTitle: string
  documentContent?: string
}

export default function DocumentSummary({ documentId, documentTitle, documentContent }: DocumentSummaryProps) {
  const [summary, setSummary] = useState<AIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSummary = async () => {
    if (!documentContent) {
      setError("Document content not available for summary generation.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await togetherAI.generateSummary(documentContent, documentTitle)
      setSummary(response)
    } catch (err) {
      console.error("Error generating summary:", err)
      setError("Failed to generate summary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle>AI Summary</CardTitle>
          </div>
          <Button onClick={generateSummary} disabled={loading} size="sm">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Summary
              </>
            )}
          </Button>
        </div>
        <CardDescription>Get an AI-generated summary of this document</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {summary ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
              <div className="prose prose-sm max-w-none">
                {summary.answer.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{summary.model.split("/").pop()}</Badge>
                <span>AI Generated Summary</span>
              </div>
              {summary.usage && <span>{summary.usage.total_tokens} tokens used</span>}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click "Generate Summary" to create an AI-powered summary of this document.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
