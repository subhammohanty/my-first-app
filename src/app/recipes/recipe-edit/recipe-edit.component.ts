import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Recipe } from '../recipe.model';
import { DataStorageService } from '../../shared/data-storage.service';
import { Ingredient } from '../../shared/ingredient.model';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent implements OnInit{
  all: true;
rec: Recipe;
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  constructor(private route: ActivatedRoute, private recipeService: RecipeService,
    private router: Router, private dataService: DataStorageService, private http: HttpClient,
    private location: Location){}

  ingredients: Ingredient[] = [
  ];

  ffff: Ingredient;

  getIngredient(name: string){
    this.http.get<Ingredient[]>(`http://localhost:9090/ingredientList/${name}`)
    .subscribe(respose => {
      this.ingredients = respose;
    });
  }

  getAllIngredients(){
    this.http.get<Ingredient[]>('http://localhost:9090/ingredientList')
    .subscribe(respose => {
      this.ingredients = respose;
    });
  }

  ngOnInit() {
    console.log("Value of ingredient", this.ingredients);
    this.rec = this.recipeService.getRec();
    this.editMode = this.rec != null;
    if(this.rec != null){
      this.id = this.rec.id;
    }
    if(this.editMode){
      this.getIngredient(this.rec.name);
    }else{
      console.log("In ELse");
      this.getAllIngredients();
    }
    this.initForm();
    // this.route.params
    // .subscribe(
    //   (params: Params) => {
    //     this.id = +params['id'];
    //     this.editMode = params['id'] != null;
    //     this.initForm();
    //   }
    // );
  }

  onAddIngredient(event: any){
    console.log("Demo",event.value);
    this.ffff = event.value[event.value.length-1];
    console.log(this.ffff.name);

    (<FormArray>this.recipeForm.get('ingredient')).push(
      new FormGroup({
        'name': new FormControl(this.ffff.name, Validators.required),
        'amount': new FormControl(this.ffff.amount, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  private initForm(){
    console.log("Init")
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredient = new FormArray([]);

    if(this.editMode){
      console.log("Edit Mode", this.rec.id);
      const recipe: Recipe = this.recipeService.getRecipe(this.rec.id);
      // const recipe = this.dataService.getRecipeById(this.rec.id);
      console.log(recipe);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if(recipe['ingredient']){
        for(let ingr of recipe.ingredient){
          recipeIngredient.push(
            new FormGroup({
              'name': new FormControl(ingr.name, Validators.required),
              'amount': new FormControl(ingr.amount, [
                Validators.required, 
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
        })
          );
        }
      }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredient': recipeIngredient
    });
    console.log(this.recipeForm.value);
  }
  onSubmit(){
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredient'],
    // );
    if(this.editMode){
      this.dataService.updateRecipe(this.id, this.recipeForm.value);
    }else{
      // this.recipeService.addRecipe(this.recipeForm.value);
      console.log("Saved");
      this.dataService.storeRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.route});
    // this.router.navigateByUrl("/recipes", { skipLocationChange: true}).then(() -> {
    //   this.router.navigate([decodeURI(this.location.path())]);
    // });
  }
  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredient')).removeAt(index);
  }

  onAddToShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.rec.ingredient);
    this.recipeService.toSetRecipeIdFOrShoppingList(this.rec.id, this.rec);
    this.router.navigate(['/shopping-list'], {relativeTo: this.route});
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe(){
    // this.recipeService.deleteRecipe(this.id);
    this.dataService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
