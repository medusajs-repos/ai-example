import { useEffect } from 'react'

interface MetaTags {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

export function useDocumentTitle(metaTags: MetaTags) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Update document title
    if (metaTags.title) {
      document.title = metaTags.title
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`) ||
                   document.querySelector(`meta[property="${name}"]`)
      
      if (!metaTag) {
        metaTag = document.createElement('meta')
        if (name.startsWith('og:')) {
          metaTag.setAttribute('property', name)
        } else {
          metaTag.setAttribute('name', name)
        }
        document.head.appendChild(metaTag)
      }
      
      metaTag.setAttribute('content', content)
    }

    if (metaTags.description) {
      updateMetaTag('description', metaTags.description)
    }

    if (metaTags.ogTitle) {
      updateMetaTag('og:title', metaTags.ogTitle)
    }

    if (metaTags.ogDescription) {
      updateMetaTag('og:description', metaTags.ogDescription)
    }

    if (metaTags.ogImage) {
      updateMetaTag('og:image', metaTags.ogImage)
    }

    // Cleanup function to reset title on unmount
    return () => {
      if (typeof window !== 'undefined') {
        document.title = 'Medusa Store'
      }
    }
  }, [metaTags])
}