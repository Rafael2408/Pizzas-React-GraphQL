import { useEffect, useState } from 'react';
import { usePizzas } from '../context/PizzaContext';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

function PizzaFormPage() {
    const navigate = useNavigate()
    const params = useParams()

    const { register, handleSubmit, setValue } = useForm()
    const { ingredients, getIngredients, createPizza } = usePizzas()
    const [showIngredients, setShowIngredients] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState({});

    const handleCheckboxChange = (index, checked) => {
        setSelectedIngredients(prev => ({
            ...prev,
            [index]: checked
        }));

        if (checked) {
            setValue(`ingredients[${index}].pi_portion`, 1);
        }
        else setValue(`ingredients[${index}].pi_portion`, '');
    }

    useEffect(() => {
        getIngredients()
    }, [])

    console.log(ingredients)

    const onSubmit = handleSubmit((data) => {
        if(data.ingredients) {
        // Filtrar los ingredientes para que solo se incluyan si su ing_id es verdadero
            data.ingredients = data.ingredients.filter(ingredient => ingredient.ing_id);

            // Convertir los valores verdaderos en enteros
            data.ingredients.forEach(ingredient => {
                ingredient.ing_id = parseInt(ingredient.ing_id);
                if (ingredient.pi_portion) {
                    ingredient.pi_portion = parseInt(ingredient.pi_portion);
                }
            });
        }

        if(params.id){
            data.piz_id = id
            console.log(data)
        }
        else {
            createPizza(data)
        }
        navigate('/pizza')
    });


    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center"
                style={{ height: "100vh" }}>
                <div className='col-6' id='pizzaForm'>
                    <h1>Formulario de Pizzas</h1>
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label>Nombre de la pizza:</label>
                            <input type="text" placeholder='Nombre de la pizza...' className='form-control'
                                {...register('piz_name', { required: true })}
                            />
                        </div>
                        <div className='mb-3'>
                            <label>Origen de la pizza:</label>
                            <input type="text" placeholder='Origen de la pizza...' className='form-control'
                                {...register('piz_origin', { required: true })}
                            />
                        </div>
                        <button type="button" className="btn btn-primary" id='btn-ingredients' onClick={() => setShowIngredients(!showIngredients)}>
                            Ingredientes
                        </button>
                        {showIngredients && (
                            <table className='table table-striped'>
                                <thead>
                                    <tr>
                                        <th className='text-center'>Nombre</th>
                                        <th className='text-center'>Seleccionar</th>
                                        <th className='text-center'>Calorías</th>
                                        <th className='text-center'>Porción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredients.map((ingredient, index) => (
                                        <tr key={index}>
                                            <td className='text-center'>{ingredient.ing_name}</td>
                                            <td className='text-center'>
                                                <input type="checkbox"
                                                    {...register(`ingredients[${index}].ing_id`)}
                                                    value={ingredient.ing_id}
                                                    onChange={e => handleCheckboxChange(index, e.target.checked)}
                                                />
                                            </td>
                                            <td className='text-center'>{ingredient.ing_calories}</td>
                                            <td className='text-center'>
                                                <input type="number" className='form-control porcion'
                                                    min={1}
                                                    {...register(`ingredients[${index}].pi_portion`, { required: selectedIngredients[index] })}
                                                    disabled={!selectedIngredients[index]}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}






                        <div className='separar-elementos'>
                            <button type="submit" className="btn btn-guardar">
                                <i className="fas fa-save"></i> Guardar
                            </button>
                            <button type="button" className="btn btn-danger" 
                                onClick={() => navigate('/pizza')}
                            > Cancelar </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default PizzaFormPage
