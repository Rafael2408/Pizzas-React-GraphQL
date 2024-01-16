import axios from "./axios";

export const getIngredientsRequest = () => axios.post("/",{
    query: `
        query Ingredients {
            ingredients {
                ing_id
                ing_name
                ing_calories
                ing_state
            }
        }
    `
})

export const getIngredientRequest = (id) => axios.post("/",{
    query: `
        query Ingredients {
            ingredients(id: ${id}) {
                ing_id
                ing_name
                ing_calories
                ing_state
            }
        }
    `
})

export const createIngredientRequest = async (data) => {
    const { ing_name, ing_calories } = data;
    const query = `
    mutation CreateIngredient($ingredient: inputIngredient) {
        createIngredient(ingredient: $ingredient) {
            ing_id
            ing_name
            ing_state
            ing_calories
        }
    }
    `;
    const variables = {
        ingredient: {
            ing_calories,
            ing_name
        }
    };

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

export const updateIngredientRequest = async (data) => {
    const { ing_id, ing_name, ing_calories, ing_state } = data;
    const query = `
    mutation UpdateIngredient($ingredient: updateIngredient) {
        updateIngredient(ingredient: $ingredient) {
            ing_id
            ing_name
            ing_state
            ing_calories
            }
    }`
    const variables = {
        ingredient: {
            ing_id,
            ing_name,
            ing_calories,
            ing_state
        }
    };
    console.log(variables)

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

export const deleteIngredientRequest = (ing_id) => { 
    const query = `
    mutation Mutation($ingId: Int) {
        deleteIngredient(ing_id: $ingId) {
            ing_id
            message
        }
    }`
    const variables = {
        ingId: ing_id
    };

    try {
        const response = axios.post('/', {
            query,
            variables
        });
        return response;
    } catch (error) {
        console.error(error);
    }
}