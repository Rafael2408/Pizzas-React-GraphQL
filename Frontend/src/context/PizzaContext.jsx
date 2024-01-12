import { createContext, useContext, useState } from 'react';
import { getPizzaRequest, getPizzasRequest, createPizzaRequest } from '../../api/pizzas';
import { getIngredientsRequest, getIngredientRequest } from '../../api/ingredients';

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
            console.log(res)
            setPizzas(res.data)
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
            setIngredients(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    

    return (
        <PizzaContext.Provider 
            value={{ 
                pizzas, 
                getPizzas,
                getPizzaById,
                createPizza,
                ingredients,
                getIngredients,
                getIngredientById,
            }}>
            {children}
        </PizzaContext.Provider>
    );
};
