import BeeDevLogo from '../../assets/images/BDS_Logo_No_BG.png'
import Button from '../ui/Button'

import './baseComponents.css'

export default function Footer() {

    return(
        <footer>
          <img
            src={BeeDevLogo}
            alt="BeeDev Services Logo"
            className="footer-logo"
          />
          <p className="footer-text">Powered by <a href="https://beedev-services.com" target='_blank'>BeeDev Services LLC</a></p>
          <nav>
            <Button
              variant='bare'
              size='sm'
              href="/privacy"
            >
              Privacy Policy
            </Button>
            <Button
              variant='bare'
              size='sm'
              href="/terms"
            >
              Terms and Conditions
            </Button>
          </nav>
      </footer>
    )
}