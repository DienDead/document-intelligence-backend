"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import QAInterface from "@/components/QAInterface"
import { apiClient, type Document } from "@/lib/api-client"
import { FileText } from "lucide-react"
import Link from "next/link"

export default function Page() {
  const searchParams = useSearchParams()
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await apiClient.getDocuments()
        const readyDocs = docs.filter((doc) => doc.status === "ready")
        setDocuments(readyDocs)

        // Auto-select document from URL params
        const documentId = searchParams.get("document")
        if (documentId) {
          const doc = readyDocs.find((d) => d.id === documentId)
          if (doc) {
            setSelectedDocument(doc)
          }
        }
      } catch (error) {
        console.error("Failed to load documents:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [searchParams])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <h1 className="text-3xl font-bold">Q&A Interface</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading documents...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <h1 className="text-3xl font-bold">Q&A Interface</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents ready</h3>
              <p className="text-gray-600 mb-4">Upload and process documents first to start asking questions.</p>
              <Button asChild>
                <Link href="/upload">Upload Document</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Q&A Interface</h1>

      {!selectedDocument ? (
        <Card>
          <CardHeader>
            <CardTitle>Select a Document</CardTitle>
            <CardDescription>Choose a document to ask questions about</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <Card
                  key={document.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedDocument(document)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">{document.title}</CardTitle>
                    </div>
                    <CardDescription>
                      {document.pages} pages • {Math.round(document.size / 1024)} KB
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Selected: {selectedDocument.title}</span>
                </div>
                <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                  Change Document
                </Button>
              </div>
            </CardContent>
          </Card>

          <QAInterface documentId={selectedDocument.id} documentTitle={selectedDocument.title} />
        </div>
      )}
    </div>
  )
}
