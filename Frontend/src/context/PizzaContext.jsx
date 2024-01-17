import { createContext, useContext, useState } from 'react';
import { getPizzaRequest, getPizzasRequest, createPizzaRequest, updatePizzaRequest, deletePizzaRequest } from '../../api/pizzas';
import { getIngredientsRequest, getIngredientRequest, createIngredientRequest, updateIngredientRequest, deleteIngredientRequest } from '../../api/ingredients';

export const PizzaContext = createContext();

export const usePizzas = () => {
    const context = useContext(PizzaContext)

    if(!context) {
        throw new Error('usePizzas debe estar dentro del proceedor PizzaProvider')
    }
    return context
}

export const PizzaProvider = ({ children }) => {
    const [pizzas, setPizzas] = useState([])
    const [ingredients, setIngredients] = useState([])

    const getPizzas = async () =>{
        try {
            const res = await getPizzasRequest()
            setPizzas(res.data.data.pizzas)
        } catch (error) {
            console.log(error)
        }
    }

    const getPizzaById = async (id) =>{
        try {
            const res = await getPizzaRequest(id)
            setPizzas(res.data.data.pizzas)
        } catch (error) {
            console.log(error)
        }
    }

    const createPizza = async (data) => {
        try {
            const res = await createPizzaRequest(data)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const updatePizza = async (data) => {
        try {
            console.log(data)
            const res = await updatePizzaRequest(data)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const deletePizza = async (piz_id) => {
        try {
            const res = await deletePizzaRequest(piz_id)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }


    const getIngredients = async () =>{
        try {
            const res = await getIngredientsRequest()
            setIngredients(res.data.data.ingredients)
        } catch (error) {
            console.log(error)
        }
    }

    const getIngredientById = async (id) => {
        try {
            const res = await getIngredientRequest(id)
            setIngredients(res.data.data.ingredients)
        } catch (error) {
            console.log(error)
        }
    }

    const createIngredient = async (data) => {
        try {
            const res = await createIngredientRequest(data)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const updateIngredient = async (data) => {
        try {
            const res = await updateIngredientRequest(data)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteIngredient = async (ing_id) =>{
        try {
            const res = await deleteIngredientRequest(ing_id)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <PizzaContext.Provider 
            value={{ 
                pizzas,
                setPizzas, 
                getPizzas,
                getPizzaById,
                createPizza,
                updatePizza,
                deletePizza,

                ingredients,
                getIngredients,
                getIngredientById,
                createIngredient,
                updateIngredient,
                deleteIngredient
            }}>
            {children}
        </PizzaContext.Provider>
    );
};
