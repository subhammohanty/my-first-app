import { Subject } from "rxjs/Subject";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService{
    startEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        // new Ingredient('Apple', 5),
        // new Ingredient('Tomatoes', 10)
      ];
    
    getIngredients(){
        return this.ingredients;
    }

    addIngredients(ingredient: Ingredient){
        this.ingredients.push(ingredient); 
    }

    addIngredient(ingredients: Ingredient[]){
        this.ingredients.push(...ingredients);
    }

    getIngredient(index: number){
        return this.ingredients[index];
    }

    updatedIngredient(index: number, newIngredient: Ingredient){
        this.ingredients[index] = newIngredient;
    }

    deleteIngredient(index: number){
        this.ingredients.splice(index, 1);
    }
}