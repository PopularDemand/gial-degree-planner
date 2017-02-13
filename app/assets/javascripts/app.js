var planner = angular.module('planner', ['ui.router', 'restangular', 'Devise']);

planner.config(function(AuthProvider) {
  AuthProvider.loginPath('/advisors/sign_in.json');
  AuthProvider.resourceName('advisor');
});

planner.config( ['RestangularProvider', function(RestangularProvider) {
  RestangularProvider.setBaseUrl('/api/v1');
  RestangularProvider.setRequestSuffix('.json');
  RestangularProvider.setDefaultHttpFields({
      "content-type": "application/json"
  });
}]);

planner.run(['$rootScope', function($rootScope){
  $rootScope.$on("$stateChangeError", console.warn.bind(console));
}]);

planner.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/students');
  $stateProvider
    .state('dashboard', {
      url: '',
      views: {
        'header': {
          templateUrl: '/templates/dashboard-header.html',
          controller: 'DashboardHeaderCtrl',
        },
        'main': {
          templateUrl: '/templates/dashboard-main.html',
        }
      }
    })
    .state('dashboard.students', {
      url: '/students',
      resolve: {
        advisors: ['Restangular', function(Restangular) {
          return Restangular.all('advisors').getList();
        }],
        students: ['Restangular', function(Restangular) {
          return Restangular.all('students').getList();
        }]
      },
      views: {
        'main@': {
          templateUrl: '/templates/students.html',
          controller: 'StudentsIndexCtrl'
        }
      }
    })
    .state('dashboard.meetings', {
      url: '/classes',
      views: {
        "main@": {
          templateUrl: '/templates/meetings.html',
          controller: 'MeetingsIndexCtrl',
        }
      }
    })
    .state('ips', {
      url: '/IPS',
      views: {
        'header': {
          templateUrl: '/templates/ips-header.html'
        },
        'main': {
          templateUrl: 'templates/ips-main.html'
        }
      }
    })
    .state('ips.choose', {
      url: '/choose',
      views: {
        'main@': {
          templateUrl: '/templates/ips-choose.html'
        }
      }
    })
    .state('ips.schedule', {
      url: '/schedule',
      views: {
        'main@': {
          templateUrl: '/templates/ips-schedule.html'
        }
      }
    });
}]);
