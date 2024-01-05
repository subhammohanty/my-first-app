import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
  selector: 'app-recipe-start',
  templateUrl: './recipe-start.component.html',
  styleUrl: './recipe-start.component.css'
})
export class RecipeStartComponent implements OnInit{

  constructor(private dataStorageService: DataStorageService){}

  ngOnInit(): void {
    this.dataStorageService.fetchRecipes();
  }

}
