import { useContext, useEffect, useState } from "react"
import { PizzaContext } from "../context/PizzaContext"
import { useNavigate } from "react-router-dom"

function IngredientPage() {
    const navigate = useNavigate()
    const { ingredients, getIngredients, updateIngredient, deleteIngredient } = useContext(PizzaContext)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage,] = useState(5);

    const [searchValue, setSearchValue] = useState("");
    const [filteredIngredients, setFilteredIngredients] = useState([]);


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

    return (
        <>
            <div className="m-4">
                <h1 className="text-center">Administración de Ingredientes</h1>
                <div>
                    <div className="btn-search">
                        <button className="btn btn-crear"
                            onClick={() => navigate('/ingredient-add')}
                        >
                            <i className="fas fa-pencil-alt"></i> Registrar
                        </button>
                        <input
                            className="form-control search-bar"
                            type="search"
                            placeholder="Buscar ingrediente..."
                            value={searchValue}
                            onChange={e => {setSearchValue(e.target.value)
                            
                            console.log(e.target.value)}}
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
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
                    <div className="btn-search">
                        <div>
                            <h5>
                                {filteredIngredients.length > 0 ?
                                    `Mostrando ${indexOfFirstItem + 1} - ${indexOfLastItem > filteredIngredients.length ? filteredIngredients.length : indexOfLastItem} de ${filteredIngredients.length} resultados`
                                    :
                                    'No se encontraron resultados'
                                }
                            </h5>

                        </div>
                        <div>
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
