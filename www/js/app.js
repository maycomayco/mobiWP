(function(){
	// var app = angular.module('starter', ['ionic'])
	var app = angular.module('starter', ['ionic', 'angularMoment']);
	var postsL = [];
	// configuraciones iniciales para sitio y version de API
	var config = {
		// urlSite: 'http://libertadsunchales.com.ar',
		urlSite: 'http://atleticorafaela.com.ar/contenidos',
		urlApiPosts: '/wp-json/wp/v2/posts/',
		urlApiImages: '/wp-json/wp/v2/media/',
		// imgSizeAlias: 'medium',
		imgSizeAlias: 'wpf-carousel-image-big',
		imgThumbAlias: 'thumbnail',
		postPerPage: 5,
		urlPostsFull: function(){
			return this.urlSite + this.urlApiPosts;
		},
		urlImagesFull: function(){
			return this.urlSite + this.urlApiImages;
		}
	};
	app.factory('News',['$http','$sce', function($http, $sce){
		var postsF = [];
		var args = {};

		function getImage(post, url){
			$http.get(url)
			.success(function(images){
	 					post.imagenList = images.media_details.sizes[config.imgThumbAlias].source_url;
	 					post.imagenSingle = images.media_details.sizes[config.imgSizeAlias].source_url;
	 			});
		}

		return {
			getNews: function(postQuantity, postOffset){
				args['per_page'] = postQuantity;
				args['offset'] = postOffset;
				$http.get(config.urlPostsFull(), {params:args})
				.success(function(posts){
					angular.forEach(posts, function(post){
	 					// sanitize title, excerpt
	 					post.excerpt.rendered = $sce.trustAsHtml(post.excerpt.rendered);
	 					post.content.rendered = $sce.trustAsHtml(post.content.rendered);
	 					// proceso de obtencion de imagenes
	 					urlImagen = config.urlImagesFull() + post.featured_media;
	 					// aca llamar la funcion local
	 					getImage(post, urlImagen);
	 					postsF.push(post);
	 				});
				});
					return postsF;
				},
				list: function(postQuantity, postOffset = 0){
					return this.getNews(postQuantity, postOffset);
				},
				single: function(idBuscar){
					var result;
					angular.forEach(postsF, function(post){
						if (post.id == parseInt(idBuscar)) {
							result = post;
						}
					});
					return result;
				}
			}
		}]);

	app.config(function($stateProvider, $urlRouterProvider){
		$stateProvider.state('list', {
			url:'/list',
			templateUrl: 'templates/list.html'
		});
		$stateProvider.state('single', {
			url:'/single/:id',
			templateUrl: 'templates/single.html'
		});
		$urlRouterProvider.otherwise('/list');
	});

	app.controller('MainCtrl', function($scope, News){
		var urlImagen;
		$scope.posts = News.list(config.postPerPage);
		$scope.loadMoreButton = function(){
			var nuevosPosts = [];
			nuevosPosts = News.list(config.postPerPage, $scope.posts.length);
		};
	});

	app.controller('SingleCtrl',function($scope, $state, News){
			// id = lo utilizo en la view
			// $state.params.id = viene en la url
			$scope.id = $state.params.id;
			$scope.post = News.single($scope.id);
		});

	app.run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				// cordova.plugins.Keyboard.disableScroll(true);
			}
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}
		});
	})
}());