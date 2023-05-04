import { AnimalType } from 'types/base/AnimalType.model'
import useWeaning, { WeaningTypes } from './hooks/useWeaning'
import { FarmEvent } from 'types/base/FarmEvent.model'
import useProgress from './hooks/useProgress'
import { useEffect } from 'react'
import ProgressButton from './ProgressButton'
import ProgressBar from './ProgressBar'

const WeaningOptions = ({
  animalId,
  eventId,
  animalsIds = []
}: {
  eventId?: FarmEvent['id']
  animalId?: AnimalType['id']
  animalsIds?: AnimalType['id'][]
}) => {
  interface Ops {
    label: string
    helperText: string
    onWeaning: ({ weaningType }: { weaningType: WeaningTypes }) => any
  }

  const {
    handleWeaning,
    progress: weaningProgress,
    handleWeaningAnimals
  } = useWeaning()
  const options: Record<WeaningTypes, Ops> = {
    FATTEN: {
      label: 'Para engorda',
      helperText: '* Aun no esta listo para vender. Puede ser hembra o macho',
      onWeaning: async ({ weaningType }: { weaningType: WeaningTypes }) => {
        if (!!animalsIds.length) {
          handleWeaningAnimals({ animalsIds, weaningType })
        }
        if (!!animalId) {
          await handleWeaning({ animalId, weaningType })
        }
      }
    },
    FOR_SALE: {
      label: 'Para venta',
      helperText: '* Puede ser vendido ahora.',
      onWeaning: async ({ weaningType }: { weaningType: WeaningTypes }) => {
        if (!!animalsIds.length) {
          handleWeaningAnimals({ animalsIds, weaningType })
        }
        if (!!animalId) {
          await handleWeaning({ animalId, weaningType })
        }
      }
    },
    FOR_BELLY: {
      label: 'Para vientre',
      helperText: '* Una hembra que formara parte del ganado principal.',
      onWeaning: async ({ weaningType }: { weaningType: WeaningTypes }) => {
        if (!!animalsIds.length) {
          handleWeaningAnimals({ animalsIds, weaningType })
        }
        if (!!animalId) {
          await handleWeaning({ animalId, weaningType })
        }
      }
    }
  }
  return (
    <div>
      <ProgressBar progress={weaningProgress} />
      <div className="flex flex-col sm:flex-row w-full justify-evenly items-center">
        {Object.entries(options).map(([type, describe]) => (
          <ButtonOption
            disabled={weaningProgress > 0}
            key={type}
            onClick={(e) => {
              e.preventDefault()
              describe.onWeaning({ weaningType: type as WeaningTypes })
            }}
            label={describe.label}
            helperText={describe.helperText}
          />
        ))}
      </div>
    </div>
  )
}

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  helperText: string
  label: string
  type?: any
}

const ButtonOption: React.FC<ButtonProps> = ({ ...props }) => {
  const { label, helperText, ...rest } = props
  return (
    <div className="sm:w-1/3 flex justify-start  flex-col items-center ">
      <button className="btn btn-info mt-5 btn-outline  " {...rest}>
        <span className="truncate">{label}</span>
      </button>
      <p className="whitespace-pre-wrap text-xs ">{helperText}</p>
    </div>
  )
}

export default WeaningOptions
