import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { DataStorageService } from '../shared/data-storage.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit{
  selectedRecipe: Recipe;

  constructor(private recipeService: RecipeService, private dataStorageService: DataStorageService,
    private http: HttpClient, private router: Router){}

  ngOnInit(){
    // this.http.get<Recipe[]>('http://localhost:8080/recipe')
    // .subscribe(recipes => {
    //    this.selectedRecipe = recipes;
    // });
    this.recipeService.recipeSelected.subscribe(
      (recipe : Recipe) =>{
        this.selectedRecipe = recipe;
      }
    );
  }
}
