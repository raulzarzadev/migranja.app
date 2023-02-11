import CurrencySpan from '@comps/CurrencySpan'
import ModalSaleDetails from '@comps/modal/ModalSaleDetails'
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

  return (
    <div className="">
      Lista de ventas
      <div>
        <div className="grid grid-cols-6 ">
          <div className="truncate">Fecha</div>
          <div className="truncate">Precio($)</div>
          <div className="truncate">Cant(u)</div>
          <div className="truncate">PesoT(k)</div>
          <div className="truncate">Total$</div>
          <div className="truncate">Ops</div>
        </div>
        {sales.map((sale) => (
          <div key={sale?.id} className="grid grid-cols-6 items-center mt-5">
            <div className="truncate">
              <div className="truncate">
                {myFormatDate(sale.eventData.date, 'dd/MM/yy')}
              </div>
            </div>
            <div>
              <CurrencySpan quantity={sale.eventData?.price || 0} />
            </div>
            <div>{sale.eventData?.animalsQuantity || 0}</div>
            <div>{sale.eventData?.totalWeight || 0}</div>
            <div className="truncate">
              <CurrencySpan quantity={sale.eventData?.total || 0} />
            </div>
            <ModalSaleDetails sale={sale} label={'ver'} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SalesList
