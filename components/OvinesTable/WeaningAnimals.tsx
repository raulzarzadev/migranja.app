import AnimalsListNumbers from '@comps/FarmNumbers/AnimalsListNumbers'
import Icon from '@comps/Icon'
import WeaningOptions from '@comps/WeaningOptions'
import useModal from '@comps/hooks/useModal'
import useProgress from '@comps/hooks/useProgress'
import useWeaning, { WeaningTypes } from '@comps/hooks/useWeaning'
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
  const animalsLactating = earringsSelected?.filter(
    (animal) => animal.state === 'LACTATING'
  )

  return (
    <div>
      {!!animalsLactating?.length && (
        <div className="flex w-full justify-center">
          <div className="flex w-full justify-center">
            <AsyncModal
              openIcon="bell"
              openButtonClassName="text-info btn btn-outline"
              saveLabel="Destetar"
              saveIcon="bell"
              btnLabel="Destetar animales"
              modalTitle={'Destetando'}
              // handleAccept={async function (): Promise<number | boolean> {
              //   handleWeaningAnimals(animalsLactating, {
              //     weaningType: 'FOR_SALE'
              //   })
              // }}
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
                  <WeaningOptions
                    animalsIds={animalsLactating.map((a) => a.id)}
                  />
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
