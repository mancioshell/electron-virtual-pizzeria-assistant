import { Badge } from 'react-bootstrap'
import { useState, useEffect } from 'react'

function Footer() {
  const [appVersion, setAppVersion] = useState('')

  useEffect(() => {
    const getCustomerList = async () => {
      let appVersion = await window?.api?.getAppVersion()
      setAppVersion(appVersion)
    }

    getCustomerList()
  }, [])

  return (
    <footer>
      <p>
        Power by{' '}
        <Badge variant="light">
          <a
            href="https://github.com/mancioshell"
            target="_blank"
            rel="noreferrer">
            mancioshell
          </a>
        </Badge>{' '}
        &nbsp; - &nbsp; Version &nbsp;
        <a
          href={`https://github.com/mancioshell/electron-virtual-pizzeria-assistant/releases/download/v${appVersion}/VirtualPizzeriaAssistantInstaller.exe`}
          target="_blank"
          rel="noreferrer">
          {appVersion}
        </a>
      </p>
    </footer>
  )
}

export { Footer }

export default Footer
