import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Item {
  id: number
  name: string
  price: number
  image: string
  top: string
  left: string
  type: 'product' | 'coin'
}

interface PaymentSolution {
  optimal_solution: string[]
  is_optimal: boolean
}

interface Fase1Props {
  goal: number
  timeLimit: number
  onComplete: (total: number, elapsed: number, selectedItems: Item[], paymentSolution: PaymentSolution) => void
  onNextPhase: () => void
}

const Fase1: React.FC<Fase1Props> = ({ goal, timeLimit, onComplete, onNextPhase }) => {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [total, setTotal] = useState<number>(0)
  const [movementInterval, setMovementInterval] = useState<number>(1000)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeElapsed, setTimeElapsed] = useState<number>(0)
  const [isTiming, setIsTiming] = useState<boolean>(true)
  const [paymentSolution, setPaymentSolution] = useState<PaymentSolution | null>(null)
  const [isPaymentDone, setIsPaymentDone] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const productsResponse = await axios.get<Item[]>('http://127.0.0.1:5000/products')
        const coinsResponse = await axios.get<Item[]>('http://127.0.0.1:5000/coins')

        const products = productsResponse.data.map(product => ({
          ...product,
          top: `${Math.random() * 90}%`,
          left: `${Math.random() * 90}%`,
          type: 'product'
        }))

        const coins = coinsResponse.data.map(coin => ({
          ...coin,
          top: `${Math.random() * 90}%`,
          left: `${Math.random() * 90}%`,
          type: 'coin'
        }))

        setItems([...products, ...coins])
        setLoading(false)
      } catch (error) {
        console.error('There was an error fetching the items!', error)
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  useEffect(() => {
    setStartTime(Date.now())

    const interval = setInterval(() => {
      setItems(prevItems => prevItems.map(item => ({
        ...item,
        top: `${Math.random() * 90}%`,
        left: `${Math.random() * 90}%`
      })))
    }, movementInterval)

    return () => clearInterval(interval)
  }, [movementInterval])

  useEffect(() => {
    if (startTime && isTiming) {
      const timer = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
        setTimeElapsed(Number(elapsed))
        if (Number(elapsed) >= timeLimit) {
          setIsTiming(false)
          alert('Tempo esgotado 333!')
          handleComplete(total, Number(elapsed), selectedItems)
        }
      }, 100)

      return () => clearInterval(timer)
    }
  }, [startTime, timeElapsed, isTiming, timeLimit, total, selectedItems])

  const handleClick = (item: Item) => {
    if (total >= goal) {
      alert('Meta atingida!')
      return
    }

    const newTotal = total + item.price

    if (newTotal <= goal) {
      setSelectedItems([...selectedItems, item])
      setTotal(newTotal)

      if (newTotal === goal) {
        setIsTiming(false)
        handleComplete(newTotal, timeElapsed, [...selectedItems, item])
      }
    } else {
      setIsTiming(false)
      alert('Você não pode adicionar mais itens, o valor meta será excedido!')
      handleComplete(total, timeElapsed, selectedItems)
    }
  }

  const handleComplete = (total: number, elapsed: number, selectedItems: Item[]) => {
    axios.post<PaymentSolution>('http://127.0.0.1:5000/troco', { amount: total })
      .then(response => {
        setPaymentSolution(response.data)
        setIsPaymentDone(true)
        onComplete(total, elapsed, selectedItems, response.data)
      })
      .catch(error => {
        console.error('There was an error completing the payment!', error)
      })
  }

  return (
    <div className="flex">
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <>
          <div className="w-80 p-5 border-r border-gray-300">
            <h1 className="text-xl font-bold">Fase {goal}</h1>
            <p className="text-lg mb-4">Tempo decorrido: {timeElapsed.toFixed(2)} segundos</p>
            <div className="mb-4">
              <label htmlFor="interval" className="block mb-2">Movement Interval (ms):</label>
              <input
                id="interval"
                type="number"
                value={movementInterval}
                onChange={(e) => setMovementInterval(Number(e.target.value))}
                min="100"
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <h2 className="text-lg font-semibold mb-2">Selected Items</h2>
            <ul className="list-none p-0">
              {selectedItems.map((item, index) => (
                <li key={index} className="flex items-center mb-2">
                  <img
                    src={`http://127.0.0.1:5000/static/${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 mr-4"
                  />
                  <p>{item.name} - R${item.price.toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <p className="text-lg mt-4">Total: R${total.toFixed(2)}</p>
            <p className="text-lg mt-2">Goal: R${goal.toFixed(2)}</p>
            {paymentSolution && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Solução de Pagamento</h2>
                <p>Moedas: {paymentSolution.optimal_solution.join(', ')}</p>
                <p>É Ótima? {paymentSolution.is_optimal ? 'Sim' : 'Não'}</p>
              </div>
            )}
            <button
              disabled={!isPaymentDone}
              onClick={onNextPhase}
              className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              Próxima Fase
            </button>
          </div>
          <div className="flex-1 relative bg-gray-100 h-[600px] overflow-hidden">
            {items.map(item => (
              <img
                key={item.id}
                src={`http://127.0.0.1:5000/static/${item.image}`}
                alt={item.name}
                className="absolute w-24 h-24 object-cover cursor-pointer"
                style={{
                  top: item.top,
                  left: item.left,
                  transition: 'top 1s, left 1s'
                }}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Fase1
