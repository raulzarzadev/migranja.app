import { ReactNode } from 'react'

const H1 = ({ children }: { children: ReactNode }) => {
  return <h1 className="text-lg font-bold text-center">{children}</h1>
}

export default H1
