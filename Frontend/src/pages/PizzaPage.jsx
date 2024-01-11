import { useContext, useEffect } from "react"
import { PizzaContext } from "../context/PizzaContext"


function PizzaPage() {
  const { pizzas, getPizzas } = useContext(PizzaContext)

  useEffect(() => {
    getPizzas()
  }, [pizzas])
  console.log(pizzas)
  return (
    <div>PizzaPage</div>
  )
}

export default PizzaPage