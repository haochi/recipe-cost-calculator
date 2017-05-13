class Recipe {
  constructor(name = '', ingredients = [], units = 1) {
    this.name = name;
    this.ingredients = ingredients;
    this.units = units;
  }
}

class Ingredient {
  constructor(name = '', pricePerUnit = 1, quantityPerBatch = 1) {
    this.name = name;
    this.pricePerUnit = pricePerUnit;
    this.quantityPerBatch = quantityPerBatch;
  }
}

class RecipesController {
  constructor($firebaseAuth, $firebaseArray) {
    const ref = firebase.database().ref().child("recipes");
    this.recipes = $firebaseArray(ref);
  }
}

class RecipeEditController {
  constructor($firebaseArray, $state, $stateParams) {
    this.$state = $state;
    const id = $stateParams.id;

    const ref = firebase.database().ref().child("recipes");
    this.recipes = $firebaseArray(ref);

    this.create = !id; // TODO context independent
    this.recipe = new Recipe();

    if (!this.create) {
      this.recipes.$loaded().then(() => {
        this.recipe = this.recipes.$getRecord(id);
      });
    }
  }

  save() {
    if (this.create) {
      this.recipes.$add(this.recipe);
    } else {
      this.recipes.$save(this.recipe);
    }
    this.$state.go('home');
  }

  totalPrice(ingredients) {
    return this.stripInvalidIngredients(ingredients).reduce((total, ingredient) => {
      return total + (ingredient.pricePerUnit * ingredient.quantityPerBatch);
    }, 0);
  }

  pricePerUnit(ingredients) {
    return this.totalPrice(ingredients) / this.recipe.units;
  }

  stripInvalidIngredients(ingredients) {
    return ingredients.filter(ingredient => ingredient.pricePerUnit && ingredient.quantityPerBatch);
  }

  addIngredient() {
    this.recipe.ingredients.push(new Ingredient());
  }
}

class LoginController {
  constructor($state, $firebaseAuth) {
    this.$state = $state;
    this.$firebaseAuth = $firebaseAuth;
  }

  loginWithFacebook() {
    this.$firebaseAuth().$signInWithPopup("facebook").then(() => {
      this.$state.go('home');
    });
  }
}

angular.module('app', ['ui.router', 'firebase'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/');

    $stateProvider.state({
      name: 'home',
      url: '/',
      component: 'recipes'
    });

    $stateProvider.state({
      name: 'logout',
      url: '/logout',
      resolve: {
        logout($firebaseAuth) {
          return $firebaseAuth().$signOut();
        }
      }
    });

    $stateProvider.state({
      name: 'login',
      url: '/login',
      component: 'login'
    });

    $stateProvider.state({
      name: 'edit',
      url: '/edit/{id}',
      component: 'edit',
      resolve: {
        id($transition$) {
          return $transition$.params().id;
        }
      }
    });

    $stateProvider.state({
      name: 'create',
      url: '/create',
      component: 'edit',
      resolve: {
        id() {
          return -1;
        }
      }
    });
  })
  .component('recipes', {
    templateUrl: '/templates/recipes.html',
    controller: RecipesController,
    controllerAs: 'ctrl'
  })
  .component('edit', {
    templateUrl: '/templates/edit.html',
    controller: RecipeEditController,
    controllerAs: 'ctrl',
    bindings: {
      id: '<'
    }
  })
  .component('login', {
    templateUrl: '/templates/login.html',
    controller: LoginController,
    controllerAs: 'ctrl'
  })

  .run(function ($rootScope, $firebaseAuth, $state) {
    $rootScope.$on('$locationChangeStart', () => {
      if (!$firebaseAuth().$getAuth()) {
        $state.go('login');
      }
    });

    $rootScope.$on('$locationChangeSuccess', function () {
      $firebaseAuth().$onAuthStateChanged(function (user) {
        if (!user) {
          $state.go('login')
        }
      })
    });
  })