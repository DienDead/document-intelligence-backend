import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { FileText, Upload, MessageSquare, Home } from "lucide-react"

export default function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">DocIntel</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant={isActive("/") ? "default" : "ghost"} size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>

            <Button variant={isActive("/documents") ? "default" : "ghost"} size="sm" asChild>
              <Link to="/documents">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </Link>
            </Button>

            <Button variant={isActive("/upload") ? "default" : "ghost"} size="sm" asChild>
              <Link to="/upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Link>
            </Button>

            <Button variant={isActive("/qa") ? "default" : "ghost"} size="sm" asChild>
              <Link to="/qa">
                <MessageSquare className="h-4 w-4 mr-2" />
                Q&A
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
