(function(angular) {

  // Initialize an external ng instance for familiar testing
  var ng            = angular.bootstrap(),
      $http         = ng.get('$http'),
      $timeout      = ng.get('$timeout'),
      $document     = ng.get('$document'),
      module        = angular.module,
      modules       = {},
      dependencies  = [];

  dependencies.defer = function(dependency, path) {
    if (!~dependencies.indexOf(dependency)) {
      // Load module
      $http.get(path)
        .success(function(module) {
          var script = angular.element('<script>').html(module);
          $document.find('head').append(script);

          $timeout(dependencies.resolve.bind(dependencies), 0);
        })
      ;

      this.push(dependency);
      this.count = (this.count || 0) + 1;

      // Defer bootstraping until all dependencies are loaded
      if (!window.name.match(/^NG_DEFER_BOOTSTRAP!/))
        window.name = 'NG_DEFER_BOOTSTRAP!' + window.name;
    }
  };

  dependencies.resolve = function() {
    if (!--this.count)
      angular.resumeBootstrap(dependencies);
  };


  // Decorate the moduleInstance to give access to dependency loading
  angular.module = function(name) {
    // Check and update already loaded modules
    if (!modules[name] && (modules[name] = true))
      if (arguments.length === 1)
        // Conform to ng syntax
        arguments = [name, []];

    var moduleInstance = module.apply(angular, arguments);

    moduleInstance.dependency = function(dependency, path) {
      moduleInstance.requires.push(dependency);

      dependencies.defer(dependency, path);

      // .dependency is chainable
      return moduleInstance;
    };

    return moduleInstance;
  };

}(angular) );
