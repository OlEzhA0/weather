import { useEffect } from 'react'

export const useTabTitle = (title: string): void => {
  useEffect(() => {
    document.title = title
  }, [title])
}
