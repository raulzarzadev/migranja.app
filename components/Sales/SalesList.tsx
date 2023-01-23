import CurrencySpan from '@comps/CurrencySpan'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FarmStateAnimalEvent, selectFarmEvents } from 'store/slices/farmSlice'
import { fromNow, myFormatDate } from 'utils/dates/myDateUtils'

const SalesList = () => {
  const [sales, setSales] = useState<FarmStateAnimalEvent[]>([])
  const farmEvents = useSelector(selectFarmEvents)
  useEffect(() => {
    setSales(farmEvents.filter((event) => event.type === 'SELL'))
  }, [farmEvents])
  // console.log({ sales })
  return (
    <div className="">
      Lista de ventas
      <div>
        <div className="grid grid-cols-5 ">
          <div className="truncate">Fecha</div>
          {/* <div>Tipo</div> */}
          <div className="truncate">Precio($)</div>
          <div className="truncate">Cant(u)</div>
          <div className="truncate">PesoT(k)</div>
          <div className="truncate">Total$</div>
        </div>
        {sales.map((sale) => (
          <div key={sale?.id} className="grid grid-cols-5 items-center mt-5">
            <div className="truncate">
              <div className="truncate">
                {' '}
                {myFormatDate(sale.eventData.date, 'dd/MM/yy')}
              </div>
              {/* creado:
              <span className="text-[10px] italic ">
                {fromNow(sale.updatedAt, { addSuffix: true })}
              </span> */}
            </div>
            {/* <div>{sale.eventData?.type}</div> */}
            <div>
              <CurrencySpan quantity={sale.eventData?.price || 0} />
            </div>
            <div>{sale.eventData?.animalsQuantity || 0}</div>
            <div>{sale.eventData?.totalWeight || 0}</div>
            <div className="truncate">
              <CurrencySpan quantity={sale.eventData?.total || 0} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SalesList
