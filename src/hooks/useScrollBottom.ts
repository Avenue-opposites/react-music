import { throttle } from 'lodash'
import { RefObject, useEffect } from 'react'

export interface Options {
  ref: RefObject<HTMLElement>;
  callback: (e: Event) => void;
  time?: number;
  distance?: number;
}

export default function useScrollBottom(
  { ref, callback, time = 1000, distance = 300} : Options
) {
  
  useEffect(() => {
    const { current } = ref
    if (!current) return

    const el = current

    const handler = throttle((event: Event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLDivElement

      if (scrollTop + clientHeight >= scrollHeight - distance) {
        callback(event)
      }
    }, time)

    el.addEventListener('scroll', handler)

    return () => {
      el.removeEventListener('scroll', handler)
    }
  }, [ref, time, distance, callback])
}