app.factory('sharedProperties', function() {
    var email = '';
    return {
        set_email: function(em){
            email = em;
        },
        get_email: function(){
            return email;
        }
    };
})
.factory('productService', function($http) {
    return {
        get_product_list: function(scope){
            $http.get(host + "/products/")
                .success(function(data, status, headers, config){
                    var products = data;
                    angular.forEach(products, function(product){
                        product.total_number = 0;
                        angular.forEach(product.sizes, function(s){
                            s.amount = 1;
                            product.total_number += 1;
                        });
                    });
                    angular.forEach()
                    scope.products = scope.all_products = products;
                })
                .error(function(data, status, headers, config){
                   console.log(data);
                });
        },
        get_collections: function(scope){
            $http.get(host + "/collection/")
                .success(function(data, status, headers, config){
                    scope.collections = data;
                    scope.col_filter = {};
                    angular.forEach(scope.collections, function(i){
                        scope.col_filter[i.title] = '';
                    });
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        },
        filter_product_list: function(scope){
            $http.post(host + "/studio/productfilter/", scope.filter_data)
                .success(function(data, status, headers, config){
                    scope.products = data;
                    $.msg_bre({ content:'搜索完成' });
                })
                .error(function(data, status, headers, config){
                   console.log(data);
                });
        }
    };
})
.factory('buyerService', function($http) {
    return {
        get_buyer_list: function(scope){
            $http.get(host + "/studio/group/")
                .success(function(data, status, headers, config){
                    scope.buyer_list = data.data;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        },
        filter_buyer_list: function(scope){
            $http.post(host + "/studio/buyerfilter/", scope.filter_data)
                .success(function(data, status, headers, config){
                    scope.buyer_list = data.data;
                    scope.avoidClick = false;
                    $.msg_bre({ content:'搜索完成' });

                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    scope.avoidClick = false;
                });
        }
    };
})
.factory('brandService', function($http, $cookieStore) {
    var home_scope = null;
    return {
        init: function(scope){
            home_scope = scope;
        },
        get_brand_list: function(){
            if(home_scope === null){
                return;
            }
            $http.get(host + "/brand/")
                .success(function(data, status, headers, config){
                    home_scope.g_brand_list = data;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        },
        get_profile: function(){
            if(home_scope === null){
                return;
            }
            $http.get(host + "/studio/")
                .success(function(data, status, headers, config){
                    home_scope.g_studio = data;
                    if(data.avatar_detail.url){
                        home_scope.g_avatar_url = host + data.avatar_detail.url;
                    }else{
                        home_scope.g_avatar_url = 'images/bredgy-icon.png';
                    }
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        },
        get_brand_info: function(){
            if(home_scope === null){
                return;
            }
            $http.get(host + "/brand/" + $cookieStore.get('bpk') + "/")
                .success(function(data, status, headers, config){
                    home_scope.g_brand = data;
                    if(data.image_detail.url){
                        home_scope.g_image_url = host + data.image_detail.url;
                    }else{
                        home_scope.g_image_url = 'images/logo_default.png';
                    }
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        },
        set_avatar_url: function(url){
            home_scope.g_avatar_url = host + url;
        },
        set_image_url: function(url){
            if(!url){
                home_scope.g_image_url ='images/logo_default.png';
            }
            else if(url.substring(0, 4) !== "http"){
                home_scope.g_image_url = host + url;
            }else{
                home_scope.g_image_url = url;
            }
        },
        set_username: function(username){
            home_scope.g_studio.username = username;
        }
    };
})
.factory('cropService', function($http, $timeout, $cookieStore, Cropper, brandService) {
    var file, data;
    return {
        init: function(scope, crop_w, crop_h, url, result_w, result_h, key){
                scope.onFile = function(blob) {
                    Cropper.encode((file = blob)).then(function(dataUrl) {
                      scope.dataUrl = dataUrl;
                      $timeout(showCropper);  // wait for $digest to set image's src
                    });
                };

                scope.cropper = {};
                scope.cropperProxy = 'cropper.first';

                scope.crop = function() {
                    if (!file || !data) return;
                    Cropper.crop(file, data)
                      .then(function(blob) {
                        return Cropper.scale(blob,
                        {width: result_w, height: result_h});
                      })
                      .then(Cropper.encode).then(function(dataUrl) {
                        var img = dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                        var data = {
                            'filetype': file.type.split('/')[1]
                        };
                        data[key] = img;
                        $http.post(host + url, data)
                            .success(function(data, status, headers, config){
                                $("#image_detail").attr('src', host + data.url);
                                $('.avatar').fadeOut();
                                $('.wrapper_white').fadeOut();
                                brandService.set_avatar_url(data.url);
                            })
                            .error(function(data, status, headers, config){
                                console.log(data);
                            });
                          });
                };

                scope.options = {
                    guides: false,
                    highlight: false,
                    dragCrop: false,
                    cropBoxResizable: false,
                    autoCropArea: 0.00000001,
                    minCropBoxWidth: crop_w,
                    minCropBoxHeight: crop_h,
                    crop: function(dataNew) {
                          data = dataNew;
                    }
                };

                scope.showEvent = 'show';
                scope.hideEvent = 'hide';

                function showCropper() {
                    scope.$broadcast(scope.showEvent);
                }
                function hideCropper() { scope.$broadcast(scope.hideEvent); }

                $('.btn_avatar_save').on('click', function(){
                    $('.avatar').fadeOut();
                    $('.wrapper_white').fadeOut();
                    $('.ng-image-crop button').click();
                });

                scope.get_avatar = function(){
                    $('.avatar input[type=file]').click();
                    hideCropper();
                };

                $('.btn_avatar_cancel').on('click', function(){
                    $('.avatar').fadeOut();
                    $('.wrapper_white').fadeOut();
                });

                $('.avatar input[type=file]').on('change',function(){
                    if(file){
                        $('.avatar').fadeIn();
                        $('.wrapper_white').fadeIn();
                    }
                });
        },
        crop_image: function(scope, result_w, result_h){
                if (!file || !data) return;
               Cropper.crop(file, data)
                  .then(function(blob) {
                    return Cropper.scale(blob,
                    {width: result_w, height: result_h});
                  })
                  .then(Cropper.encode).then(function(dataUrl) {
                    var img = dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                    scope.image1 = {
                                        'filetype': file.type,
                                        'base64': img,
                                        'filename': file.name
                                    };
                  });
        },
        upload_product_image: function(scope, result_w, result_h){
                if (!file || !data) return;
               Cropper.crop(file, data)
                  .then(function(blob) {
                    return Cropper.scale(blob,
                    {width: result_w, height: result_h});
                  })
                  .then(Cropper.encode).then(function(dataUrl) {
                     var img = dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                     var post_data = {
                            'image': {
                                'filetype': file.type,
                                'base64': img,
                                'filename': file.name
                            },
                            'is_primary': true,
                            'product_id': scope.product.id
                        };
                         if(scope.product.images[0]){
                            $http.put(host + "/product/images/" + scope.product.images[0].pk + "/", post_data)
                                .success(function(data, status, headers, config){
                                    scope.product.images[0] = data;
                                })
                                .error(function(data, status, headers, config){
                                    console.log(data);
                                });
                        }else{
                            $http.post(host + "/product/images/", post_data)
                                .success(function(data, status, headers, config){
                                    $scope.product.images[0] = data;
                                })
                                .error(function(data, status, headers, config){
                                    console.log(data);
                                });
                        }
                      });
        },
        upload_brand_image: function(scope, result_w, result_h, brand_id){
                                if (!file || !data) return;
                                Cropper.crop(file, data)
                                  .then(function(blob) {
                                    return Cropper.scale(blob,
                                    {width: result_w, height: result_h});
                                  })
                                  .then(Cropper.encode).then(function(dataUrl) {
                                    var img = dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                                    var data = {
                                        'filetype': file.type.split('/')[1],
                                        'image': img,
                                        'id': brand_id
                                    };
                                    $http.post(host + "/brand/update_image/", data)
                                        .success(function(data, status, headers, config){
                                            scope.brand.image_detail.url = data.url;
                                            $('.avatar').fadeOut();
                                            $('.wrapper_white').fadeOut();
                                            var bpk = $cookieStore.get('bpk');
                                            if(bpk === parseInt(brand_id)){
                                                brandService.set_image_url(data.url);
                                            }
                                        })
                                        .error(function(data, status, headers, config){
                                            console.log(data);
                                        });
                                      });
        }
    };
})
.factory('checkService', function($http, $timeout, Cropper) {
    return {
     checkUsable: function(cur_element){
        if(cur_element.hasClass('btn-loading')){
            return false;
        }else{
            cur_element.addClass('btn-loading');
            return true;
        }
      },
     doAfterAction: function(cur_element){
        cur_element.removeClass('btn-loading');
      }
    };
})
.service('anchorSmoothScroll', function(){

    this.scrollTo = function(eID) {

        // This scrolling function
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY;
        if( eID == 'top' )
        {
            stopY = 0;
        }
        else{
            stopY = elmYPosition(eID);
        }
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var j=startY; j>stopY; j-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

    };

});