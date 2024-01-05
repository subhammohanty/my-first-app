import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Store } from "@ngrx/store";
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";
import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class RecipeService{
    recipeSelected = new EventEmitter<Recipe>();
    private  recipes: Recipe[] = [];
    private recBack: Recipe= null;
    recipeIdForSL: number;
    recipForSL: Recipe;
      setRecipes(recipesFromBackEnd: Recipe[]){
        this.recipes = [];
        for(let rec of recipesFromBackEnd){
            if(this.check(rec)){
                this.recipes.push(rec);
            }
        }
        console.log("XXXX" , this.recipes);
      }

      check(rec: Recipe){
        if(this.recipes.length === 0 || !this.recipes[rec.id]){
            return true;
        }else{
            return false;
        }
      }

    getRecipes(){
        return this.recipes;
    }

    getRecipe(id: number){
        for(let rec of this.recipes){
            if(rec.id == id){
                return rec;
            }
        }
        return this.recipes[id];
    }

    constructor(private slServie: ShoppingListService,
        private store: Store<fromShoppingList.AppState>, private http: HttpClient
        ){}

    addIngredientsToShoppingList(ingredient: Ingredient[]){
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredient));
        // this.slServie.addIngredient(ingredient);
    }

    updateAndFetch(recipes: Recipe[]){
        this.recipes = null;
        for(let rec of recipes){
            this.recipes.push(rec);
        }
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
    }
    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
    }

    deleteRecipe(index: number){
        this.recipes.splice(index, 1);
    }

    rec(recipe: Recipe){
        this.recBack = null;
        this.recBack = recipe;
        console.log("Service to set " , this.recBack.id)
    }
    getRec(){
        console.log("Service to get " , this.recBack)
        return this.recBack;
    }
    reset(){
        this.recBack = null;
    }

    toSetRecipeIdFOrShoppingList(id: number, recipe: Recipe){
        this.recipeIdForSL = id;
        this.recipForSL = recipe;
    }

}