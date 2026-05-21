import { useEffect, useState } from 'react'

import Text from '../components/HomeComponents/TextSection'
import Offerings from '../components/HomeComponents/Offerings'
import Featured from '../components/HomeComponents/Featured'
import CTA from '../components/HomeComponents/CTA'
import Why from '../components/HomeComponents/Why'


export default function Home() {

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