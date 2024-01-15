import axios from "./axios";

export const getPizzasRequest = () => axios.post("/", {
    query: `
    query Pizzas {
        pizzas {
            piz_id
            piz_name
            piz_origin
            piz_state
            total_calories
            ingredients {
                ing_id
                ing_calories
                ing_name
                ing_state
                pi_portion
           }
       }
   }
`,
});

export const getPizzaRequest = (id) => axios.post("/", {
    query: `
    query Pizzas {
        pizzas(id: ${id} ) {
            piz_id
            piz_name
            piz_origin
            piz_state
            total_calories
            ingredients {
                ing_id
                ing_calories
                ing_name
                ing_state
                pi_portion
           }
       }
   }
`,
});

export const createPizzaRequest = async (data) => {
    const { piz_name, piz_origin, ingredients } = data;
    const query = `
    mutation CreatePizza($pizza: inputPizza) {
        createPizza(pizza: $pizza) {
            piz_id
            piz_name
            piz_origin
            piz_state
            ingredients {
                ing_id
                ing_name
                ing_calories
            }
        }
    }
    `;
    const variables = {
        pizza: {
            piz_name,
            piz_origin,
            ingredientsPizza: ingredients
        }
    };
    // Aquí ejecutas tu consulta con axios
    try {
        const response = await axios.post('/', {
            query,
            variables
        });
        return response;
    } catch (error) {
        console.error(error);
    }
}

export const updatePizzaRequest = async (data) => {
    const { piz_id, piz_name, piz_origin, piz_state, ingredients } = data;
    console.log(data)
    const query = `
        mutation UpdatePizza($pizza: updatePizza) {
            updatePizza(pizza: $pizza) {
                piz_id
                piz_name
                piz_origin
                piz_state
                ingredients {
                    ing_id
                    ing_name
                    ing_calories
                }
            }
        }
    `;

    const variables = {
        pizza: {
            piz_id,
            piz_name,
            piz_origin,
            piz_state,
            ingredientsPizza: ingredients
        }
    };
    // Aquí ejecutas tu consulta con axios
    try {
        const response = await axios.post('/', {
            query,
            variables
        });
        return response
    } catch (error) {
        console.log(error)
    }
}



