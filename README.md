dependency
==========

> External dependency loader for quick ng prototyping

Declare your dependencies in one place, and speed up your prototyping!

```js
angular.module('main')
  // Declare dependencies and their source _in your javascript_
  .dependency('ui.router', '//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.10/angular-ui-router.min.js')
  .dependency('main.login', 'main/login.js')
  .controller(fn)
;

// Declare sub-modules without dependency annotation
angular.module('login')
  .dependency('ui.router')
;
```

---

___Go from this verbosity...___

  ```html
  <script src="lib/angular/angular.js"></script>
  <script src="lib/dependency/dependency.js"></script>
  <script src="lib/angular-scroll/angular-scroll.min.js"></script>

  <script src="app.js"></script>
  <script src="common/services/contacts.js"></script>
  <script src="common/directives/table.js"></script>
  <script src="lounge/lounge.js"></script>
  <script src="lounge/directive.js"></script>
  <script src="dining/dining.js"></script>
  <script src="dining/controller.js"></script>
  <script src="dining/directive.js"></script>
  <script src="smoking/smoking.js"></script>
  <script src="smoking/service.js"></script>
  <!-- ... -->
  ```

___...to this.___

  ```html
  <script src="lib/angular/angular.js"></script>
  <script src="lib/dependency/dependency.js"></script>

  <script src="app.js"></script>
  ```

_Instead of listing your dependencies twice, do it all in javascript._

---

#### Declare your dependencies directly in the module

```js
angular.module('main')
  .dependency('depName', '/depPath.js');
```

#### Declare multiple dependencies at once

```js
angular.module('main')
  .dependency({
    'depName': '/depPath.js',
    'depTwo' : '/depTwo.js',
    'cdnDep' : '//url'
  });
```

#### Declare your sources in one place

```js
angular.module('main')
  .dependency(['depName', 'depTwo', 'cdnDep']);

/* sources.js */
angular.dependency({
  'depName': '/depPath.js',
  'depTwo' : '/depTwo.js',
  'cdnDep' : '//url'
});
```

##### Automatically detect duplicate dependencies

```
angular.module('main')
  .dependency('depName')
  // Only loaded once, from first given path '/depPath'
  .dependency('depName', '/depPath')
  // Already loaded, new path is ignored
  .dependency('depName', '/fakePath');
```

---

_I work best with prototyping. I do not (yet) concatenate code, so don't use me for something that needs to minimize AJAX calls. I am great for CDN-distributed dependencies._
