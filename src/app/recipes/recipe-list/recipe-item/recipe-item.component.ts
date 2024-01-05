import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStorageService } from '../../../shared/data-storage.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrl: './recipe-item.component.css'
})
export class RecipeItemComponent implements OnInit{
  @Input() recipes: Recipe[];
  @Input() index: number;

  first = 0;
  rows = 10;
  totalRecords = 0;
  constructor(private route: ActivatedRoute, private router: Router, 
    private dataService: DataStorageService,
    private recipeService: RecipeService){}

  // ngOnChanges(changes: SimpleChanges): void {

  // }

  ngOnInit() {
    this.dataService.fetchRecipes();
    this.recipes = this.recipeService.getRecipes();
    console.log("ffff", this.recipes)
    this.totalRecords = this.recipes.length;
  }

  next() {
    this.first = this.first + this.rows;
}

prev() {
    this.first = this.first - this.rows;
}

reset() {
    this.first = 0;
}

isLastPage(): boolean {
    return this.recipes ? this.first === (this.recipes.length - this.rows): true;
}


isFirstPage(): boolean {
    return this.recipes ? this.first === 0 : true;
}

OnEdit(recipe: any){
    console.log("Value " , recipe);
    this.router.navigate(['/edit'], {relativeTo: this.route});
    // recipe.id = this.dataService.getRecipeByName(recipe.name);
    this.recipeService.rec(recipe);
}
}
