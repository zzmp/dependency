(function(angular) {

  // Initialize an external ng instance for familiar testing
  var ng                = angular.bootstrap(),
      $http             = ng.get('$http'),
      $timeout          = ng.get('$timeout'),
      $document         = ng.get('$document'),
      $exceptionhandler = ng.get('$exceptionHandler'),
      module            = angular.module,
      modules           = {},
      dependencies      = [];

  dependencies.unresolved = {};
  dependencies.count = 0;

  dependencies.defer = function(dependency, path) {
    if (arguments.length === 1) {
      // Mark module for later loading
      this.unresolved[dependency] = true;

      // Load module
    } else if (!~dependencies.indexOf(dependency)) {
      $http.get(path)
        .success(function(module) {
          var script = angular.element('<script>').html(module);
          $document.find('head').append(script);

          $timeout(dependencies.resolve.bind(dependencies), 0);
        })
      ;

      this.push(dependency);
      this.count += 1;

      // Mark module as loaded
      delete this.unresolved[dependency];

      // Defer bootstraping until all dependencies are loaded
      if (!window.name.match(/^NG_DEFER_BOOTSTRAP!/))
        window.name = 'NG_DEFER_BOOTSTRAP!' + window.name;
    }
  };

  dependencies.resolve = function() {
    if (!--this.count) {
      for (var module in this.unresolved)
        $exceptionHandler(
          Error(module +' has no path'), 'All dependencies must include paths');
      // Only resume bootstrapping if all modules have loaded
      if (!module)
        angular.resumeBootstrap(dependencies);
    }
  };

  // Expose to angular to allow modularization
  angular.dependency = dependencies.defer.bind(dependencies);

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
