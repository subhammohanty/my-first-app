import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit{
  private subscription: Subscription = new Subscription();
    data: any;
    interval: any;
  // title = 'pagination';
  recipes: Recipe[];
  // page: number = 1;
  // count: number = 0;
  // tableSize: number = 10;
  // tableSizes: any = [5,10,15,20];

  constructor(private recipeService : RecipeService, private router: Router, private route: ActivatedRoute,
    private http: HttpClient){}

  ngOnInit() {
    // this.recipes = this.recipeService.getRecipes();
    // if(this.recipes.length === 0){
      this.http.get<Recipe[]>('http://localhost:8080/recipe')
    .subscribe(recipes => {
        this.recipes = recipes;
    });
//
this.refreshData();
this.interval = setInterval(() => { 
    this.refreshData(); 
}, 2000);

    // }
    console.log("Get " , this.recipes);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearInterval(this.interval);
}

refreshData(){
  this.subscription.add(
    this.http.get<Recipe[]>('http://localhost:8080/recipe')
    .subscribe(recipes => {
        this.recipes = recipes;
    }));
}

  onNewRecipe(){
    this.recipeService.reset();
    this.router.navigate(['/new'], {relativeTo: this.route});
  }
}
