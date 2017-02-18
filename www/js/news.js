(function(){
	var app = angular.module('News', []);

	app.factory('News',['$http','$sce', function($http, $sce){
		var postsF = [];
		var args = {};

		function getImage(post, url){
			$http.get(url)
			.success(function(images){
 				// angular.forEach(images, function(image){
 					post.imagenList = images.media_details.sizes.thumbnail.source_url;
 					post.imagenSingle = images.media_details.sizes["wpf-carousel-image-big"].source_url;
 				// });
 			});
		}

		return {
			getNews: function(){
				var args={};
				$http.get('http://atleticorafaela.com.ar/contenidos/wp-json/wp/v2/posts/', {params:args})
				.success(function(posts){
					angular.forEach(posts, function(post){
 					// sanitize title, excerpt
 					post.excerpt.rendered = $sce.trustAsHtml(post.excerpt.rendered);
 					post.content.rendered = $sce.trustAsHtml(post.content.rendered);
 					// proceso de obtencion de imagenes
 					urlImagen = 'http://atleticorafaela.com.ar/contenidos/wp-json/wp/v2/media/' + post.featured_media;
 					// aca llamar la funcion local
 					getImage(post, urlImagen);
 					postsF.push(post);
 				});
				});
				return postsF;
			},
			list: function(){
				return this.getNews();
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
});