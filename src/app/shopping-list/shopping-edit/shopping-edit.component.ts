import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';
import { RecipeService } from '../../recipes/recipe.service';
import { DataStorageService } from '../../shared/data-storage.service';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css'
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  // @ViewChild('nameInput') nameInputRef: ElementRef;
  // @ViewChild('amountInput') amountInputRef: ElementRef;
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>,
    private recipeService: RecipeService,
    private dataSTorageService: DataStorageService
    ){}
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.editedItemIndex = stateData.editedIngredientIndex;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }else{
        this.editMode = false;
      }
    }
    );
  }

  onAddItem(form: NgForm){
    // const ingName = this.nameInputRef.nativeElement.value;
    // const ingAmount = this.amountInputRef.nativeElement.value;
    const value = form.value;
    console.log("Shopping List" , value);
    // const newIngredient = new Ingredient(ingName, ingAmount);
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      // this.slService.updatedIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient
        ({
          index: this.editedItemIndex, 
          ingredient: newIngredient
        })
        );
        // const recipeForUpdate = this.dataSTorageService.getRecipeById(this.recipeService.recipeIdForSL);
        // console.log("Shopping List DB", recipeForUpdate)
        // for(let ing of recipeForUpdate.ingredient){
        //   if(ing.name === newIngredient.name){
        //     ing.name = newIngredient.name;
        //     ing.amount = newIngredient.amount;
        //   }
        // }
        // console.log("After Update", recipeForUpdate);
        // this.dataSTorageService.updateRecipe(recipeForUpdate.id, recipeForUpdate);

    }else{
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
      // this.slService.addIngredients(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear(){
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
  onDelete(){
    // this.slService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient(this.editedItemIndex));
    this.onClear();
  }
}
