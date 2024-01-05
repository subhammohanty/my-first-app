import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent implements OnInit{

  constructor(
    private slService: ShoppingListService,
    private store : Store<fromShoppingList.AppState>
    ){}

  ingredients: Observable<{ ingredients: Ingredient[] }>;g

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
  }
  onEditedItem(index: number){
    // this.slService.startEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }


}

