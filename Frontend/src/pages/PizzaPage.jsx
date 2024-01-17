import { useContext, useEffect, useState } from "react"
import { PizzaContext } from "../context/PizzaContext"
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom"

import '../styles/PizzaPage.css'

function PizzaPage() {
  const navigate = useNavigate()
  const { pizzas, setPizzas, getPizzas, updatePizza, deletePizza } = useContext(PizzaContext)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(5); 
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('')
  const [selectedPizzas, setSelectedPizzas] = useState([])

  useEffect(() => {
    const fetchPizzas = async () => {
      setIsLoading(true);
      await getPizzas();
      setIsLoading(false);
      setSelectedPizzas(pizzas);
    };

    fetchPizzas();
  }, [])


  useEffect(() => {
    getPizzas()
  }, [])

  useEffect(() => {
    setSelectedPizzas(
      pizzas.filter(pizza =>
        pizza.piz_name.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, pizzas])


  const updateState = async (pizza) => {
    const updatedPizza = {
      ...pizza,
      piz_state: !pizza.piz_state,
      ingredients: pizza.ingredients.map(({ ing_id, pi_portion }) => ({ ing_id, pi_portion }))
    };
    await updatePizza(updatedPizza);
    getPizzas();
  }

  const handleDeletePizza = async (piz_id) => {
    await deletePizza(parseInt(piz_id))
    getPizzas()
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedPizzas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="m-4">
        <h1 className="text-center">Administración de Pizzas</h1>
        <div>
          <div className="btn-search">
            <button className="btn btn-crear"
              onClick={() => {
                setPizzas([])
                navigate('/pizza-add')
              }}
            >
              <i className="fas fa-pencil-alt"></i> Registrar
            </button>
            <input className="form-control search-bar" type="search" placeholder="Buscar pizza..." 
              value={searchValue}
              onChange={ e => setSearchValue(e.target.value)}
            />
          </div>

          {isLoading ? (
            <p>Cargando pizzas...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">Nombre</th>
                    <th className="text-center">Origen</th>
                    <th className="text-center">Estado</th>
                    <th className="text-center">Calorías Totales</th>
                    <th className="text-center" colSpan={2}> Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems && currentItems.map((pizza) => (
                    <tr key={pizza.piz_id}>
                      <td className="text-center">{pizza.piz_id}</td>
                      <td className="text-center">{pizza.piz_name}</td>
                      <td className="text-center">{pizza.piz_origin}</td>
                      <td className="text-center">
                        <div className="form-check form-switch d-flex justify-content-center">
                          <input className="form-check-input" type="checkbox" checked={pizza.piz_state} onChange={() => { updateState(pizza) }} />
                        </div>
                      </td>
                      <td className="text-center">{pizza.total_calories}</td>
                      <td className="text-center">
                        <button className="btn btn-editar"
                          onClick={() => navigate(`/pizza-add/${pizza.piz_id}`)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-eliminar"
                          onClick={() => {
                            handleDeletePizza(pizza.piz_id)
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )
          }

          <div className="btn-search">
            <div>
              <h5>
                {selectedPizzas.length > 0 ?
                  `Mostrando ${indexOfFirstItem + 1} - ${indexOfLastItem > selectedPizzas.length ? selectedPizzas.length : indexOfLastItem} de ${selectedPizzas.length} resultados`
                  :
                  'No se encontraron resultados'
                }
              </h5>
            </div>
            <div>
              <button className="btn btn-paginate" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                <i className="fas fa-arrow-left"></i> Anterior
              </button>
              <button className="btn btn-paginate" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(selectedPizzas.length / itemsPerPage)}>
                Siguiente <i className="fas fa-arrow-right"></i>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default PizzaPage
