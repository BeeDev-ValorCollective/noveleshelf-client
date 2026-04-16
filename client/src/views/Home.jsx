import { useEffect, useState } from 'react'

import Text from '../components/HomeComponents/TextSection'
import Offerings from '../components/HomeComponents/Offerings'
import Featured from '../components/HomeComponents/Featured'
import CTA from '../components/HomeComponents/CTA'
import Why from '../components/HomeComponents/Why'

const DB_API = `${import.meta.env.VITE_DB_API}`


export default function Home() {
    // const [server, setServer] = useState([])
    // const [user, setUser] = useState([])
    // useEffect(() => {
    //     fetch(DB_API + "debug/health/")
    //         .then(res => res.json())
    //         .then((data) => {
    //             console.log("data", data)
    //             setServer("Talking to backend")
    //         })
    //         .catch(err => console.error("Connection failed:", err));
    // }, []);
    // useEffect(() => {
    //     fetch(DB_API + "public/authors/")
    //         .then(res => res.json())
    //         .then((authors) => {
    //             console.log("authors", authors)
    //             setUser(authors)
    //         })
    //         .catch(err => console.error("Connection failed:", err));
    // }, [])

    return(
        <>
        <Text />
        <Offerings />
        <Featured />
        <CTA />
        <Why />
        </>
    )
}