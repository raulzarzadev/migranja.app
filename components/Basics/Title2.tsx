import { ReactNode } from 'react'

const H2 = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-lg font-bold">{children}</h2>
}

export default H2
