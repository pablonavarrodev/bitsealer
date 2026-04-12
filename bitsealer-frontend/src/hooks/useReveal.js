
import { useEffect, useRef } from 'react'

export default function useReveal(delay = 0) {
    const ref = useRef(null)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            el.style.animationDelay = `${delay}ms`
            el.classList.add('reveal')
            obs.disconnect()
        }
        }, { threshold: 0.1 })
        obs.observe(el)
        return () => obs.disconnect()
    }, [delay])
    return ref
}
