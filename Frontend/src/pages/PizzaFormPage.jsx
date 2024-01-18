import { useEffect, useState } from 'react';
import { usePizzas } from '../context/PizzaContext';
import { useForm } from 'react-hook-form';

function PizzaFormPage({ onClose, pizza }) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()
    const { ingredients, getIngredients,  createPizza, updatePizza } = usePizzas()
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
            if (pizza) {
                const newIngredients = ingredients.map((ingredient, index) => {
                    const ingredientInPizza = pizza.ingredients.find(i => i.ing_id === ingredient.ing_id);
                    if (ingredientInPizza) {
                        handleCheckboxChange(index, true);
                        return {
                            ing_id: ingredient.ing_id,
                            pi_portion: ingredientInPizza.pi_portion
                        };
                    } else {
                        handleCheckboxChange(index, false);
                        return {
                            ing_id: '',
                            pi_portion: ''
                        };
                    }
                });

                setValue('ingredients', newIngredients);
            }
        }
    }


    useEffect(() => {
        getIngredients()
    }, [])

    const updateSelectedIngredients = () => {
        if (pizza) {
            const newSelectedIngredients = {};
            const newIngredients = ingredients.map((ingredient, index) => {
                const ingredientInPizza = pizza.ingredients.find(i => i.ing_id === ingredient.ing_id);
                if (ingredientInPizza) {
                    newSelectedIngredients[index] = true;
                    return {
                        ing_id: ingredient.ing_id,
                        pi_portion: ingredientInPizza.pi_portion
                    };
                } else {
                    newSelectedIngredients[index] = false;
                    return {
                        ing_id: '',
                        pi_portion: ''
                    };
                }
            });

            setSelectedIngredients(newSelectedIngredients);
            setValue('ingredients', newIngredients);
            setValue('piz_name', pizza.piz_name);
            setValue('piz_origin', pizza.piz_origin);
        } else {
            setSelectedIngredients({});
            setValue('ingredients', []);
            setValue('piz_name', '');
            setValue('piz_origin', '');
        }
    }

    useEffect(() => {
        updateSelectedIngredients();
    }, [pizza]);

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

        if (pizza) {
            data.piz_id = pizza.piz_id
            data.piz_state = pizza.piz_state
            await updatePizza(data)
        }
        else {
            await createPizza(data)
        }
        await onClose();
    });


    return (
        <>
            <div className="d-flex flex-column align-items-center mt-5"
                style={{ height: "100vh" }}>
                <div className='col-6' id='pizzaForm'>
                    <h1>Formulario de Pizzas</h1>
                    <form onSubmit={onSubmit}>
                        {pizza && (
                            <h4>ID de la pizza: {pizza.piz_id}</h4>
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
                        {pizza && (
                            <div className='mb-3 piz_state' >
                                <label>Estado de la pizza:</label>
                                {pizza.piz_state ? (
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
                                onClick={onClose}
                            > <i className="fas fa-undo"></i> Cancelar </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default PizzaFormPage
