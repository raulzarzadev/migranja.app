import { useState } from 'react'

const useProgress = () => {
  const [progress, setProgress] = useState(0)
  return { setProgress, progress }
}

export default useProgress
