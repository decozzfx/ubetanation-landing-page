"use client"

import { Button } from '@/components/ui/button'
import { Share2, Twitter, Linkedin, Facebook, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface SocialShareProps {
  title: string
  url: string
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const shareOnLinkedin = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(linkedinUrl, '_blank', 'width=550,height=420')
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'width=550,height=420')
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Share:</span>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={shareOnTwitter}
          className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareOnLinkedin}
          className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
        >
          <Linkedin className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareOnFacebook}
          className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>

        {/* Native Share API for mobile */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            variant="outline"
            size="sm"
            onClick={nativeShare}
            className="md:hidden"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}