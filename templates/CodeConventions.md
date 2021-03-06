
![](http://sysdocgroup.com/addons/default/themes/sysdoc/img/sysdoc/logo.png)

# Sysdoc Code Conventions 

## Document Terminology

The following terms, wherever mentioned in this document, should mean the following:

* Assets: images, icons, fonts, html templates.
* CSS bundle: transpiled (minified/non-minified) CSS file. This is a single CSS file that the projectâ€™s sass files are combined into. Generated by a sass build system such as compass, lib-sass, gulp-sass, etc. 
* JS bundle: compiled (minified/non-minified) JS file. This is a single JS file that contains all the code of the project, often generated by a build system such as webpack, jspm, duo, gulp, etc. 
* External dependencies: third-party libraries that the code uses but not included in the JS bundle.
* Client Source code: uncompiled JavaScript/Typescript code. 
* App/Server source code: C#, C++, Go, PHP, Java, Python code. 


## Globally Applicable Conventions

* File names must reflect the content of the file. 
* Functional unit  names i.e. functions and methods must reflect their behaviour i.e. what they do. 
* Hacks, and workarounds must be properly documented i.e. the code must include a comment explaining why the hack has been used, what it solves, and the proper way to solve the issue (in case there is). This is to ensure that nothing gets deleted by mistake when others get involved in the project. 
* Adhere to the single responsibility principle throughout development. Always ask yourself, what does this bit of code do?, if the answer is more than one thing, refactor the code into multiple functions/methods each of which is doing one thing. 
* CSS solutions over code (JS) solutions. If it can be done via CSS then do it via CSS. 

## JavaScript Code

* Code must be properly indented. 
* Code must be properly indented. 
* Yes code must be indented properly. Four spaces should be used to indent code blocks. Spaces ensures that the code look the same no matter what code editor is used. 
* TypeScript (ES6) is preferred over pure JavaScript as it eliminates most trivial bugs and provides static typings which speeds up the development process. 
* Object-oriented code is preferred over procedural code. However, methods of an object must adhere to the single responsibility principle. 
* Class names must be in capital case. 

```javascript
	class Example {
	
	}
```
* Semi-colons at the end of a statement must be followed by a new line. So instead of this: 

```javascript
	var age = 20;console.log(age); 
```

  use: 
  
  ```javascript
  var age = 20; 
  console.log(age); 
  ```
  
* Semi-colons within a for statement should be followed by a space. 

```javascript
	for(i =0; i<10; i++){
	
	}
	
```
* Commas must be followed by a space or a line break. 

```javascript
	var name = 'John Doe', 
		age = 28,
		createdAt = new Date(); 
```

* Variables must be defined at the very top of the function, method, constructor, closure. Instead of this: 

```javascript 
	function example1(){
		
		for (var i=0;i<10;i++){
			var name = 'Player '+(i+1); 
		}
	}
```

  Use: 
  
  ```javascript
  	function example1(){
  		var i = 0,
  			name = '';
  		for(;i<10;i++){
  			name = 'Player '+(i+1); 
  		}
  	}
  ```

* Avoid defining variables inside loops and if statements. See example above. 
* Long lines should be broken into multiple lines. 
* Classes must be contained in a file with the same name. 
* Variables, functions, methods and class data members must be in camelcase. This also conforms with what most libraries such as jQuery, AngularJS, ReactJS, etc use in their own code bases. 
* Variable, function, method, and class names must be reflective of what they contain and do. 

```javascript
//change this 
function validate(obj){

}

//to this
function validateUser(user){

}

```
* Comment stuff that matters not what is obvious. 
* Do not use JavaScript labels unless absolutely necessary. 
* The Do statement must end with a semi-colon. 
* Never use the â€œwithâ€ statement.
* Avoid using â€œcontinueâ€.
* Use {} instead of new Object(), and [] instead of new Array()
* Favor using === and !== over == and != operators. == and != do type coercion which means 12 == â€œ12â€ will return true although their types are different. 
* Never use the â€œevalâ€ function.
* Functions and methods must perform a single testable operation i.e. adhering to the single-responsibility principle. 
* Use pure functions and methods such that these functions and methods do not change the internal state of anything they receive as a parameter. This improves code predictability, readability, and extensibility. 
* Errors i.e. exceptions must be avoided rather than expected. I.e. avoid using try-catch unless necessary. Eliminate the cause of the problem, rather than handling the consequence. 
* Since JavaScript does not support access modifiers i.e. â€œprivateâ€, â€œprotectedâ€, and â€œpublicâ€, private data members and methods must be prefixed with â€œ_â€. For example:  this._el = document.getElementById(â€œTestItemâ€) indicates that _el must only be accessed and modified within its class. This gives people working on the code clarity on what they can safely access from somewhere else in their code without side effects and what they cannot.  

```javascript 
class Temp {
	_privateVar1;
	_privateVar2;
	publicProperty; 
	constructor(){
		this._privateVar1 = 20; 
		this._privateVar2 = 22; 
		this.publicProperty = 10; 
	}
}
```

* Avoid global scope pollution by wrapping code in closures or using JavaScript ES6 modules. 

```javascript
// never do this 
var example = 10; 

//always do this 
(function(){
	var example = 10; 
}())
```

* Keep utility functions in a single file (as long as theyâ€™re of the same nature). For example utility functions that deals with strings and string format, should be contained in a single file, same goes for network connections, etc. 
* Use the adapter pattern when working with third-party services and APIs. Never pollute source code with third-party service code. Always create a service class that abstracts the functionality provided by third-party APIs. The adapter pattern helps in managing development risks by ensuring that access to the external dependency can only happen through the adapter. This way, if anything changes with the external dependency, we only need to update the adapter rather than changing the whole code. 

```javascript 
var ThirdPartyService;

function createMyAdapterService(thirdPartyService){
	
	function doSomething(data){
		return thirdPartyService.doSomethingWith(data);
	}
	
	function doSomethingElse(data){
		return thirdPartyService.doSomethingElseWith(data); 
	}
	
	return {
		doSomething,
		doSomethingElse,
	};
}

//create an instance of the service 
var adapter = createMyAdapterService(ThirdPartyService); 

//then use the adapter 
adapter.doSomething({}) 

```
* In cases where things must be exposed to the global scope, use namespacing and make sure the namespaces do not collide with other libraries, to keep the amount of exposed code to a minimum.

```javascript 
//wrap everything in a closure to avoid unintentional pollution to the global scope. 
//the closure in this case should receive the exposed namespace object, the window and document. 
(function(myLib,W,D){
	//define internal variables and functions at the top 
	
	var myInternalVariable = ''; 
	
	function myInternalFunction(){
		//do something 
	}
	
	myLib.exposedFunction1 = function(){
	
	};
	
	myLib.exposedFunction2 = function(){
	
	
	};

}(window.myLib = myLib || {},window,document))

```
* As of the time of writing this, our preferred build system is webpack. The configuration is included in Sysdocâ€™s Quickstart repo. 
* Changes to the webpack configurations must be done by registering callbacks within the â€œbuild/callbacks.jsâ€ file. Callbacks are executed sequentially and the result of each callback is passed to the next. 


```javascript


```

## TypeScript Practice Guide 

There are two types of constructs in TypeScript, ones that compile to JavaScript, and others that are there for the sake of helping with static typing system and allows tools to intelligently work with that. 


### Compiling Constructs 

1. **Variable definitions**: declaring variables in TypeScript is very similar to JavaScript with one exception, is to follow the name of the variable with a colon `:` and the type that the variable will store. Very similar to ActionScript's syntax. By default TypeScript supports all JavaScript types, i.e. number, string, Date, Object, boolean, and Function. 

	```typescript
	
		var name:string = "John"; 
		var age:number = 10; 
		var date:Date = new Date(); 
		var isActive:boolean = false; 
		var f1:Function = function(){
		
		}; 
		
		//For wild card typings use 'any'
		var myObj:any = {}; 
		//myObj can now be assigned anything.  
		
	```
  Custom types can be defined using either class, interfaces, or even inline as follows:
  
	```typescript
	
	 	//an interface defining an object literal 
	 	//with two string properties firstName and lastName 
	  	interface UserObject {
	  		firstName:string;
	  		lastName:string; 
	  	}
	  	
	  	var user:UserObject = {
	  		firstName:"John",
	  		lastName:"Doe"
	  	}; 
	  	
	  	//alternatively, we can do this:
	  	
	  	var user:{firstName:string,lastName:string} = {
	  		firstName:"John",
	  		lastName:"Doe"
	  	};
	  	
	  	
	  	//we can also define functions as interfaces. 
	  	//MyCallback is an interface of a function 
	  	//that receives two parameters, 
	  	//the first is a string, and the second is a number, 
	  	//and it returns nothing. 
	  	
	  	interface MyCallback{
	  		(arg1:string,arg2:number):void; 
	  	}
	``` 
2. **Object-oriented programming**: TypeScript supports all OOP constructs, from class definitions, to inheritance and polymorphism. 
	##### Class Definition Example 
	
	```typescript
		//simple class definition 
		class Person {
			firstName:string;
			lastName:string; 
			age:number;
			constructor(firstName:string,lastName:string,age:number){
				this.firstName = firstName;
				this.lastName = lastName; 
				this.age = age; 
			}
			
			getFullName():string{
				return [this.firstName,this.lastName].join(' '); 
			}
		}
		
		//the following is equivalent 
		interface PersonDef {
			firstName:string;
			lastName:string;
			age:number;
		}
		
		class Person implements PersonDef {
			constructor(firstName:string,lastName:string,age:number){
				this.firstName = firstName;
				this.lastName = lastName; 
				this.age = age; 
			}
			
			getFullName():string{
				return [this.firstName,this.lastName].join(' '); 
			}
		}
		
	```
	
	##### Simple Inheritance Example 
	```typescript 
		//inheritance
		class Animal {
			name:string; 
			constructor(name:string){
				this.name = name; 
			}
			
			goEast(){
				console.log(`${this.name} is moving left`); 
			}
			
			goWest(){
				console.log(`${this.name} is moving right`); 
			}
		}
		
		class Bird extends Animal {
			canFly:boolean; 
			constructor(canFly:boolean){
				super('Bird'); 
				this.canFly = canFly; 
			}
			
			goEast(){
				if (!this.canFly){
					super.goEast(); 
					return;
				}
				console.log('This bird is flying east.'); 
			}
			
			goWest(){
				if (!this.canFly){
					super.goWest();
					return; 
				}
				console.log('This bird is flying west.'); 
			}
		}
		
		class Cat extends Animal {
			constructor(){
				super('Cat'); 
			}
			
			goEast(){
				console.log('This cat is go east.');
			}
			
			goWest(){
				console.log('This cat is go west.');
			}
		}
	```
	--
	#### Notes on Inheritance and JavaScript 
	* The use of inheritance often imposes a performance burden on browsers. This is due to the fact that JavaScript is a dynamic language, which means references to prototypes are resolved at `access-time` that is the JavaScript JIT compiler cannot optimise such access up until executing the code that accesses the prototype chain. Thus, it is often recommended that inheritance is kept to a minimum. **Factoid**: one of the main reasons that **AngularJS 1.0** slower than other frameworks in terms of performance, is due to the heavy reliance on prototypal inheritance and prototype chain mutations, specifically when creating **scopes**. 
	* Constructors in child classes should call their parent's constructor using the `super` keyword. 
3. **Achieving real data encapsulation in JavaScript**: due to the fact that JavaScript is a dynamic language, and that the only access modifier supported is the `public` meaning that real data encapsulation cannot be achieved using the `class` keyword. However, there are ways to achieve real data encapsulation with JavaScript, using the factory pattern, see the code snippet below:

	```javascript
	function createPerson(firstName,lastName, accountType){
		var _accountType = accountType; 
		function getFirstName(){
			
		}
		
		return {
			firstName:firstName,
			lastName:lastName,
			getFirstName:function(){
				return this.firstName; 
			},
			getLastName:function(){
				return this.lastName; 
			},
			getAccountType:function(){
				return accType; 
			}
		}; 
	}
	
	var person1 = createPerson('Suhail','Abood','admin'); 
	var person2 = createPerson('John','Doe','guest'); 
	
	//since accountType is a private property it cannot be accessed 
	//using dot notation. 
	console.log(person1.accountType); //this will log `admin`; 
	
	//public properties can still be accessed using dot notation. 
	person2.firstName = 'James'; 
	console.log(person2.getFirstName()); //this will log `James` 
	console.log(person2.firstName); //this will also log `James`
	
	```
4. **Arrow Functions**: TypeScript supports lamda functions. **Lambda functions** are special types of functions that do not create new context when they run, but rather inheriting the executing context. This is particularly usefull when working with inner functions inside object methods, because it allows for using the `this` modifier without the need to rename it in the context. 

```typescript
	class Person {
		id:number;
		firstName:string;
		lastName:string;
		constructor(id:number){
			this.id = id; 
		}
		
		loadPerson(){
			//in order to set data members on the person instance, 
			//we need to create an alias to the "this" modifier
			//this is because the "function" keyword creates a new 
			//in which "this" will refer to something else other than the 
			//person's instance. 
			let self = this; 
			fetch('http://blahblah.com/person/'+this.id)
				.then(function(em){
					self.firstName = em.firstName;
					self.lastName = em.lastName; 
				});
			
			//with arrow functions
			//the body of the function inherits the executing 
			//context (scope),
			//thus "this" is actually refering to the person's instance.  
			fetch('http://blahblah.com/person/'+this.id)
				.then((em)=>{
					this.firstName = em.firstName;
					this.lastName = em.lastName; 
				});
			
		}
	}

```


## CSS/SASS/SCSS Conventions
* Sass must be used as a CSS transpiler. As of the time of writing this document, there are no benefits of using other transpilers i.e. less, stylus, etc over sass, and unless there are game changing features, sass must be used. 
* Styles should be spread across files (never let style files get over crowded with styles). 
* Unless there is a good reason, stick with `box-sizing:border-box`. **Why?** `content-box` means that `width` and `height` properties include only the content, meaning that `padding`, `border`, and `margin` aren't. This causes major layout issues specially when dealing with grid systems. `border-box` on the other hand, means that `width` and `height` include content, padding, border but not `margin`. **Bootstrap** uses `border-box` by default. 
* Sass file names should reflect the contents of the file, and often target specific area of the application, i.e. adherence to â€œSeparation of Concernsâ€ on file-level. 
* Configurable parts of style in a sass file should use variables instead of hard-coded values. The variables should be defined at the very top of the file itself not somewhere else. This holds even if a centralised configuration file is in use, hint use the â€œ!defaultâ€ modifier.  
* Variables that represent colours should be named after what they represent, not by how they look, for example:

	```scss
		//instead of this 
		$color-lightblue:#9CF; 
		
		//do this 
		$color-brand-1:#9CF; 
		
		$button-border-color:$color-brand-1; 
		$text-link-color:$color-brand-1; 
		
		//then use these variables instead. 
	```
  The reason behind this is that if at some point those colours change, for example in cases of rebranding, this would require changing all occurences of that colour in the source code. Otherwise, leaving the name as is, but changing its value would cause confusion and code debt. 

* Use hierarchical imports such that things can be added/removed at different levels. For example use a folder structure that looks like the following:
	* components
		* _AutoComplete.scss
		* _Combobox.scss
		* _Sidebar.scss
		* _components.scss  /// inclusion point for components
	* pages
		* _Home.scss
		* _Faq.scss
		* _pages.scss /// inclusion point for pages
	* main.scss // will include _components and _pages

  This way for example, page styles can be eliminated completely at the top level, while specific pages can be eliminated at the second level. This becomes really helpful when debugging style inheritance issues and clashes. 

* ID-based selectors must use capital case i.e. #TopNavigation, #SiteFooter, etc. 
* IDâ€™s should be unique across the project, this helps with tweaks later as these elements can be targeted specifically using the identifier without worrying about side effects or style clashes. 
* IDâ€™s should be used for top-level containers and unique elements (i.e. do not overuse them). 
* Class-based selectors must use hyphenated case i.e. .nav-bar-item, .btn-default, etc. 
* Classes should be used for layout and style, while data-attributes should be used for functionality and UI state changes. UI state changes refer to style changes triggered by a user interaction i.e. toggling a drop-down menu, or changing a switch buttonâ€™s active state. This is also inline with the separation of concerns concept. 
* Avoid using `absolute` positioning unless absolutely necessary. Absolutely positioned elements break the flow the page, which often leads to issue on different devices (screen sizes).  
* The style **must** support IE9+ and other modern browsers, unless specifically asked otherwise. 
* Use vendor prefixes where applicable, or a CSS post processor. Refer to [CanIUse.com](http://www.caniuse.com) for browser feature support. An easy trick to cover vendor prefixes (when using Sublime or Visual Studio code) is to type in the rule name prefixed with a hyphen, then press the â€œtabâ€ key, this will generate all vendor specific rules for you. Example: 

	```css 
	
	-border-radius //press tab key right after 
	Result:
	-moz-border-radius
	-ms-border-radius
	-o-border-radius
	-webkit-border-radius
	border-radius 
	
	``` 
* Keep nesting of css selectors to a maximum of 3 levels. 
* When dealing with media queries use mixins instead of using the â€œ@mediaâ€ directive. Sysdoc provides a sass framework that provides the following mixins:
	* @XSmallDevice, @MobileDevice
	* @SmallDevice, @TabletDevice
	* @MediumDevice, @DesktopDevice
	* @LargeDevice, @LargeDesktopDevice
* The actual size of the screen is found under _settings.scss within the frameworkâ€™s directory. 
* Refer to Sysdocâ€™s Sass tricks repo for a combination of common use-cases. 
* Use selector extension over mixins for style reuse, i.e. @extend .nav-bar-item instead of @include NavBarItem. 
* Sass mixin names must be in capital case i.e. LargeDevice. 
* Sass function names must be in camel case i.e. getAsset(). 
* Sass mixins and functions should adhere to the single-responsibility principle. I.e. a function or a mixin must perform a single operation that is inline with their names. 
* All sass files should be bundled into a single file. Hint: use output_style to switch between dev and production compilation i.e. non-minified and compressed. 

	```javascript
	var obj = {
		firstname:"Suhail",
		lastName:"Abood"
	};
	
	obj.firstName = "John";
	obj.lastname = "Doe"; 
	
	```
* **Note on selectors performance:** CSS selectors are executed from **right to left**, for example the selector `.name .text div` will be executed as follows:

	* The browoser will first find all `div` elements on page.
	* Next, the browser will check if each of those divs have an ancestor with a class `text`. 
	* Those that do, will then be checked whether they have an ancestor with a class `name`. 
	
	Instead, it would be a lot better to use `.name .text .my-item`, because insteadthe browser will only find those elements with `.my-item` class instead, thus eliminating lots of the unwanted candidates at a very early stage in resolving that selectors.  
* Avoid animating layout properties such as (top, left, bottom, right, padding, height, width). All of these properties cause a `relayout` on the page meaning that the browser will have to recalculate the geometry of these elements, apply changes to the layout of the page, and then redraw the page. Such animation can cause `jank` i.e. stuttering in animation and delay on page update. Moreover, because of the fact that these require recalculations, these animations are done by the CPU which is far less performant than the GPU in terms of animation processing. 
* The `opacity` and `transform` are both properties that do not cause a relayout and are performed on the GPU, thus giving better rendering performance. 
* A good practice for animating elements on a page is to elevate the element to have its own layer. You can force the browser to create a layer for an element using:

```css
transform:translateZ(1);
```

This causes the browser to create a layer for the element which means that the browser can repaint changes made to the element without repainting the whole page leading to better performance. 


## Assets Conventions 
* Assets file names must be written in hyphenated lowercase format. 
* A postfix must be added to the asset name in case of multiple versions, the prefix should be reflective of the difference between versions i.e. icon-1x.png icon-2x.png, icon-expand.png, icon-collapse.png. 

  
  
## PowerShell
1. We rely on PowerShell to map SharePoint drives to local drives such that we can easily deploy code to dev environments. 
2. Due to API differences, there are two PowerShell scripts one for **SharePoint on-premise**, and the other for **SharePoint Online**.


## TODOs

1. Create either `gists` or a repo to contain CSS tricks and hacks. 

	* a triangle arrow for dropdowns, etc using CSS borders. 
	* clearfix: to clear space after float elements. 
	* center elements vertically on screen. 
	* use cases for special css units such as `vh`, `vw`. 
	* hover state propagation. 
	* CSS selectors workthrough.
	* Animation and transition. 

2. Create a document for common pitfalls and issues on SharePoint. The document should provide clear instruction/description of problem and their solutions. 

