import { useEffect, useRef } from 'react'

export default function usePolling(
  callback: (ref: { cancel: () => void }) => void, 
  delay: number
) {
  const ref = useRef<{
    timer: NodeJS.Timeout | null,
    savedCallback: typeof callback | null,
    cancel: (() => void) | null
  }>({
    timer: null,
    savedCallback: null,
    cancel: null,
  })

  useEffect(() => {
    ref.current.savedCallback = callback
  }, [callback])

  useEffect(() => {
    const { savedCallback } = ref.current

    ref.current.timer = setInterval(() => {
      savedCallback?.(ref.current as { cancel: () => void })
    }, delay)

    ref.current.cancel = () => {
      clearInterval(ref.current.timer!)
      ref.current.timer = null
    }

    return ref.current.cancel as () => void

  }, [delay])
}