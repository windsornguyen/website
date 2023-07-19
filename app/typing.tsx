import { useEffect, useState } from 'react'

const name = "Windsor Nguyễn"
 export const Typing = () => {
    const[typing, setTyping] = useState('')
    useEffect(() = {
        setTimeout(() => {
            setTyping(typing)
        }, 1000)
    }, [])
 }