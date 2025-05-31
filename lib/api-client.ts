const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
// Default to true for mock data if not explicitly set to "false"
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false"

// Mock data for development
const mockDocuments = [
  {
    id: "1",
    title: "Sample Research Paper.txt",
    file_type: "txt",
    size: 15420,
    pages: 8,
    status: "ready",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:35:00Z",
  },
  {
    id: "2",
    title: "Project Documentation.txt",
    file_type: "txt",
    size: 8932,
    pages: 5,
    status: "processing",
    created_at: "2024-01-14T14:20:00Z",
    updated_at: "2024-01-14T14:25:00Z",
  },
  {
    id: "3",
    title: "Meeting Notes.txt",
    file_type: "txt",
    size: 3456,
    pages: 2,
    status: "ready",
    created_at: "2024-01-13T09:15:00Z",
    updated_at: "2024-01-13T09:18:00Z",
  },
]

const mockQAResponse = {
  answer:
    "Based on the document content, the main topic discusses artificial intelligence and machine learning applications in modern software development. The document emphasizes the importance of understanding data structures and algorithms when implementing AI solutions.",
  sources: [
    {
      chunk_index: 0,
      content:
        "Artificial intelligence has become a cornerstone of modern software development, enabling applications to process and understand data in ways that were previously impossible...",
      page_number: 1,
    },
    {
      chunk_index: 2,
      content:
        "Machine learning algorithms require careful consideration of data structures and computational complexity to ensure optimal performance...",
      page_number: 3,
    },
  ],
  document_title: "Sample Research Paper.txt",
}

// API client class
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  async getDocuments(): Promise<Document[]> {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockDocuments
    }

    try {
      const response = await this.makeRequest<{ results: Document[] }>("/documents/")
      return response.results || []
    } catch (error) {
      console.error("Failed to fetch documents:", error)
      // Always fallback to mock data if API fails
      return mockDocuments
    }
  }

  async uploadDocument(file: File, title: string): Promise<Document> {
    if (USE_MOCK_DATA) {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        id: Date.now().toString(),
        title,
        file_type: file.name.split(".").pop() || "txt",
        size: file.size,
        pages: 1,
        status: "processing",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)

    try {
      return await this.makeRequest<Document>("/documents/", {
        method: "POST",
        body: formData,
        headers: {}, // Let browser set Content-Type for FormData
      })
    } catch (error) {
      console.error("Failed to upload document:", error)
      throw new Error("Failed to upload document. Please try again.")
    }
  }

  async askQuestion(documentId: string, question: string, chunkCount = 3): Promise<QAResponse> {
    if (USE_MOCK_DATA) {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return mockQAResponse
    }

    try {
      return await this.makeRequest<QAResponse>("/questions/", {
        method: "POST",
        body: JSON.stringify({
          document_id: documentId,
          question,
          chunk_count: chunkCount,
        }),
      })
    } catch (error) {
      console.error("Failed to ask question:", error)
      throw new Error("Failed to get answer. Please try again.")
    }
  }
}

// Types
export interface Document {
  id: string
  title: string
  file_type: string
  size: number
  pages: number
  status: "uploading" | "processing" | "ready" | "error"
  created_at: string
  updated_at: string
}

export interface QAResponse {
  answer: string
  sources: Array<{
    chunk_index: number
    content: string
    page_number: number
  }>
  document_title: string
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)
