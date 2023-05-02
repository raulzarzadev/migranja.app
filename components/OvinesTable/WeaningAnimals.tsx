import AnimalsListNumbers from '@comps/FarmNumbers/AnimalsListNumbers'
import Icon from '@comps/Icon'
import useModal from '@comps/hooks/useModal'
import Modal from '@comps/modal'
import AsyncModal from '@comps/modal/AsyncModal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import { AnimalType } from 'types/base/AnimalType.model'

export interface WeaningAnimal
  extends Pick<AnimalType, 'earring' | 'id' | 'name'> {
  state: AnimalType['state'] | string
}

const WeaningAnimals = ({
  earringsSelected
}: {
  earringsSelected: WeaningAnimal[]
}) => {
  const animalsLactating = earringsSelected.filter(
    (animal) => animal.state === 'LACTATING'
  )
  const modal = useModal()
  // const handleWeaningAnimals = (earrings: AnimalType['earring'][]) => {
  //   console.log({ earrings })
  // }

  return (
    <div>
      {!!animalsLactating.length && (
        <div className="flex w-full justify-center">
          <div className="flex w-full justify-center">
            <AsyncModal
              openIcon="bell"
              openButtonClassName="text-info btn btn-outline"
              saveLabel="Destetar"
              saveIcon="bell"
              btnLabel="Destetar animales"
              modalTitle={'Destetando'}
              handleAccept={async function (): Promise<number | boolean> {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    console.log('hola')
                    resolve(true)
                  }, 5000)
                })
              }}
            >
              <>
                {!animalsLactating.length && (
                  <div>Ni uno de estos animales esta lactando</div>
                )}

                <h4>Destetar los siguientes animales</h4>
                <div className="flex w-full justify-evenly flex-wrap gap-2">
                  <AnimalsListNumbers
                    selectDisabled
                    earringsSelected={animalsLactating.map(
                      ({ earring }) => earring
                    )}
                    animals={animalsLactating}
                    title="Animales a destetar"
                  />
                </div>
                <div>
                  {/* <progress
                    className="progress"
                    value={10}
                    max={100}
                  ></progress> */}
                </div>
              </>
            </AsyncModal>
          </div>
        </div>
      )}
    </div>
  )
}

export default WeaningAnimals
