import { useContext, useEffect, useState } from "react"
import { PizzaContext } from "../context/PizzaContext"
import { useNavigate } from "react-router-dom"

import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';

function IngredientPage() {
    const navigate = useNavigate()
    const { ingredients, getIngredients, updateIngredient, deleteIngredient } = useContext(PizzaContext)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage,] = useState(5);

    const [searchValue, setSearchValue] = useState("");
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [exportOption, setExportOption] = useState('')

    const handleStateChange = async (ingredient) => {
        const updatedIngredient = {
            ...ingredient,
            ing_state: !ingredient.ing_state,
        };

        await updateIngredient(updatedIngredient);
        await getIngredients(); 
    }

    const handleDeleteIngredient = async (ing_id) => {
        console.log(ing_id)
        await deleteIngredient(parseInt(ing_id))
        await getIngredients()
    }

    useEffect(() => {
        getIngredients()
    }, [])

    useEffect(() => {
        setFilteredIngredients(
            ingredients.filter(ingredient =>
                ingredient.ing_name.toLowerCase().includes(searchValue.toLowerCase())
            )
        );
    }, [searchValue, ingredients]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredIngredients.slice(indexOfFirstItem, indexOfLastItem);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(ingredients);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "ingredients.xlsx");
    };

    const exportToPdf = () => {
        const doc = new jsPDF();
        const tableColumn = ["ID", "Nombre", "Calorias", "Estado"];
        const tableRows = [];

        ingredients.forEach(ingredient => {
            const ingredientData = [
                ingredient.ing_id,
                ingredient.ing_name,
                ingredient.ing_calories,
                ingredient.ing_state
            ];
            tableRows.push(ingredientData);
        });

        console.log(tableRows)

        doc.autoTable({
            columns: tableColumn.map(header => ({ header })),
            body: tableRows
        });
        doc.save('ingredients.pdf');
    };

    const exportToJson = () => {
        const dataStr = JSON.stringify(ingredients, null, 4);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = 'ingredients.json';

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

    return (
        <>
            <div className="m-4">
                <h1 className="text-center">Administración de Ingredientes</h1>
                <div>
                    <div className="btn-search">
                        <div className="admin-options">
                            <button className="btn btn-crear btn-primary"
                                onClick={() => {
                                    navigate('/ingredient-add')
                                }}
                            >
                                <i className="fas fa-pencil-alt mx-2"></i> 
                                <span className="button-text">Registrar</span>
                            </button>

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
                        <input className="form-control search-bar" type="search" placeholder="Buscar ingrediente..."
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped" id="my-table">
                            <thead>
                                <tr>
                                    <th className="text-center">ID</th>
                                    <th className="text-center">Nombre</th>
                                    <th className="text-center">Calorías</th>
                                    <th className="text-center">Estado</th>
                                    <th className="text-center" colSpan={2}> Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems && currentItems.map((ingredient) => (
                                    <tr key={ingredient.ing_id}>
                                        <td className="text-center">{ingredient.ing_id}</td>
                                        <td className="text-center">{ingredient.ing_name}</td>
                                        <td className="text-center">{ingredient.ing_calories}</td>
                                        <td className="text-center">
                                            <div className="form-check form-switch d-flex justify-content-center">
                                                <input className="form-check-input" type="checkbox" checked={ingredient.ing_state} onChange={() => handleStateChange(ingredient)} />
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-editar"
                                                onClick={() => navigate(`/ingredient-add/${ingredient.ing_id}`)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="btn btn-eliminar"
                                                onClick={() => handleDeleteIngredient(ingredient.ing_id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="cards d-flex flex-wrap">
                        {currentItems && currentItems.map((ingredient) => (
                            <div key={ingredient.ing_id} className="card text-bg-light mb-3">
                                <div className="card-header">{ingredient.ing_id}</div>
                                <div className="card-body">
                                    <h5 className="card-title">{ingredient.ing_name}</h5>
                                    <p className="card-text">Calorías: {ingredient.ing_calories}</p>
                                    <div className="d-flex">
                                        <span style={{ marginRight: '0.5rem' }}>Estado:</span>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" checked={ingredient.ing_state}
                                                onChange={() => handleStateChange(ingredient)}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center mt-2">
                                        <button className="btn btn-editar"
                                            onClick={() => navigate(`/ingredient-add/${ingredient.ing_id}`)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn-eliminar"
                                            onClick={() => handleDeleteIngredient(ingredient.ing_id)}
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
                                {filteredIngredients.length > 0 ?
                                    `Mostrando ${indexOfFirstItem + 1} - ${indexOfLastItem > filteredIngredients.length ? filteredIngredients.length : indexOfLastItem} de ${filteredIngredients.length} resultados`
                                    :
                                    'No se encontraron resultados'
                                }
                            </h5>

                        </div>
                        <div className="text-center">
                            <button className="btn btn-paginate" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                <i className="fas fa-arrow-left"></i> Anterior
                            </button>
                            <button className="btn btn-paginate" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(filteredIngredients.length / itemsPerPage)}>
                                Siguiente <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default IngredientPage
