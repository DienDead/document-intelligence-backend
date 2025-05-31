import Together from "together-ai"

// Initialize Together AI client
const together = new Together({
  apiKey: import.meta.env.VITE_TOGETHER_API_KEY,
})

export interface AIResponse {
  answer: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class TogetherAIClient {
  private model: string

  constructor(model = "meta-llama/Llama-2-70b-chat-hf") {
    this.model = model
  }

  async generateAnswer(question: string, context: string, documentTitle: string): Promise<AIResponse> {
    try {
      const prompt = this.buildPrompt(question, context, documentTitle)

      const response = await together.completions.create({
        model: this.model,
        prompt,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
        stop: ["Human:", "Assistant:", "\n\n---"],
      })

      const answer = response.choices[0]?.text?.trim() || "I couldn't generate an answer for this question."

      return {
        answer,
        model: this.model,
        usage: response.usage
          ? {
              prompt_tokens: response.usage.prompt_tokens,
              completion_tokens: response.usage.completion_tokens,
              total_tokens: response.usage.total_tokens,
            }
          : undefined,
      }
    } catch (error) {
      console.error("Together AI API error:", error)
      throw new Error("Failed to generate AI response. Please try again.")
    }
  }

  async generateSummary(content: string, documentTitle: string): Promise<AIResponse> {
    try {
      const prompt = `# Document Summary Task

Document Title: ${documentTitle}

Content:
${content.substring(0, 3000)}...

Please provide a concise summary of this document in 2-3 paragraphs, highlighting the main topics and key points.

Summary:`

      const response = await together.completions.create({
        model: this.model,
        prompt,
        max_tokens: 300,
        temperature: 0.5,
        top_p: 0.9,
      })

      const answer = response.choices[0]?.text?.trim() || "I couldn't generate a summary for this document."

      return {
        answer,
        model: this.model,
        usage: response.usage
          ? {
              prompt_tokens: response.usage.prompt_tokens,
              completion_tokens: response.usage.completion_tokens,
              total_tokens: response.usage.total_tokens,
            }
          : undefined,
      }
    } catch (error) {
      console.error("Together AI API error:", error)
      throw new Error("Failed to generate document summary. Please try again.")
    }
  }

  private buildPrompt(question: string, context: string, documentTitle: string): string {
    return `# Document Q&A Assistant

You are an AI assistant that answers questions based on document content. Use only the provided context to answer questions accurately and concisely.

Document: ${documentTitle}

Context:
${context}

Question: ${question}

Instructions:
- Answer based only on the provided context
- If the context doesn't contain enough information, say so
- Be concise but thorough
- Cite specific parts of the context when relevant
- If you cannot answer based on the context, explain what information would be needed

Answer:`
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await together.completions.create({
        model: this.model,
        prompt: "Test connection. Respond with 'OK'.",
        max_tokens: 10,
      })
      return response.choices[0]?.text?.includes("OK") || false
    } catch (error) {
      console.error("Together AI connection test failed:", error)
      return false
    }
  }
}

// Export singleton instance
export const togetherAI = new TogetherAIClient(import.meta.env.VITE_TOGETHER_MODEL)
