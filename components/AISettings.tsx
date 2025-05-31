"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Settings, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function AISettings() {
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("meta-llama/Llama-2-70b-chat-hf")
  const [testing, setTesting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "failed">("unknown")
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Check if API key is configured
    const hasApiKey = !!process.env.NEXT_PUBLIC_TOGETHER_API_KEY
    setIsConfigured(hasApiKey)
    if (hasApiKey) {
      setApiKey("••••••••••••••••")
      setModel(process.env.NEXT_PUBLIC_TOGETHER_MODEL || "meta-llama/Llama-2-70b-chat-hf")
    }
  }, [])

  const testConnection = async () => {
    setTesting(true)
    try {
      // Simulate connection test
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setConnectionStatus(isConfigured ? "connected" : "failed")
    } catch (error) {
      setConnectionStatus("failed")
    } finally {
      setTesting(false)
    }
  }

  const availableModels = [
    { id: "meta-llama/Llama-2-70b-chat-hf", name: "Llama 2 70B Chat", description: "Best for conversations" },
    { id: "meta-llama/Llama-2-13b-chat-hf", name: "Llama 2 13B Chat", description: "Faster, good quality" },
    { id: "meta-llama/Llama-2-7b-chat-hf", name: "Llama 2 7B Chat", description: "Fastest, basic quality" },
    { id: "mistralai/Mixtral-8x7B-Instruct-v0.1", name: "Mixtral 8x7B", description: "High performance" },
    { id: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO", name: "Nous Hermes 2", description: "Fine-tuned" },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <CardTitle>AI Configuration</CardTitle>
        </div>
        <CardDescription>Configure AI settings for document Q&A</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Status */}
        <div className="flex items-center justify-between">
          <Label>API Key Status</Label>
          <div className="flex items-center space-x-2">
            {isConfigured ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Configured
                </Badge>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Not Configured
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Connection Test */}
        <div className="flex items-center justify-between">
          <Label>Connection Status</Label>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={testConnection} disabled={testing || !isConfigured}>
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>
            {connectionStatus === "connected" && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected
              </Badge>
            )}
            {connectionStatus === "failed" && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Failed
              </Badge>
            )}
          </div>
        </div>

        {/* Current Model */}
        <div>
          <Label>Current Model</Label>
          <div className="mt-1">
            <Input value={model} readOnly className="bg-gray-50" />
            <p className="text-xs text-gray-500 mt-1">
              {availableModels.find((m) => m.id === model)?.description || "Custom model"}
            </p>
          </div>
        </div>

        {/* Available Models */}
        <div>
          <Label>Available Models</Label>
          <div className="mt-2 space-y-2">
            {availableModels.map((modelOption) => (
              <div
                key={modelOption.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  model === modelOption.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setModel(modelOption.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{modelOption.name}</div>
                    <div className="text-xs text-gray-500">{modelOption.description}</div>
                  </div>
                  {model === modelOption.id && <CheckCircle className="h-4 w-4 text-blue-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Instructions */}
        {!isConfigured && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>To enable AI-powered responses, configure your Together AI API key:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Get your API key from Together AI</li>
                  <li>Add NEXT_PUBLIC_TOGETHER_API_KEY to your environment variables</li>
                  <li>Optionally set NEXT_PUBLIC_TOGETHER_MODEL for a specific model</li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Usage Information */}
        <Alert>
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Usage Information:</p>
              <ul className="text-sm space-y-1">
                <li>• Larger models (70B) provide better quality but are slower</li>
                <li>• Smaller models (7B, 13B) are faster but may be less accurate</li>
                <li>• Mixtral models offer good balance of speed and quality</li>
                <li>• API usage is charged per token by Together AI</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
