import { useEffect, useState } from 'react';
import { usePizzas } from '../context/PizzaContext';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

function IngredientFormPage() {
  const navigate = useNavigate()
  const params = useParams()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { ingredients = [], createIngredient, updateIngredient, getIngredientById } = usePizzas() // Asegúrate de tener estas funciones en tu contexto

  useEffect(() => {
    if (params.id) {
      getIngredientById(params.id)
    }
  }, [])

  useEffect(() => {
    if (ingredients && ingredients.length > 0 && params.id) {
      const ingredient = ingredients.find(ingredient => ingredient.ing_id === parseInt(params.id));

      if (ingredient) {
        setValue('ing_name', ingredient.ing_name);
        if (ingredient && ingredient.ing_calories) {
          setValue('ing_calories', ingredient.ing_calories);
        }
      }
    }
  }, [ingredients]);

  const onSubmit = handleSubmit(async (data) => {
    data.ing_calories = parseFloat(data.ing_calories)
    if (params.id) {
      data.ing_id = parseInt(params.id)
      data.ing_state = true;
      await updateIngredient(data)
    }
    else {
      await createIngredient(data)
    }
    navigate('/ingredient')
  });

  return (
    <div className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}>
      <div className='col-6' id='ingredientForm'>
        <h1>Formulario de Ingredientes</h1>
        <form onSubmit={onSubmit}>
          {params.id && ingredients && ingredients.length > 0 && (
            <h4 className='mt-3 mb-4'>ID del ingrediente: <b>{ingredients[0].ing_id}</b></h4>
          )}

          <div className='mb-3'>
            <label>Nombre del ingrediente:</label>
            <input type="text" placeholder='Nombre del ingrediente...' className='form-control'
              {...register('ing_name', { 
                required: 'El nombre es requerido',
                minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' }
              })}
            />
            {errors.ing_name && (
              <span className='text-danger'>{errors.ing_name.message}</span>
            )}
          </div>
          <div className='mb-3'>
            <label>Calorías del ingrediente:</label>
            <input type="text" placeholder='Calorías del ingrediente...' className='form-control'
              {...register('ing_calories', {
                required: 'Las calorías son requeridas',
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/, 
                  message: 'Por favor ingresa un número válido'
                }
              })}
            />
            {errors.ing_calories && (
              <span className='text-danger'>{errors.ing_calories.message}</span>
            )}

          </div>

          <div className='separar-elementos'>
            <button type="submit" className="btn btn-guardar">
              <i className="fas fa-save"></i> Guardar
            </button>
            <button type="button" className="btn btn-danger"
              onClick={() => navigate('/ingredient')}
            >
              <i className="fas fa-undo"></i> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default IngredientFormPage
