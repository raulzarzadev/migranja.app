import Icon from '@comps/Icon'
import Loading from '@comps/Loading'
import Modal from '@comps/modal'
import { uploadAnimalsArray } from '@firebase/Animal/main'
import { saveAs } from 'file-saver'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectFarmAnimals, selectFarmState } from 'store/slices/farmSlice'

const generateJsonFile = ({
  data,
  fieldName = 'data'
}: {
  data: any
  fieldName: string
}) => {
  const jsonData = JSON.stringify(data)
  const blob = new Blob([jsonData], { type: 'application/json' })
  saveAs(blob, `${fieldName}.json`)
}

const BackupButton = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const currantFarm = useSelector(selectFarmState)
  const [openUpload, setOpenUpload] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleOpenUpload = () => {
    setOpenUpload(!openUpload)
  }
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const handleFileChange = (file: File | null) => {
    setDone(false)
    setError(false)
    setSelectedFile(file)
  }

  const handleUpload = () => {
    if (selectedFile) {
      console.log({ selectedFile })
      const reader = new FileReader()
      reader.readAsText(selectedFile, 'UTF-8')

      reader.onload = (event) => {
        const jsonString = event?.target?.result as string
        const jsonObject = JSON.parse(jsonString)
        // Utilizar el objeto JSON...
        setLoading(true)

        uploadAnimalsArray(jsonObject, {
          deleteFarmData: true,
          newFarmData: { id: currantFarm?.id, name: currantFarm?.name },
          deleteId: true
        })
          .then((res) => {
            // console.log(res)
            setLoading(false)
            if (res.ok) {
              setDone(true)
            } else {
              setDone(false)
              setError(true)
            }
          })
          .catch((err) => {
            console.error(err)
            setLoading(false)
            setError(true)
          })
      }
    }
  }
  const [openUploadModal, setOpenUploadModal] = useState(false)
  const handleOpenUploadModal = () => {
    setOpenUploadModal(!openUploadModal)
  }
  const [openBackup, setOpenBackup] = useState(false)
  const handleOpenBackup = () => {
    setOpenBackup(!openBackup)
  }

  return (
    <>
      <div className="my-4 text-center">
        <button
          className="btn btn-outline   "
          onClick={(e) => {
            e.preventDefault()
            handleOpenBackup()
          }}
        >
          Respaldos
        </button>
      </div>
      <Modal open={openBackup} handleOpen={handleOpenBackup} title="Respaldos">
        <div className=" text-center">
          <button
            className="btn btn-outline m-2 "
            onClick={(e) => {
              e.preventDefault()
              generateJsonFile({ data: farmAnimals, fieldName: 'animales' })
            }}
          >
            Respaldo de animales (.json)
            <span className="ml-2">
              <Icon name="download" />
            </span>
          </button>
          <button
            className="btn btn-outline m-2 "
            onClick={(e) => {
              e.preventDefault()
              handleOpenUpload()
            }}
          >
            Restaurar animales (.json){' '}
            <span className="ml-2">
              <Icon name="upload" />
            </span>
          </button>
          <Modal
            open={openUpload}
            handleOpen={handleOpenUpload}
            title="Restaurar animales"
          >
            <div>
              Deberas seleccionar un archivo .json debidamente formateado
            </div>
            <div>
              <FileInput
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  handleFileChange(file)
                }}
                fileName={selectedFile?.name || ''}
                label="Selecciona archivo de animales"
              />

              {selectedFile && (
                <div className="text-center mt-4 ">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleOpenUploadModal()
                    }}
                    className="btn btn-md "
                  >
                    Subir
                  </button>
                </div>
              )}
              <Modal
                open={openUploadModal}
                handleOpen={handleOpenUploadModal}
                title="Subir archivo"
              >
                <div>
                  <h5 className="text-error font-bold">Importante</h5>
                  <p className=" border-red-500 border-2 p-2 whitespace-pre-line">
                    {`Antes de agregar los nuevos datos de animales, se verificará que el archivo tenga el formato correcto. 

                Si ya existe un animal con el mismo identificador, se actualizarán sus datos con los nuevos.`}
                  </p>
                  <p className="text-center my-2">
                    ¿Deseas subir este archivo de animales?
                  </p>
                  <div className="text-center mt-4">
                    {error && (
                      <div className="border border-error">
                        <div className="flex w-full justify-center text-error">
                          <Icon name="baned" />
                        </div>
                        <p className="whitespace-pre-line">
                          {`Ocurrio un error.
                      Cambia el archivo o recarga la página e
                      intentalo de nuevo`}
                        </p>
                      </div>
                    )}
                    {done ? (
                      <div className="flex justify-center text-success">
                        Archivo cargado <Icon name="done" />
                      </div>
                    ) : (
                      <>
                        {loading ? (
                          <button disabled className="btn ">
                            Subiendo{' '}
                            <span className="ml-2">
                              <Loading />
                            </span>
                          </button>
                        ) : (
                          <button
                            disabled={error}
                            onClick={(e) => {
                              e.preventDefault()
                              handleUpload()
                            }}
                            className="btn  mx-auto"
                          >
                            Subir
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Modal>
            </div>
          </Modal>
        </div>
      </Modal>
    </>
  )
}

function FileInput({
  onChange,
  fileName,
  label = 'Selecciona un archivo'
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileName: string
  label?: string
}) {
  return (
    <div className="mt-2">
      <label htmlFor="file-input" className="block  font-bold mb-2">
        {label}:
      </label>
      <div className="flex items-center justify-between flex-col sm:flex-row border border-base-content py-2 px-4 w-full">
        <span className="text-gray-600  ">
          {fileName || 'Ningún archivo seleccionado'}
        </span>
        <label htmlFor="file-input" className="btn btn-sm">
          Seleccionar archivo
        </label>
        <input
          accept=".json"
          id="file-input"
          type="file"
          name="file"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default BackupButton
