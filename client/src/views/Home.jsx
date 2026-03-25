import { useEffect } from 'react'

import Text from '../components/HomeComponents/TextSection'
import Offerings from '../components/HomeComponents/Offerings'
import Featured from '../components/HomeComponents/Featured'
import CTA from '../components/HomeComponents/CTA'
import Why from '../components/HomeComponents/Why'


export default function Home() {
    // useEffect(() => {
    //     fetch("http://localhost:8000/api/health/")
    //         .then(res => res.json())
    //         .then(data => console.log(data))
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