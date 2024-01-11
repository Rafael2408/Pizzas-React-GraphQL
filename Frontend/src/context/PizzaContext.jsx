import { createContext, useContext, useState } from 'react';
import { getPizzaRequest, getPizzasRequest } from '../../api/pizzas';

export const PizzaContext = createContext();

export const usePizzas = () => {
    const context = useContext(PizzaContext)

    if(!context) {
        throw new Error('usePizzas debe estar dentro del proceedor PizzaProvider')
    }
    return context
}

export const PizzaProvider = ({ children }) => {
    const [pizzas, setPizzas] = useState([]); 

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

    return (
        <PizzaContext.Provider 
            value={{ 
                pizzas, 
                getPizzas,
                getPizzaById
            }}>
            {children}
        </PizzaContext.Provider>
    );
};
