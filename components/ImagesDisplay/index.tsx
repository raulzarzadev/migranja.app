import InputFiles, { PreviewImage } from '@comps/InputFiles'
import { deleteImage } from '@firebase/Users/main'
import Image from 'next/image'
import { useState } from 'react'

const ImagesDisplay = ({
  images,
  setImages
}: {
  images: any[]
  setImages: (images: string[]) => void
}) => {
  const [displayImageIndex, setDisplayImageIndex] = useState(0)
  const handleRemoveImage = async (image: string) => {
    //* Remove from animal
    const imageIndex = images.indexOf(image)
    const aux = images
    aux.splice(imageIndex, 1)
    setImages(aux)
    //* Remove from storage
    const res = await deleteImage({ url: image })
    console.log({ res })
  }

  const imageLoader = ({ src, width, quality }: any) => {
    return `${src}?w=${width}&q=${quality || 75}`
  }

  return (
    <div className="w-full">
      <div className="grid grid-flow-col w-min max-w-full overflow-x-auto">
        <div className="w-10 aspect-square grid content-center ">
          <InputFiles
            fieldName="animalImages"
            images={images}
            setImages={setImages}
          />
        </div>
        {images.map((image, i) => (
          <div
            key={i}
            className={`w-12 aspect-square relative border-4  border-transparent cursor-pointer ${
              displayImageIndex === i && ' border-white'
            }`}
            onClick={(e) => {
              e.preventDefault()
              setDisplayImageIndex(i)
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              blurDataURL={image}
            />
          </div>
        ))}
      </div>
      <figure className="w-full  aspect-video flex justify-center items-center bg-base-200 shadow-sm relative">
        {typeof images?.[displayImageIndex] === 'string' && (
          <PreviewImage
            image={images[displayImageIndex]}
            handleRemoveImage={handleRemoveImage}
          />
        )}
      </figure>
    </div>
  )
}

export default ImagesDisplay
