import Icon from '@comps/Icon'
import Loading from '@comps/Loading'
import ProgressBar from '@comps/ProgressBar'
import ProgressButton from '@comps/ProgressButton'
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
  const [_images, _setImages] = useState<File[]>([])
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    setOpenModal(!openModal)
  }
  const handleRemoveImageByIndex = (index: number) => {
    const aux = [..._images]
    aux.splice(index, 1)
    _setImages(aux)
  }

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
        <div className="flex gap-2 p-2 flex-wrap mb-7 ">
          {_images.map((image, i) => (
            <div key={i} className="w-36 aspect-square">
              <UploadingAndDisplayFile
                key={image.name}
                file={image}
                fieldName={fieldName}
                handleRemoveImage={() => handleRemoveImageByIndex(i)}
                setImageURL={(url: string) => {
                  setImages([...images, url])
                  const newArr = _images.filter(
                    (file) => file.name !== image.name
                  )
                  _setImages(newArr)
                }}
              />
            </div>
          ))}
        </div>
        <label>
          <div className="border-2 border-dashed w-full h-24 rounded-lg border-black cursor-pointer hover:border-dotted flex justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <span>Seleccionar imagenes</span>
              {/* <div className="divider">o</div>
              <span>Arrastrar aquí</span> */}
            </div>
          </div>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg"
            className="hidden"
            onBlur={(e) => {
              console.log(e)
            }}
            onChange={(e) => {
              let auxArr = []
              const files = e.target.files
              if (files?.length) {
                for (let i = 0; i < files?.length; i++) {
                  const file = files[i]
                  auxArr.push(file)
                }
                _setImages([..._images, ...auxArr])
              }
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
  const [progress, setProgress] = useState(0)
  const [_imageURL, _setImageURL] = useState('')
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
    }
    return URL.revokeObjectURL(file)
  }, [file])
  const handleUpload = () => {
    uploadImage(file, fieldName, (res) => {
      setProgress(res.progress)
      if (res.downloadURL) {
        setImageURL(res.downloadURL)
        _setImageURL(res.downloadURL)
      }
    })
  }
  const [preview, setPreview] = useState('')

  return (
    <div className="w-full h-full relative ">
      {preview && (
        <div className={`relative w-full h-full `}>
          <PreviewImage image={preview} handleRemoveImage={handleRemoveImage} />
          {/* <ProgressBar progress={progress} /> */}
          {/* <progress
            className="progress absolute bottom-0 bg-primary "
            value={progress}
            max={100}
          /> */}
          <ProgressButton
            progress={progress}
            buttonLabel="Subir"
            errorLabel="Error. Intenta despues"
            onClick={(e) => {
              e.preventDefault()
              setProgress(5)
              handleUpload()
            }}
          />
          {/* <div className="flex w-full justify-center">
            <button
              className="btn btn-xs flex "
              onClick={(e) => {
                e.preventDefault()
                setProgress(5)
                handleUpload()
              }}
              disabled={progress > 0}
            >
              Subir <span className="ml-1">{progress > 0 && <Loading />}</span>
            </button>
          </div> */}
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
            blurDataURL={image}
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
              <button
                className="absolute top-1 right-1 text-error hover:scale-125 btn btn-xs btn-ghost btn-circle"
                {...props}
              >
                <Icon name="delete" size="sm" />
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
