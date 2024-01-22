import '../styles/PizzaPage.css'
import { useContext, useEffect, useState } from "react"
import { PizzaContext } from "../context/PizzaContext"
import { useNavigate } from "react-router-dom"
import PizzaFormModal from '../components/PizzaFormModal';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';

function PizzaPage() {
  const { pizzas, getPizzas, updatePizza, deletePizza } = useContext(PizzaContext)
  const [pizzaToUpdate, setPizzaToUpdate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,] = useState(5); 
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('')
  const [selectedPizzas, setSelectedPizzas] = useState([])
  const [exportOption, setExportOption] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(pizzas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "pizzas.xlsx");
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Nombre", "Origen", "Estado", "Calorías Totales"];
    const tableRows = [];

    pizzas.forEach(pizza => {
      const pizzaData = [
        pizza.piz_id,
        pizza.piz_name,
        pizza.piz_origin,
        pizza.piz_state,
        pizza.total_calories,
      ];
      tableRows.push(pizzaData);
    });

    doc.autoTable({
      columns: tableColumn.map(header => ({ header })),
      body: tableRows
    });
    doc.save('pizzas.pdf');
  };

  const exportToJson = () => {
    const dataStr = JSON.stringify(pizzas, null, 4);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    let exportFileDefaultName = 'pizzas.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  const handleExport = () => {
    switch (exportOption) {
      case 'excel':
        exportToExcel();
        break;
      case 'pdf':
        exportToPdf();
        break;
      case 'json':
        exportToJson();
        break;
      default:
        alert('Selecciona una opción para exportar')
        break;
    }
  };

  function openModal() {
    setModalIsOpen(true);
  }

  const closeModal = async() => {
    setModalIsOpen(false);
    setIsLoading(false)
    await getPizzas()
  }


  return (
    <>
      <div className="m-4">
        <h1 className="text-center">Administración de Pizzas</h1>
        <div>
          <div className="btn-search">
            <div className="admin-options">
              <button className="btn btn-crear btn-primary"
                onClick={() => {
                  setPizzaToUpdate(null)
                  openModal()
                }}
              >
                <i className="fas fa-pencil-alt mx-2"></i> 
                <span className="button-text">Registrar</span>
              </button>
              <PizzaFormModal isOpen = {modalIsOpen} onClose = {closeModal} pizza = {pizzaToUpdate}/>

              <select className="form-select" onChange={(e) => setExportOption(e.target.value)}>
                <option value="">Opciones de Exportación</option>
                <option value="excel">Exportar a Excel</option>
                <option value="pdf">Exportar a PDF</option>
                <option value="json">Exportar a JSON</option>
              </select>
              <button className="btn btn-info mx-2" onClick={handleExport}>
                <i className="fas fa-download mx-2"></i> 
                <span className="button-text">Exportar</span>
              </button>
            </div>
            <input className="form-control search-bar" type="search" placeholder="Buscar pizza..." 
              value={searchValue}
              onChange={ e => setSearchValue(e.target.value)}
            />
          </div>

          {isLoading ? (
            <p>Cargando pizzas...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped" id="my-table">
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
                          onClick={() => {
                            setPizzaToUpdate(pizza);
                            openModal();
                          }}
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

          <div className="cards d-flex flex-wrap">
            {currentItems && currentItems.map((pizza) => (
              <div key={pizza.piz_id} className="card text-bg-light mb-3">
                <div className="card-header">{pizza.piz_id}</div>
                <div className="card-body">
                  <h5 className="card-title">{pizza.piz_name}</h5>
                  <p className="card-text">Origen: {pizza.piz_origin}</p>
                  <p className="card-text">Total de Calorías: {pizza.total_calories}</p>
                  <div className="d-flex">
                    <span style={{ marginRight: '0.5rem' }}>Estado:</span>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={pizza.piz_state}
                        onChange={() => updateState(pizza)}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <button className="btn btn-editar"
                      onClick={() => {
                        setPizzaToUpdate(pizza);
                        openModal();
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>

                    <button className="btn btn-eliminar"
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de que quieres eliminar esta pizza?')) {
                          handleDeletePizza(pizza.piz_id);
                        }
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>


          <div className="btn-search">
            <div>
              <h5 className="text-center">
                {selectedPizzas.length > 0 ?
                  `Mostrando ${indexOfFirstItem + 1} - ${indexOfLastItem > selectedPizzas.length ? selectedPizzas.length : indexOfLastItem} de ${selectedPizzas.length} resultados`
                  :
                  'No se encontraron resultados'
                }
              </h5>
            </div>
            <div className="text-center">
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
