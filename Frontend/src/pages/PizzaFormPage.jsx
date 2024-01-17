import { useEffect, useState } from 'react';
import { usePizzas } from '../context/PizzaContext';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

function PizzaFormPage() {
    const navigate = useNavigate()
    const params = useParams()

    const { register, handleSubmit, setValue, formState: { errors } } = useForm()
    const { ingredients, getIngredients, pizzas = [], createPizza, updatePizza, getPizzaById } = usePizzas()
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

    const handleIngredientsClick = () => {

        setShowIngredients(!showIngredients);
        if (!showIngredients) {
            if(pizzas.length > 0) {
                ingredients.forEach((ingredient, index) => {
                    const ingredientInPizza = pizzas[0].ingredients.find(i => i.ing_id === ingredient.ing_id);
                    if (ingredientInPizza) {
                        handleCheckboxChange(index, true);
                        setValue(`ingredients[${index}].pi_portion`, ingredientInPizza.pi_portion);
                    } else {
                        handleCheckboxChange(index, false);
                        setValue(`ingredients[${index}].pi_portion`, '');
                    }
                });
            }
        }
    }

    useEffect(() => {
        getIngredients()
        if (params.id) {
            getPizzaById(params.id)
        }
    }, [])

    useEffect(() => {
        if (pizzas && pizzas.length > 0 && params.id !== undefined) {
            setValue('piz_name', pizzas[0].piz_name);
            setValue('piz_origin', pizzas[0].piz_origin);

            const pizzaIngredients = selectedIngredients || {};

            pizzas[0].ingredients.forEach((ingredient, index) => {
                if (pizzaIngredients[index]) {
                    setValue(`ingredients[${index}].ing_id`, ingredient.ing_id);
                    setValue(`ingredients[${index}].pi_portion`, ingredient.pi_portion);
                }
            });
        }
    }, [pizzas, selectedIngredients]);

    useEffect(() => {
        if (!params.id) {
            setValue('piz_name', '');
            setValue('piz_origin', '');
            setSelectedIngredients({});
        }
    }, [params.id])

    const onSubmit = handleSubmit(async (data) => {
        if (data.ingredients) {
            data.ingredients = data.ingredients.filter(ingredient => ingredient.ing_id);

            data.ingredients.forEach(ingredient => {
                ingredient.ing_id = parseInt(ingredient.ing_id);
                if (ingredient.pi_portion) {
                    ingredient.pi_portion = parseFloat(ingredient.pi_portion);
                }
            });
        }

        if (params.id) {
            data.piz_id = parseInt(params.id)
            data.piz_state = pizzas[0].piz_state
            await updatePizza(data)
        }
        else {
            await createPizza(data)
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
                        {params.id && pizzas && pizzas.length > 0 && (
                            <h4>ID de la pizza: {pizzas[0].piz_id}</h4>
                        )}

                        <div className='mb-3'>
                            <label>Nombre de la pizza:</label>
                            <input type="text" placeholder='Nombre de la pizza...' className='form-control'
                                {...register('piz_name', { 
                                    required: 'El nombre de la pizza es requerido',
                                    minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres'}
                                 })}  
                            />
                            {errors.piz_name && (
                                <span className='text-danger'>{errors.piz_name.message}</span>
                            )}
                        </div>

                        <div className='mb-3'>
                            <label>Origen de la pizza:</label>
                            <input type="text" placeholder='Origen de la pizza...' className='form-control'
                                {...register('piz_origin', { 
                                    required: 'El origen de la pizza es requerido', 
                                    minLength: { value: 3, message: 'El origen debe tener al menos 3 caracteres'}
                                })}
                            />
                            {errors.piz_origin && (
                                <span className='text-danger'>{errors.piz_origin.message}</span>
                            )}
                        </div>
                        {params.id && pizzas && pizzas.length > 0 && (
                            <div className='mb-3 piz_state' >
                                <label>Estado de la pizza:</label>
                                {pizzas[0].piz_state ? (
                                        <h5>Activa</h5>
                                ) : (
                                        <h5>Inactiva</h5>
                                )}
                            </div>
                        )}

                        <button type="button" className="btn btn-primary" id='btn-ingredients' onClick={handleIngredientsClick}>
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
                                                <div className='form-check- form-switch'>
                                                    <input type="checkbox"
                                                        className='form-check-input'
                                                        {...register(`ingredients[${index}].ing_id`)}
                                                        value={ingredient.ing_id}
                                                        defaultChecked={selectedIngredients[index]}
                                                        onChange={e => handleCheckboxChange(index, e.target.checked)}
                                                    />
                                                </div>
                                            </td>
                                            <td className='text-center'>{ingredient.ing_calories}</td>
                                            <td className='text-center'>
                                                <input type="text" placeholder='Porción..' className='form-control'
                                                    {...register(`ingredients[${index}].pi_portion`, {
                                                        required: selectedIngredients[index],
                                                        pattern: {
                                                            value: /^\d+(\.\d{1,2})?$/,
                                                            message: 'Por favor ingresa un número válido'
                                                        }
                                                    })}
                                                    disabled={!selectedIngredients[index]}
                                                />
                                                {errors.ingredients && errors.ingredients[index] && errors.ingredients[index].pi_portion && (
                                                    <span className='text-danger'>{errors.ingredients[index].pi_portion.message}</span>
                                                )}
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
                            > <i className="fas fa-undo"></i> Cancelar </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default PizzaFormPage
