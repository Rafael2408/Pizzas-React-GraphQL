import axios from "./axios";

export const getPizzasRequest = () => axios.post("/", {
    query: `
    Pizzas{
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
    Pizzas{
        pizzas(id: ${ id } ) {
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
`,});
