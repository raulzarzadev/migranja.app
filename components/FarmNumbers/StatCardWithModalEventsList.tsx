import useSortByField from '@comps/hooks/useSortByField'
import Modal from '@comps/modal'
import ModalAnimalDetails from '@comps/modal/ModalAnimalDetails'
import HeaderTable from '@comps/MyTables/HeaderTable'
import { useState } from 'react'
import { FarmStateAnimalEvent } from 'store/slices/farmSlice'
import { myFormatDate } from 'utils/dates/myDateUtils'
import { StatCard } from '.'

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
  const { handleSortBy, arraySorted, field, reverse } = useSortByField(events)
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
            <div className="grid grid-cols-5 justify-items-center">
              <div>
                <HeaderTable
                  fieldName={'eventData.date'}
                  label={'Fecha'}
                  fieldSelected={field}
                  handleSortBy={handleSortBy}
                  reverse={reverse}
                />
              </div>
              <div>
                <HeaderTable
                  fieldName={'eventData.parents.mother.earring'}
                  label={'Madre'}
                  fieldSelected={field}
                  handleSortBy={handleSortBy}
                  reverse={reverse}
                />
              </div>
              <div className="">
                <HeaderTable
                  fieldName={'eventData.parents.father.earring'}
                  label={'Padre'}
                  fieldSelected={field}
                  handleSortBy={handleSortBy}
                  reverse={reverse}
                />
              </div>
              <div className="col-span-2  ">
                <HeaderTable
                  fieldName={'eventData.calfs.length'}
                  label={'Camada'}
                  fieldSelected={field}
                  handleSortBy={handleSortBy}
                  reverse={reverse}
                />
              </div>
            </div>
            {arraySorted.map((event) => (
              <div key={event.id}>
                {event.type === 'BIRTH' && (
                  <div className="grid grid-cols-5 text-center">
                    <div>{myFormatDate(event.eventData.date, 'dd MM yy')}</div>
                    <div>
                      <ModalAnimalDetails
                        size="md"
                        earring={event.eventData.parents.mother?.earring}
                      />
                    </div>
                    <div>
                      <ModalAnimalDetails
                        size="md"
                        earring={event.eventData.parents.father?.earring}
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex w-full justify-start">
                        <span>({event.eventData.calfs?.length})</span>
                        {event.eventData.calfs?.map((animal: any) => (
                          <div key={animal?.earring}>
                            <ModalAnimalDetails
                              size="md"
                              earring={animal?.earring}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  )
}
export default StatCardWithModalEventsList
