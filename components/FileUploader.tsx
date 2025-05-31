"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"

interface UploadedFile {
  file: File
  title: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  error?: string
}

export default function FileUploader() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      status: "pending" as const,
      progress: 0,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  })

  const updateFileTitle = (index: number, title: string) => {
    setUploadedFiles((prev) => prev.map((file, i) => (i === index ? { ...file, title } : file)))
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFile = async (fileData: UploadedFile, index: number) => {
    try {
      // Update status to uploading
      setUploadedFiles((prev) =>
        prev.map((file, i) => (i === index ? { ...file, status: "uploading", progress: 0 } : file)),
      )

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((file, i) =>
            i === index && file.status === "uploading" ? { ...file, progress: Math.min(file.progress + 10, 90) } : file,
          ),
        )
      }, 200)

      // Upload the file
      await apiClient.uploadDocument(fileData.file, fileData.title)

      // Clear progress interval
      clearInterval(progressInterval)

      // Update status to success
      setUploadedFiles((prev) =>
        prev.map((file, i) => (i === index ? { ...file, status: "success", progress: 100 } : file)),
      )
    } catch (error) {
      // Update status to error
      setUploadedFiles((prev) =>
        prev.map((file, i) =>
          i === index
            ? {
                ...file,
                status: "error",
                progress: 0,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : file,
        ),
      )
    }
  }

  const uploadAllFiles = async () => {
    setIsUploading(true)

    const pendingFiles = uploadedFiles
      .map((file, index) => ({ file, index }))
      .filter(({ file }) => file.status === "pending")

    // Upload files sequentially to avoid overwhelming the server
    for (const { file, index } of pendingFiles) {
      await uploadFile(file, index)
    }

    setIsUploading(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "uploading":
        return <Upload className="h-4 w-4 text-blue-500 animate-pulse" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const pendingFiles = uploadedFiles.filter((file) => file.status === "pending")
  const hasSuccessfulUploads = uploadedFiles.some((file) => file.status === "success")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload Documents</h1>
        <p className="text-muted-foreground">Upload text files to analyze with AI. Supported formats: TXT</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>Upload text files to analyze with AI. Supported formats: TXT</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Drag and drop files here, or click to select files</p>
                <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Files to Upload</CardTitle>
              {pendingFiles.length > 0 && (
                <Button onClick={uploadAllFiles} disabled={isUploading} className="ml-auto">
                  {isUploading
                    ? "Uploading..."
                    : `Upload ${pendingFiles.length} File${pendingFiles.length > 1 ? "s" : ""}`}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((fileData, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(fileData.status)}
                      <span className="font-medium">{fileData.file.name}</span>
                      <span className="text-sm text-gray-500">({formatFileSize(fileData.file.size)})</span>
                    </div>
                    {fileData.status === "pending" && (
                      <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {fileData.status === "pending" && (
                    <div className="space-y-2">
                      <Label htmlFor={`title-${index}`}>Document Title</Label>
                      <Input
                        id={`title-${index}`}
                        value={fileData.title}
                        onChange={(e) => updateFileTitle(index, e.target.value)}
                        placeholder="Enter document title"
                      />
                    </div>
                  )}

                  {fileData.status === "uploading" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{fileData.progress}%</span>
                      </div>
                      <Progress value={fileData.progress} />
                    </div>
                  )}

                  {fileData.status === "success" && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Document uploaded successfully! It's now being processed.
                      </AlertDescription>
                    </Alert>
                  )}

                  {fileData.status === "error" && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {fileData.error || "Upload failed. Please try again."}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {hasSuccessfulUploads && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-green-800 mb-2">Upload Complete!</h3>
              <p className="text-green-700 mb-4">
                Your documents are being processed. You can view them in the document library.
              </p>
              <Button asChild>
                <Link href="/documents">View Documents</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
