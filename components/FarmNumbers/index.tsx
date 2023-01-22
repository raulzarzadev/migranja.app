import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import PDFAnimalsList from '@comps/PDFDocuments/PDFAnimalsList'

import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { OVINE_DAYS } from 'FARM_CONFIG/FARM_DATES'
import { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  FarmStateAnimalEvent,
  selectFarmAnimals,
  selectFarmEvents
} from 'store/slices/farmSlice'
import { AnimalType } from 'types/base/AnimalType.model'
import { myFormatDate } from 'utils/dates/myDateUtils'

import { calculateFarmNumbers } from './farmNumbers.helper'

const FarmNumbers = () => {
  const farmAnimals = useSelector(selectFarmAnimals)
  const farmEvents = useSelector(selectFarmEvents)

  const farmNumbers = calculateFarmNumbers({
    animals: farmAnimals,
    events: farmEvents
  })
  return (
    <div>
      <h2 className="text-xl font-bold text-center">Numeros y estadístcas</h2>
      <StatsRow title="Animales">
        <StatCardWithModalAnimalsList
          title="Total"
          animals={farmNumbers.activeAnimals}
          description="Todos los animals "
        />
        <StatCardWithModalAnimalsList
          title="Hembras"
          animals={farmNumbers.activeFemales}
          description="Hembras activos "
        />
        <StatCardWithModalAnimalsList
          title="Machos"
          animals={farmNumbers.activeMales}
          description="Machos activos "
        />
      </StatsRow>

      <StatsRow title="Hembras">
        <StatCardWithModalAnimalsList
          title="Lactantes"
          animals={farmNumbers.femalesBetween(0, OVINE_DAYS.finishWeaning)}
          description={`"Menores de ${OVINE_DAYS.finishWeaning} dias "`}
        />
        <StatCardWithModalAnimalsList
          title="Corderas"
          animals={farmNumbers.femalesBetween(
            OVINE_DAYS.finishWeaning,
            OVINE_DAYS.canBePregnant
          )}
          description={`Entre ${OVINE_DAYS.finishWeaning} y ${OVINE_DAYS.canBePregnant} dias`}
        />
        {/* <StatCardWithModalAnimalsList
          title="Primerisas"
          animals={farmNumbers.femalesBetween(
            OVINE_DAYS.canBePregnant,
            OVINE_DAYS.canBePregnant + 90
          )}
          description={`Entre ${OVINE_DAYS.canBePregnant} y ${
            OVINE_DAYS.canBePregnant + 90
          } dias`}
        /> */}
        <StatCardWithModalAnimalsList
          title="Edad reproductiva"
          animals={farmNumbers.femalesBetween(OVINE_DAYS.canBePregnant, 9999)}
          description={`Mayores de ${OVINE_DAYS.canBePregnant} dias`}
        />
        <StatCardWithModalAnimalsList
          title="Gestantes"
          animals={farmNumbers.pregnantAnimals() as AnimalType[]}
          description="En monta o antes de parir"
        />
        <StatCardWithModalAnimalsList
          title="Lactando"
          animals={
            farmNumbers.animalsLactando(
              OVINE_DAYS.finishWeaning
            ) as AnimalType[]
          }
          description="Aún amamantando "
        />
      </StatsRow>

      <StatsRow title="Machos">
        <StatCardWithModalAnimalsList
          title="Lactantes"
          animals={farmNumbers.malesBetween(0, OVINE_DAYS.finishWeaning)}
          description={`Menores de ${OVINE_DAYS.finishWeaning} dias`}
        />

        <StatCardWithModalAnimalsList
          title="En engorda"
          animals={farmNumbers.malesBetween(
            OVINE_DAYS.finishWeaning,
            OVINE_DAYS.canBePregnant
          )}
          description={`entre ${OVINE_DAYS.finishWeaning} y ${OVINE_DAYS.canBePregnant}`}
        />
        <StatCardWithModalAnimalsList
          title="Pasados "
          animals={farmNumbers.malesBetween(OVINE_DAYS.canBePregnant, 9000)}
          description={`Mas de ${OVINE_DAYS.canBePregnant} dias`}
        />
      </StatsRow>

      <StatsRow title="Últimos 30 días">
        <StatCardWithModalEventsList
          title="Partos"
          events={farmNumbers.birthsLastMonth}
          description={`Todos del ultimo mes`}
        />
        <StatCardWithModalAnimalsList
          title="Corderitos"
          animals={farmNumbers.newCalfsLastMonth as AnimalType[]}
          description={`Corderitos del ultimo mex`}
        />
      </StatsRow>

      <StatsRow title="Inventario">
        <StatCardWithModalEventsList
          title="Bajas"
          events={farmNumbers.dropOutAnimals}
          description={`Por muerte, perdidas o robadas`}
        />
        <StatCardWithModalEventsList
          title="Altas"
          events={farmNumbers.dropInAnimals}
          description={`Compras, nuevos lotes , etc.`}
        />
        <StatCardWithModalEventsList
          title="Partos"
          events={farmNumbers.births}
          description={`Todos en el historial`}
        />
        <StatCardWithModalAnimalsList
          title="Corderitos"
          animals={farmNumbers.newCalfs as AnimalType[]}
          description={`Corderitos nacidos`}
        />
      </StatsRow>

      {/* 
      <StatsRow title="Inventario (Bajas)">
        <StatCardWithModalEventsList
          title="Muertes"
          events={farmNumbers.deads}
          description={`Mayores de ${OVINE_DAYS.canBePregnant} dias`}
        />
        <StatCardWithModalEventsList
          title="Bajas"
          events={farmNumbers.dropOutAnimals}
          description={`Entre ${OVINE_DAYS.finishWeaning} y ${OVINE_DAYS.canBePregnant} dias`}
        />
      </StatsRow> */}
    </div>
  )
}
const StatCardWithModalEventsList = ({
  events,
  description = 'desc',
  title,
  ...rest
}: {
  events: FarmStateAnimalEvent[]
  description: string
  title: string
}) => {
  const [openList, setOpenList] = useState(false)
  const handleOpenList = () => {
    setOpenList(!openList)
  }
  return (
    <>
      <div
        className="w-[200px]"
        onClick={(e) => {
          e.preventDefault()
          handleOpenList()
        }}
      >
        <StatCard
          {...rest}
          quantity={events?.length}
          title={title}
          description={description}
        />
      </div>
      {openList && (
        <Modal
          open={openList}
          handleOpen={handleOpenList}
          title={`Lista de eventos: ${title} `}
        >
          <div>
            {console.log('rendering...')}
            <div className="grid grid-cols-5 ">
              <div>Fecha</div>
              <div>Madre</div>
              <div>Padre</div>
              <div className="col-span-2 text-center">Camada</div>
            </div>
            {events.map((event) => (
              <div key={event.id}>
                {event.type === 'BIRTH' && (
                  <div className="grid grid-cols-5">
                    <div>{myFormatDate(event.eventData.date, 'dd MM yy')}</div>
                    <div>
                      <ModalAnimalDetails
                        earring={event.eventData.parents.mother?.earring}
                      />
                    </div>
                    <div>
                      <ModalAnimalDetails
                        earring={event.eventData.parents.father?.earring}
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex w-full justify-between">
                        <span>({event.eventData.calfs?.length})</span>
                        {event.eventData.calfs?.map((animal) => (
                          <div key={animal?.earring}>
                            <ModalAnimalDetails earring={animal?.earring} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* <div className="relative">
          <AnimalsList animals={animals} title={title} />
        </div> */}
        </Modal>
      )}
    </>
  )
}

const StatCardWithModalAnimalsList = ({
  animals,
  description = 'desc',
  title,
  ...rest
}: {
  animals: AnimalType[]
  description: string
  title: string
}) => {
  const [openList, setOpenList] = useState(false)
  const handleOpenList = () => {
    setOpenList(!openList)
  }
  return (
    <>
      <div
        className="w-[200px]"
        onClick={(e) => {
          e.preventDefault()
          handleOpenList()
        }}
      >
        <StatCard
          {...rest}
          quantity={animals.length}
          title={title}
          description={description}
        />
      </div>
      {openList && (
        <Modal
          open={openList}
          handleOpen={handleOpenList}
          title={`Lista de aretes: ${title} `}
        >
          <div className="relative">
            <AnimalsList animals={animals} title={title} />
          </div>
        </Modal>
      )}
    </>
  )
}

const AnimalsList = ({
  animals,
  title
}: {
  title: string
  animals: AnimalType[]
}) => {
  const earringsWithOutSuffix = animals.filter((a) => !a.earring.includes('-'))
  const earringsWithSuffix = animals.filter((a) => a.earring.includes('-'))
  const sortByNumber = (a: any, b: any) => {
    const aEarring = parseFloat(a?.earring.split('-')[0] || '0')
    const bEarring = parseFloat(b?.earring.split('-')[0] || '0')

    if (aEarring < bEarring) return -1
    if (aEarring > bEarring) return 1
    return 0
  }
  const sortedByEarring = earringsWithOutSuffix.sort(sortByNumber)
  const sortedSuffixByEarring = earringsWithSuffix.sort(sortByNumber)

  const [openPDF, setOpenPDF] = useState(false)
  const handleOpenPDF = () => {
    setOpenPDF(!openPDF)
  }
  return (
    <div className="relative">
      {openPDF && (
        <Modal handleOpen={handleOpenPDF} open={openPDF} title="PDF">
          <PDFViewer height={500} width="100%">
            <PDFAnimalsList animals={animals} title={title} />
          </PDFViewer>
        </Modal>
      )}
      <div className="flex w-full justify-around">
        <button
          className="btn btn-outline"
          onClick={(e) => {
            e.preventDefault()
            handleOpenPDF()
          }}
        >
          Ver PDF
        </button>

        <PDFDownloadLink
          className="btn btn-outline"
          document={<PDFAnimalsList animals={animals} title={title} />}
          fileName={`Lista-de-animales:${title}.pdf`}
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Descargando ...' : 'Descargar PDF'
          }
        </PDFDownloadLink>
      </div>
      <div className="grid grid-flow-row auto-rows-fr grid-cols-3 sm:grid-cols-6">
        {[...sortedSuffixByEarring, ...sortedByEarring]?.map((animal, i) => (
          <div key={`${animal?.id}-${i}`} className="m-1">
            <span className="whitespace-nowrap">
              <ModalAnimalDetails earring={animal?.earring} size="sm" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const StatsRow = ({
  title = 'Title',
  children
}: {
  title: string
  children: ReactNode
}) => {
  return (
    <div>
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="grid">
        <div className="flex flex-row gap-2 overflow-x-auto overflow-y-hidden  h-[135px] items-top  snap-x ">
          {children}
        </div>
      </div>
    </div>
  )
}

const StatCard = ({
  title = 'title',
  quantity = 0,
  description = 'description'
}) => {
  return (
    <div className="stats shadow bg-base-200 w-full ">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{quantity}</div>
        <div className="stat-desc ">{description}</div>
      </div>
    </div>
  )
}

export default FarmNumbers
