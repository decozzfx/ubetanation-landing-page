"use client"

import { useEffect, useState } from 'react'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [renderedContent, setRenderedContent] = useState('')

  useEffect(() => {
    // Simple markdown parsing - in a real app you'd use a proper markdown library
    const parseMarkdown = (text: string) => {
      return text
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-4 mt-8">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-6 mt-10">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 mt-10">$1</h1>')
        
        // Bold and Italic
        .replace(/\*\*\*(.*)\*\*\*/gim, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
        
        // Code blocks
        .replace(/```([\s\S]*?)```/gim, '<pre class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto mb-6"><code class="text-sm">$1</code></pre>')
        .replace(/`([^`]*)`/gim, '<code class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono">$1</code>')
        
        // Links
        .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" class="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
        
        // Lists
        .replace(/^\* (.*$)/gim, '<li class="mb-2">$1</li>')
        .replace(/^- (.*$)/gim, '<li class="mb-2">$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li class="mb-2">$1</li>')
        
        // Blockquotes
        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic text-slate-600 dark:text-slate-400 my-6">$1</blockquote>')
        
        // Line breaks and paragraphs
        .replace(/\n\n/gim, '</p><p class="mb-6 leading-relaxed">')
        .replace(/\n/gim, '<br>')
    }

    const parsed = parseMarkdown(content)
    
    // Wrap in paragraphs and handle lists
    const withParagraphs = `<p class="mb-6 leading-relaxed">${parsed}</p>`
      .replace(/<\/p><p[^>]*>(<li[\s\S]*?<\/li>)<\/p>/gim, '<ul class="list-disc list-inside mb-6 space-y-2">$1</ul>')
      .replace(/<p[^>]*>(<li[\s\S]*?<\/li>)<\/p>/gim, '<ul class="list-disc list-inside mb-6 space-y-2">$1</ul>')
    
    setRenderedContent(withParagraphs)
  }, [content])

  return (
    <div 
      className="prose prose-slate dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
}