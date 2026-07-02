

import Text from '../components/HomeComponents/TextSection'
import Offerings from '../components/HomeComponents/Offerings'
import Featured from '../components/HomeComponents/Featured'
import CTA from '../components/HomeComponents/CTA'
import Why from '../components/HomeComponents/Why'
import AuthorLaunchModal from '../components/BaseComponents/AuthorLaunchModal'


export default function Home() {

    return(
        <>
        <AuthorLaunchModal />
        <Text />
        {/* <Offerings /> */}
        <Featured />
        {/* <CTA /> */}
        {/* <Why /> */}
        </>
    )
}