import { Component, EventEmitter, Output } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "../recipes/recipe.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'

})
export class HeaderComponent{

    constructor(private dataService: DataStorageService,
        private recipeService : RecipeService, private router: Router, private route: ActivatedRoute){}

    onSaveData(){
        this.dataService.storeRecipes();
    }

    onFetchRecipes(){
        this.dataService.fetchRecipes();
    }

    onNewRecipe(){
        this.recipeService.reset();
        this.router.navigate(['/new'], {relativeTo: this.route});
    }
}