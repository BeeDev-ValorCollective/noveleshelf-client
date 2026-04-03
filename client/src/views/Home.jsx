// import { useEffect, useState } from 'react'

import Text from '../components/HomeComponents/TextSection'
import Offerings from '../components/HomeComponents/Offerings'
import Featured from '../components/HomeComponents/Featured'
import CTA from '../components/HomeComponents/CTA'
import Why from '../components/HomeComponents/Why'


export default function Home() {
    // const [server, setServer] = useState([])
    // useEffect(() => {
    //     fetch("http://localhost:8000/api/health/")
    //         .then(res => res.json())
    //         .then((data) => {
    //             console.log("data", data)
    //             setServer("Talking to backend")
    //         })
    //         .catch(err => console.error("Connection failed:", err));
    // }, []);

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