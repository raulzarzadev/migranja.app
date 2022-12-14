import Icon from 'components/Icon'
import { useEffect, useRef, useState } from 'react'

const InstallButton = () => {
  const [showInstallButton, setShowInstallButton] = useState(false)
  useEffect(() => {
    let deferredPrompt
    const btnAdd = document?.getElementById('btn-install')
    window.addEventListener('beforeinstallprompt', function (e) {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      deferredPrompt = e
    })

    // Installation must be done by a user gesture! Here, the button click
    btnAdd?.addEventListener('click', (e) => {
      // hide our user interface that shows our A2HS button
      btnAdd.style.display = 'none'
      // Show the prompt
      deferredPrompt
        ?.prompt()
        .then((res) => console.log(res))
        .catch((error) => {
          console.log(`----> ${error}`)
        })
      // Wait for the user to respond to the prompt
      // deferredPrompt?.userChoice?.then((choiceResult) => {
      //   if (choiceResult.outcome === 'accepted') {
      //     console.log('User accepted the A2HS prompt')
      //   } else {
      //     console.log('User dismissed the A2HS prompt')
      //   }
      //   deferredPrompt = null
      // })
    })
  }, [])

  return (
    <div>
      <button className="btn btn-info btn-sm m-2" id="btn-install">
        <span className="hidden sm:block mr-1">Install app</span>
        <Icon name="install" />
      </button>
    </div>
  )
}

export default InstallButton
