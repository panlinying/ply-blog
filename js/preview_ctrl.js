app.controller("PreViewProductCtrl",
    function($scope, $http, $location, $routeParams, anchorSmoothScroll){
        $http.get(host + "/products/" + $routeParams.id + "/")
            .success(function(data, status, headers, config){
                $scope.product = data;
                $scope.tags = data.tags.join(",");
                $scope.product.composition = $scope.product.composition.replace(/\n/g,'<br/>');
                $scope.product.description = $scope.product.description.replace(/\n/g,'<br/>');
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

        var sc_height = 0, sc_top = 0, sc_cal = 0, dom = $('.product-info'), dom_height = dom.height();
        sc_height = $('body').height();
        if( (dom_height + 155) < sc_height ) {
            dom.css({
                'postion': 'absolute',
                'bottom': 'auto'
            });
        }
        window.onscroll = function() {
            sc_top = $('body').scrollTop();
            sc_height = $('body').height();
            sc_cal = 120 + dom_height - sc_height;
            if( sc_top > sc_cal && ( dom_height + 155 ) > sc_height ) {
                    if( dom.css('position') == 'absolute' ) {
                        dom.css({
                            'position': 'fixed',
                            'bottom': '10px'
                        });
                    }
            }
            else if( ( dom_height + 155 ) < sc_height ) {
                    if( dom.css('position') == 'absolute' || dom.css('bottom') == '10px' ) {
                        dom.css({
                            'position': 'fixed',
                            'bottom': 'auto'
                        });
                    }
            }
            else {
                if( dom.css('position') == 'fixed' ) {
                    dom.css({
                        'position': 'absolute',
                        'bottom': 'auto'
                    });
                }
            }
        };

        $scope.gotoElement = function (eID) {
            if( eID === 0 ) {
                anchorSmoothScroll.scrollTo('top');
            }
            else {
                anchorSmoothScroll.scrollTo('tag'+eID);
            }
        };

    })
    .controller("PreViewBrandCtrl",
    function($scope, $http, $location, $route, productService){
        productService.get_collections($scope);
        $http.get(host + "/brand/designer/")
            .success(function(data, status, headers, config){
                $scope.stylist = data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
    })
    .controller("PreViewProductListCtrl",
    function($scope, $http, $location, $route){
        angular.element(document).ready(function () {
                $scope.mouse_enter = function(evt){
                    $(evt.currentTarget).find('.item-info').css({
                        'opacity' : '0.8',
                        'transform' : 'scale(1,1)'
                    });
                };
                $scope.mouse_leave = function(evt){
                    $(evt.currentTarget).find('.item-info').css({
                        'opacity' : '0',
                        'transform' : 'scale(1.2,1.2)'
                    });
                };

				$scope.detail_page = function(id){
				    $location.path("/preview_product/" + id);
				};
          });

          $scope.show_brandlist = function(e) {
            var dom = $(e.currentTarget);
            if( dom.hasClass('brands-active') ) {
                dom.removeClass('brands-active');
                dom.parent().find('.brands-list').slideUp();
            }
            else {
               $('.brands-active').removeClass('brands-active');
               $('.brands-list').slideUp();
               dom.addClass('brands-active');
               dom.parent().find('.brands-list').slideDown();
            }
        };

        $http.get(host + "/products/")
            .success(function(data, status, headers, config){
                $scope.products = data;
            })
            .error(function(data, status, headers, config){
               console.log(data);
            });
    });