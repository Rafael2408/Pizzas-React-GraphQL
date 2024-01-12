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