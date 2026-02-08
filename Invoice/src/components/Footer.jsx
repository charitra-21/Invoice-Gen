import React from 'react'
import { footerStyles } from '../assets/dummyStyles'

const Footer = () => {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.container}>
       <div className={footerStyles.copyright}>
            &copy; {new Date().getFullYear()} InvoiceAI. All rights reserved.
       </div>
         <div className={footerStyles.links}>
            <a href="/terms" className={footerStyles.link}>Terms of Service</a>
            <a href="/privacy" className={footerStyles.link}>Privacy</a>
         </div>
      </div>
    </footer>
  )
}

export default Footer
