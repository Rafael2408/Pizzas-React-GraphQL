import { useContext, useEffect, useState } from "react"
import { PizzaContext } from "../context/PizzaContext"
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom"

import '../styles/PizzaPage.css'

function PizzaPage() {
  const navigate = useNavigate()
  const { pizzas, getPizzas } = useContext(PizzaContext)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(5); // Cambia esto al número de elementos que quieres por página

  useEffect(() => {
    getPizzas()
  }, [])

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pizzas.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className="m-4">
        <h1 className="text-center">Administración de Pizzas</h1>
        <div>
          <div className="btn-search">
            <button className="btn btn-crear"
              onClick={() => navigate('/pizza-add')}
            >
              <i className="fas fa-pencil-alt"></i> Registrar 
            </button>
            <input className="form-control search-bar" type="search" placeholder="Buscar pizza..." />
          </div>

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
                      <input type="checkbox" checked={pizza.piz_state} onChange={() => { }} />
                    </td>
                    <td className="text-center">{pizza.total_calories}</td>
                    <td className="text-center">
                      <button className="btn btn-editar"
                        onClick={() => navigate(`/pizza-add/${pizza.piz_id}`)}
                      >
                        <i className="fas fa-edit"></i> 
                      </button>
                      <button className="btn btn-eliminar">
                        <i className="fas fa-trash"></i> 
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <div className="btn-search">
            <div>
              <h5>Mostrando {indexOfFirstItem + 1} - {indexOfLastItem > pizzas.length ? pizzas.length : indexOfLastItem} de {pizzas.length} resultados</h5>
            </div>
            <div>
              <button className="btn btn-paginate" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                <i className="fas fa-arrow-left"></i> Anterior
              </button>
              <button className="btn btn-paginate" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(pizzas.length / itemsPerPage)}>
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
