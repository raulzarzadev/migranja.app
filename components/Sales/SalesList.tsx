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
      <table className="table table-compact">
        <thead>
          <tr>
            <th className="">Fecha</th>
            <th className="">Precio($)</th>
            <th className="">Cant(u)</th>
            <th className="">PesoT(k)</th>
            <th className="">Total$</th>
            <th className="">Ops</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale?.id} className="">
              <td className="">
                <div className="">
                  {myFormatDate(sale.eventData.date, 'dd/MM/yy')}
                </div>
              </td>
              <td>
                <CurrencySpan quantity={sale.eventData?.price || 0} />
              </td>
              <td>{sale.eventData?.animalsQuantity || 0}</td>
              <td>{sale.eventData?.totalWeight || 0}</td>
              <td className="truncate">
                <CurrencySpan quantity={sale.eventData?.total || 0} />
              </td>
              <td>
                <ModalSaleDetails sale={sale} label={'ver'} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SalesList
