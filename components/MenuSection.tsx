import { ReactNode } from 'react'
import H1 from './Basics/Title1'

const MenuSection = ({
  title = 'section title',
  children
}: {
  title?: string
  children: ReactNode
}) => {
  return (
    <section className="w-full p-2 bg-base-300 rounded-md shadow-md ">
      <H1>{title}</H1>
      {children}
    </section>
  )
}

export default MenuSection
