import { useEffect, useRef } from 'react'

type UseInfiniteScrollProps = {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}

export const useInfiniteScroll = ({ onLoadMore, hasMore, isLoading }: UseInfiniteScrollProps) => {
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = observerRef.current

    if (!element || !hasMore || isLoading) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onLoadMore()
      }
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [onLoadMore, hasMore, isLoading])

  return observerRef
}
