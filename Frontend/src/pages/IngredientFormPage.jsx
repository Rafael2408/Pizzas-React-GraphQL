import { useEffect, useState } from 'react';
import { usePizzas } from '../context/PizzaContext';
import { useForm } from 'react-hook-form';

function IngredientFormPage({ onClose, ingredient }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { ingredients = [], createIngredient, updateIngredient } = usePizzas()

  useEffect(() => {
    if (ingredient) {
      setValue('ing_name', ingredient.ing_name);
      setValue('ing_calories', ingredient.ing_calories);
    }
  }, [ingredient]);

  const onSubmit = handleSubmit(async (data) => {
    data.ing_calories = parseFloat(data.ing_calories)
    if (ingredient) {
      data.ing_id = parseInt(ingredient.ing_id)
      data.ing_state = true;
      await updateIngredient(data)
    }
    else {
      await createIngredient(data)
    }
    await onClose()
  });

  return (
    <div className="d-flex flex-column align-items-center mt-5"
      style={{ height: "100vh" }}>
      <div className='col-6' id='ingredientForm'>
        <h1 className='text-center'>Formulario de Ingredientes</h1>
        <form onSubmit={onSubmit}>
          {ingredient && (
            <h4 className='mt-3 mb-4'>ID del ingrediente: <b>{ingredient.ing_id}</b></h4>
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
              onClick={onClose}
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
