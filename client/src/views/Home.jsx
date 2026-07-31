import AuthorLaunchModal from '../components/BaseComponents/AuthorLaunchModal'
import Text from '../components/HomeComponents/TextSection'
import Offerings from '../components/HomeComponents/Offerings'
import Featured from '../components/HomeComponents/Featured'
import Why from '../components/HomeComponents/Why'

export default function Home() {

    return(
        <>
        <AuthorLaunchModal />
        <Text />
        {/* <Offerings /> */}
        <Featured />
        {/* <Why /> */}
        </>
    )
}