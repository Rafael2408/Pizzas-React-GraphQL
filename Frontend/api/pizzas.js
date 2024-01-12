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

export const createPizzaRequest = (data) => {
    console.log(data)
    const { piz_name, piz_origin, ingredients } = data;
    // const ingredients = ingredients.map(ing => `{ ing_id: ${ing.ing_id}, pi_portion: ${ing.pi_portion} }`).join(',');
    const query = `
    mutation {
        createPizza(pizza: {piz_name: "${piz_name}", piz_origin: "${piz_origin}", ingredientsPizza: [${ingredients}]}) {
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
    // Aquí deberías ejecutar tu consulta con axios
}


