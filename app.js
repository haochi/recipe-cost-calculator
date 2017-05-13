class Recipe {
    constructor(name = '', ingredients = [], unitsPerBatch=1) {
        this.name = name;
        this.ingredients = ingredients;
        this.unitsPerBatch = unitsPerBatch;
    }
}

class Ingredient {
    constructor(name = '', pricePerKilo = 1, quantityNeeded = 1) {
        this.name = name;
        this.pricePerKilo = pricePerKilo;
        this.quantityNeeded = quantityNeeded;
    }
}

class RecipesController {
    constructor() {
        this.recipes = [
            new Recipe("chicken")
        ];
    }

    addRecipe(recipe) {
        this.recipes.push(recipe);
    }
}

angular.module('app', ['ui.router'])
.component('recipes', {
    templateUrl: '/templates/recipes.html',
    controller: RecipesController,
    controllerAs: 'ctrl'
});