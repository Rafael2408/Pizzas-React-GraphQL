import { useContext, useEffect } from "react"
import { PizzaContext } from "../context/PizzaContext"

function PizzaPage() {
  const { pizzas, getPizzas } = useContext(PizzaContext)

  useEffect(() => {
    getPizzas()
  }, [])
  console.log(pizzas)

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Origen</th>
            <th>Estado</th>
            <th>Calorías Totales</th>
          </tr>
        </thead>
        <tbody>
          {pizzas && pizzas.map((pizza) => (
            <tr key={pizza.piz_id}>
              <td>{pizza.piz_id}</td>
              <td>{pizza.piz_name}</td>
              <td>{pizza.piz_origin}</td>
              <td>{pizza.piz_state.toString()}</td>
              <td>{pizza.total_calories}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PizzaPage
