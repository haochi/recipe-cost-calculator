class Recipe {
  constructor(name = '', ingredients = [], unitsPerBatch = 1) {
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

class RecipeEditController {
  constructor() {
    this.id = 'meow';
  }
}

angular.module('app', ['ui.router', 'firebase'])
  .config(function ($stateProvider) {
    $stateProvider.state({
      name: 'default',
      url: '',
      component: 'recipes'
    });
    $stateProvider.state({
      name: 'edit',
      url: '/edit/{id}',
      component: 'edit'
    });
  })
  .component('recipes', {
    templateUrl: '/templates/recipes.html',
    controller: RecipesController,
    controllerAs: 'ctrl'
  })
  .component('edit', {
    template: '<div>{{ ctrl.id }}</div>',
    controller: RecipeEditController,
    controllerAs: 'ctrl'
  });