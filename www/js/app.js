// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('blocnote', ['ionic','blocnote.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "partials/menu.html",
    })
    .state('app.mesnotes', {
      url: "/mesnotes",
      views: {
        'menuContent' :{
          templateUrl: "partials/mesnotes.html"
        }
      }
    })
    .state('app.add', {
      url: "/add",
      views: {
        'menuContent' :{
          templateUrl: "partials/add.html"
        }
      }
    })
    .state('app.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl: "partials/about.html"
        }
      }
    })
    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "partials/search.html"
        }
      }
    })
    .state('app.view', {
      url: "/view",
      views: {
        'menuContent' :{
          templateUrl: "partials/view.html"
        }
      }
    })
    ;

  // if none of the above states are matched, use this as the fallback
   $urlRouterProvider.otherwise('/app/mesnotes');
});

