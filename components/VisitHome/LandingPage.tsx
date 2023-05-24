import Icon from '@comps/Icon'
import { googleLogin } from '@firebase/Users/main'
import Image from 'next/image'
import { ReactNode } from 'react'

function LandingPage() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
      <Square className="sm:col-span-2 min-h-32 flex justify-center items-center flex-col p-2 py-6 text-center">
        <h1 className="text-3xl text-center">
          Mantener el control de tu granja.{' '}
        </h1>
        <p className="my-1">Herramientas intuitivas.</p>
        <p className="my-1">
          Explora todas las funcionalidades con nuestra{' '}
          <strong className="font-bold">capa gratuita</strong>
        </p>
        <p className="my-1">
          En cualquier dispositivo con internet y desde tu{' '}
          <strong className="font-bold">navegador</strong>
        </p>
        <p className="my-1">Registrate con tu cuenta de google</p>
        <button
          className="btn btn-xl mt-2 text-white"
          onClick={(e) => {
            e.preventDefault()
            googleLogin()
          }}
        >
          Empieza gratis
          <span className="m-2">
            <Icon name="google" />
          </span>
        </button>
      </Square>
      <Card
        title={'Reproducción'}
        text={'Conoce la genetica de tus animales al detalle, evita cruzas'}
        image={'/assets/images/HomeVisit/corderitos.webp'}
      />
      <Card
        title={'Sanidad'}
        text={'Manten sano a tu ganado. Evita perdidas por muerte'}
        image={'/assets/images/HomeVisit/oveja_veterinario.webp'}
      />
      <Card
        title={'Control'}
        text={'Monitorea el estado de tu ganado.  '}
        image={'/assets/images/HomeVisit/arete2.png'}
      />
      <Card
        title={'Clima'}
        text={
          'Mantente preparado. Mira el pronostico del clima de la semana en tu granja '
        }
        image={'/assets/images/HomeVisit/rancho_parcela.jpeg'}
      />
    </div>
  )
}

const Card = ({
  text,
  title,
  image
}: {
  text: string
  title: string
  image: string
}) => {
  return (
    // <Square className="">
    //   <div className="flex flex-col min-h-32 ">
    //     <div className="sm:w-1/2 p-2 h-full">
    //       <h3 className="font-bold">{title}</h3>
    //       <p className="text-xs sm:text-sm  ">{text}</p>
    //     </div>
    //     <div className="relative h-24 rounded-b-md sm:w-1/2 sm:h-full sm:rounded-md  ">
    //       <Image
    //         src={image}
    //         fill
    //         alt="image"
    //         className="object-cover rounded-b-md sm:rounded-r-md bottom-0"
    //       />
    //     </div>
    //   </div>
    // </Square>
    <Square className="">
      <div className="flex h-32">
        <div className="w-1/2 p-2 ">
          <h2 className="font-bold">{title}</h2>
          <p className="text-sm ">{text}</p>
        </div>
        <div className="relative w-1/2 h-full rounded-md">
          <Image
            src={image}
            fill
            alt="image"
            className="object-cover rounded-r-md"
          />
        </div>
      </div>
    </Square>
  )
}

const Square = ({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`bg-base-300 rounded-md shadow-lg  ${className}`}>
      {children}
    </div>
  )
}

export default LandingPage
