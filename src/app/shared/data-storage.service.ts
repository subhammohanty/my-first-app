import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";


@Injectable({providedIn: 'root'})
export class DataStorageService {

    recipesCopy: Recipe[] = [];
    recipeByName: Recipe;
    idIndex: number;

    constructor(private http: HttpClient, private recipeService: RecipeService){}

    storeRecipes(){
        const recipes = this.recipeService.getRecipes();
        for(let rec of recipes){
            this.http.post('http://localhost:8080/recipe', rec)
            .subscribe(response => {
                console.log(response);
            });
        }
    }

    storeRecipe(recipe: Recipe){
        const len = this.recipeService.getRecipes().length;
        console.log("In Save " , this.idIndex);
        this.getId();
        recipe.id = len+1;
        console.log("Subham " ,recipe.id);
        this.http.post('http://localhost:8080/recipe', recipe)
            .subscribe(response => {
                console.log(response);
            });
            this.recipeService.addRecipe(recipe);
    }


    getId(){
        this.http.get<Recipe[]>('http://localhost:8080/recipe')
        .subscribe(res => {
            console.log("AAA", res);
            this.idIndex = res[res.length-1].id;
            console.log(this.idIndex);
            // return this.idIndex;
        });
        return this.idIndex;
    }

    fetchRecipes(){
        // this.http
        // .get<Recipe[]>('http://localhost:8080/recipe')
        // .pipe(map(recipes => {
        //     return recipes.map(recipe => {
        //         return {...recipe, ingredients: recipe.ingredient ? recipe.ingredient : []};
        //     });
        // }))
        // // ,
        // // tap(recipes => {
        // //     this.recipeService.setRecipes(recipes);
        // // })
        // .subscribe(recipes => {
        //     console.log("BackEnd: "+recipes);
        //     this.recipeService.setRecipes(recipes);
        // });
    // this.http.get('http://localhost:8080/recipe').subscribe((recipes: Recipe[]) => {
    //     for(let recipe of recipes){
    //         // console.log(recipe);
    //         this.recipesCopy.push(recipe);
    //     }
    //     this.recipeService.setRecipes(this.recipesCopy);
    //     // console.log(this.recipesCopy);
    // })

    this.http.get<Recipe[]>('http://localhost:8080/recipe')
    .subscribe(recipes => {
        this.recipeService.setRecipes(recipes);
    });
    }

    updateRecipe(index: number, toBeUpdatedRecipe: Recipe){
        console.log("Index " , index);
        console.log("toBeUpdated " , toBeUpdatedRecipe);
        // const val = index+1;
        let url = `http://localhost:8080/recipe/${index}`;
        console.log("URL : " , url);
        this.http.put(url, toBeUpdatedRecipe)
        .subscribe(recipe => {
            console.log(recipe);
        });
        this.recipeService.updateRecipe(index, toBeUpdatedRecipe);
        this.http.get<Recipe[]>('http://localhost:8080/recipe')
    .subscribe(recipes => {
        console.log("Debugged, ", recipes)
        this.recipeService.updateAndFetch(recipes);
    });
    }

    deleteRecipe(index: number){
        const val = index+1;
        let url = `http://localhost:8080/recipe/${index}`;
        console.log("URL : " , url);
        this.http.delete(url)
        .subscribe(response => {
            console.log(response);
        });
        this.recipeService.deleteRecipe(index);
    }

    fetch(){
        return this.http.get<any>('http://localhost:8080/recipe')
            .toPromise()
            .then(res => <Recipe[]>res.data)
            .then(data => { return data; });
    }

    getRecipeById(id: number){
        let recipeById: Recipe;
        let url = `http://localhost:8080/recipe/${id}`;
        console.log(url);
        this.http.get(url)
        .subscribe(response => {
            console.log("From DBBB", response);
            // recipeById = response;
        });
        console.log("From DB", recipeById);
        return recipeById;
    }


    getRecipeByName(name: string){
        this.http.get<Recipe>(`http://localhost:8080/recipe/name/${name}`)
        .subscribe(respose => {
            this.recipeByName = respose;
        });
        return this.recipeByName;
    }
}