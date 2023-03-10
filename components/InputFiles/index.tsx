import Icon from '@comps/Icon'
import Modal from '@comps/modal'
import ModalDelete from '@comps/modal/ModalDelete'
import { uploadImage } from '@firebase/Users/main'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const InputFiles = ({
  fieldName,
  images = [],
  setImages
}: {
  fieldName: string
  images: string[]
  setImages: (images: string[]) => void
}) => {
  const [_images, _setImages] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  const handleRemoveImageByIndex = (index: number) => {
    console.log({ index })
    const aux = [..._images]
    aux.splice(index, 1)
    _setImages(aux)
  }

  console.log({ _images })

  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          handleOpenModal()
        }}
        className="cursor-pointer  w-full h-full  flex justify-center items-center group"
      >
        <span className="group-hover:scale-125">
          <Icon name="camera" />
        </span>
      </button>
      <Modal
        open={openModal}
        handleOpen={handleOpenModal}
        title="Subir imagenes"
      >
        <div className="flex gap-2 p-2 flex-wrap">
          {images?.map((image, i) => (
            <PreviewImage key={i} image={image} />
          ))}
          {_images.map((image, i) => (
            <UploadingAndDisplayFile
              key={i}
              file={image}
              fieldName={fieldName}
              handleRemoveImage={() => handleRemoveImageByIndex(i)}
              setImageURL={(url: string) => setImages([...images, url])}
            />
          ))}
        </div>
        <label>
          <div className="border-2 border-dashed w-full h-52 rounded-lg border-black cursor-pointer hover:border-dotted flex justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <span>Seleccionar imagenes</span>
              <div className="divider">o</div>
              <span>Arrastrar aquí</span>
            </div>
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              let auxArr = []
              const files = e.target.files
              if (files)
                for (let i = 0; i < files?.length; i++) {
                  const file = files[i]
                  auxArr.push(file)
                }
              _setImages([..._images, ...auxArr])
            }}
          />
        </label>
      </Modal>
    </div>
  )
}

const UploadingAndDisplayFile = ({
  file,
  fieldName,
  handleRemoveImage,
  setImageURL
}: {
  file: any
  fieldName: string
  handleRemoveImage?: (image: string) => void
  setImageURL: (url: string) => void
}) => {
  const [progress, setProgress] = useState(10)
  const [_imageURL, _setImageURL] = useState('')
  useEffect(() => {
    if (file) {
      uploadImage(file, fieldName, (res) => {
        setProgress(res.progress)
        if (res.downloadURL) {
          setImageURL(res.downloadURL)
          _setImageURL(res.downloadURL)
        }
      })
    }
  }, [fieldName, file, setImageURL])
  console.log({ progress, _imageURL, file })
  const [preview, setPreview] = useState('')
  useEffect(() => {
    // create the preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return (
    <div className="w-20 aspect-square relative ">
      {/* <img src={} /> */}
      {preview && (
        <div
          className={`relative w-full h-full ${
            progress < 100 ? 'opacity-70' : 'opacity-100'
          }`}
        >
          <PreviewImage image={preview} handleRemoveImage={handleRemoveImage} />
          <progress
            className="progress absolute bottom-0  "
            value={progress}
            max={100}
          />
        </div>
      )}
    </div>
  )
}

export const PreviewImage = ({
  image,
  handleRemoveImage
}: {
  image: string
  handleRemoveImage?: (image: string) => void
}) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <>
      <div className="relative w-full h-full ">
        <button
          className="w-full h-full cursor-pointer relative"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleOpen()
          }}
        >
          <Image
            src={image}
            alt="uploaded file"
            fill
            className="object-cover"
          />
        </button>
        {handleRemoveImage && (
          <ModalDelete
            handleDelete={async () => {
              handleRemoveImage(image)
              return true
            }}
            text="Eliminar esta imagen de forma permanente"
            title="Descartar imagen"
            openModalItem={(props) => (
              <button className="absolute top-1 right-1 hover:" {...props}>
                <Icon name="delete" size="xs" />
              </button>
            )}
          />
        )}
      </div>
      <Modal open={open} handleOpen={handleOpen} title="Image" size="full">
        <div className="relative w-full aspect-square">
          <Image
            src={image}
            alt="uploaded file"
            fill
            className="object-cover"
          />
        </div>
      </Modal>
    </>
  )
}

export default InputFiles
