import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import HomePage from "./pages/HomePage"
import DocumentsPage from "./pages/DocumentsPage"
import UploadPage from "./pages/UploadPage"
import QAPage from "./pages/QAPage"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/qa" element={<QAPage />} />
      </Routes>
    </Layout>
  )
}

export default App
