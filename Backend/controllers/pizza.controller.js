const { db } = require('../config/connection')

const pizzaResolver = {
    Query: {
        pizzas(root, { id }) {
            if (id === undefined) 
                return db.any('SELECT * FROM pizzas ORDER BY piz_id');
            else
                return db.any('SELECT * FROM pizzas WHERE piz_id = $1', [id]);
        },
        ingredients(root, {id}){
            if ( id == undefined) 
                return db.any('SELECT * FROM ingredients ORDER BY ing_id')
            else 
                return db.any('SELECT * FROM ingredients WHERE ing_id = $1', [id])
            
        }
    },
    Mutation:{
        async createPizza(root, {pizza}){
            try {
                if (pizza == undefined) {
                    return null
                } else {
                    const newPizza = await db.one(`
                        INSERT INTO pizzas (piz_name, piz_origin, piz_state)
                        VALUES ($1, $2, true) returning *;
                    `, [pizza.piz_name, pizza.piz_origin])
                    if(pizza.ingredientsPizza.length > 0){
                        pizza.ingredientsPizza.forEach(async (element) => {
                                await db.none(`
                                INSERT INTO pizzas_ingredients (piz_id, ing_id, pi_portion)
                                VALUES ($1, $2, $3);
                            `, [newPizza.piz_id, element.ing_id, element.pi_portion])
                        });
                    }
                    return newPizza
                }
            } catch (error) {
                console.log({error: error.message})
            }
        },
        async updatePizza(root, { pizza }) {
            try {
                if (pizza == undefined) {
                    return null;
                } else {
                    const updatedPizza = await db.one(`
                        UPDATE pizzas 
                        SET piz_name = $1, piz_origin = $2, piz_state = $3
                        WHERE piz_id = $4
                        RETURNING *;
                    `, [pizza.piz_name, pizza.piz_origin, pizza.piz_state, pizza.piz_id]);

                    await db.none(`
                        DELETE FROM pizzas_ingredients WHERE piz_id = $1;
                    `, [updatedPizza.piz_id]);

                    if (pizza.ingredientsPizza.length > 0) {
                        for (const element of pizza.ingredientsPizza) {
                            await db.none(`
                                INSERT INTO pizzas_ingredients (piz_id, ing_id, pi_portion)
                                VALUES ($1, $2, $3);
                            `, [updatedPizza.piz_id, element.ing_id, element.pi_portion]);
                        }
                    }
                    return updatedPizza;
                }
            } catch (error) {
                console.log({ error: error.message });
            }
        },
        async deletePizza(root, { piz_id }) { 
            try {
                if (piz_id == undefined) {
                    return null
                } else {
                    await db.none(`
                        DELETE FROM pizzas_ingredients WHERE piz_id = $1 returning *;
                        DELETE FROM pizzas WHERE piz_id = $1 returning *;
                    `, [piz_id]) 
                    return {
                        piz_id: piz_id,
                        message: `Pizza with id ${piz_id} was deleted successfully`
                    }
                }
            } catch (error) {
                console.log({ error: error.message })
            }
        },
        async createIngredient(root, { ingredient }){
            try {
                if (ingredient == undefined) {
                    return null
                } else {
                    const newIngredient = await db.one(`
                        INSERT INTO ingredients(ing_name, ing_calories, ing_state)
                        VALUES ($1, $2, $3) returning *;
                    `, [ingredient.ing_name, ingredient.ing_calories, ingredient.ing_state])
                    return newIngredient
                }
            } catch (error) {
                console.log({error: error.message})
            }
        },
        async updateIngredient(root, { ingredient }){
            try{
                if(ingredient == null){
                    return null
                } else {
                    const newIngredient = await db.one(`
                        UPDATE public.ingredients
                        SET ing_name=$2, ing_calories=$3, ing_state=$4
                        WHERE ing_id=$1 returning *;
                    `, [ingredient.ing_id, ingredient.ing_name, ingredient.ing_calories, ingredient.ing_state])
                    return newIngredient
                }
            }
            catch(error){
                console.log({error: error.message})
            }
        },
        async deleteIngredient(root, { ing_id }){
            try {
                if (ing_id == undefined) {
                    return null
                } else {
                    await db.none(`
                        DELETE FROM pizzas_ingredients WHERE ing_id = $1;
                        DELETE FROM ingredients WHERE ing_id = $1;
                    `, [ing_id]) 
                    return {
                        ing_id: ing_id,
                        message: `Ingredient with id ${ing_id} was deleted successfully`
                    }
                }
            } catch (error) {
                console.log({ error: error.message })
            }
        }
    },
    pizzas: {
        ingredients(pizza) { 
            return db.any(`
                SELECT i.*, pi.pi_portion
                FROM pizzas p, ingredients i, pizzas_ingredients pi
                WHERE p.piz_id = pi.piz_id 
                AND i.ing_id = pi.ing_id
                AND p.piz_id = $1
            `, [pizza.piz_id])
        },
        async total_calories(pizza) {
            const res = await db.one(`
                SELECT SUM(i.ing_calories * pi.pi_portion) AS total_calories
                FROM pizzas p, ingredients i, pizzas_ingredients pi
                WHERE p.piz_id = pi.piz_id 
                AND i.ing_id = pi.ing_id
                AND p.piz_id = $1
            `, [pizza.piz_id])

            if (res.total_calories == null) res.total_calories = 0;

            return res.total_calories
        }
    },
    ingredients: {
        pizzas(ingredient) {
            return db.any(`
                SELECT p.*, pi.pi_portion
                FROM ingredients i
                JOIN pizzas_ingredients pi
                    ON i.ing_id = pi.piz_id
                JOIN pizzas p
                    ON pi.piz_id = p.piz_id
                WHERE pi.ing_id = $1
            `, [ingredient.ing_id])
        }
    }
}

module.exports = pizzaResolver