/*jslint node: true */
"use strict";

var app = angular.module('jeanineApp',
                         ['ngRoute',
//                         'ngFileUpload',
                         'ngCookies',
                         'ngSanitize',
                         'ngCsv',
                         'naif.base64',
                         'ngCropper',
                         ]);
app.factory('myHttpInterceptor', function($q, $location, $cookieStore) {
  return {
    'request': function(request) {
      request.headers = request.headers || {};
      var token = $cookieStore.get('brand');
      var bpk = $cookieStore.get('bpk');
      if(token){
        request.headers.Authorization = token;
      }
      if(bpk){
        request.headers.bpk = bpk;
      }
      return request;
    },
   'responseError': function(rejection) {
      //handle error
      var msg = rejection.statusText;
      if(rejection.data && rejection.data.detail){
        msg = rejection.data.detail;
      }
      if((msg === 'Authentication credentials were not provided.') ||
      (msg === "You do not have permission to perform this action.")){
          $.msg_bre({ content: '权限不足' });
          $cookieStore.remove("brand");
          $cookieStore.remove("bpk");
          $location.path('/login');
      }else if(msg === '' || msg === undefined){
          return $q.reject(rejection);
      }else{
          $.msg_bre({ content: msg });
          return $q.reject(rejection);
      }
    }
  };
});
app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider){
    $httpProvider.interceptors.push('myHttpInterceptor');
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $routeProvider
    .when("/", {
        templateUrl: "templates/home.html",
        controller: "HomeCtrl"
    })
    .when("/collection", {
        templateUrl: "templates/collection.html",
        controller: "CollectionCtrl"
    })
    .when("/linesheet", {
        templateUrl: "templates/linesheet.html",
        controller: "linesheetCtrl"
    })
//    .when("/category", {
//        templateUrl: "templates/category.html",
//        controller: "CategoryCtrl"
//    })
    .when("/code", {
        templateUrl: "templates/code.html",
        controller: "CodeCtrl"
    })
	.when("/coupon", {
        templateUrl: "templates/coupon.html",
        controller: "CouponCtrl"
    })
	.when("/output", {
        templateUrl: "templates/output.html",
        controller: "OutputCtrl"
    })
    .when("/buyer_list", {
        templateUrl: "templates/buyer_list.html",
        controller: "BuyerListCtrl"
    })
    .when("/buyer_detail/:buyer_id", {
        templateUrl: "templates/buyer_detail.html",
        controller: "BuyerDetailCtrl"
    })
    .when("/brand/:brand_id", {
        templateUrl: "templates/brand.html",
        controller: "BrandCtrl"
    })
    .when("/stylist/:brand_id", {
        templateUrl: "templates/stylist.html",
        controller: "StylistCtrl"
    })
    .when("/statistic", {
        templateUrl: "templates/statistic.html",
        controller: "StatisticCtrl"
    })
    .when("/product_manage",{
        templateUrl:"templates/product_manage.html",
        controller:"ProductManageCtrl"
    })
    .when("/product_new", {
        templateUrl: "templates/product_new.html",
        controller: "NewProductCtrl"
    })
    .when("/products/:product_id", {
        templateUrl: "templates/product.html",
        controller: "ProductCtrl"
    })
    .when("/products/:product_id/edit", {
        templateUrl: "templates/product_edit.html",
        controller: "ProductEditCtrl"
    })
    //----------------------------------订单管理--------------------------------------
    //未确认
    .when("/orders_new", {
        templateUrl: "templates/orders_new.html",
        controller: "ordersNewCtrl"
    })
    .when("/orders_unconfirm", {
        templateUrl: "templates/orders_unconfirm.html",
        controller: "OrdersUnconfirmCtrl"
    })
    //进行中
    .when("/orders_underway", {
        templateUrl: "templates/orders_underway.html",
        controller: "OrdersUnderwayCtrl"
    })
    //已完成
    .when("/orders_finish", {
        templateUrl: "templates/orders_finish.html",
        controller: "OrdersFinishCtrl"
    })
    //已作废
    .when("/orders_cancel", {
        templateUrl: "templates/orders_cancel.html",
        controller: "OrdersCancelCtrl"
    })
    //全部订单
    .when("/orders_all", {
        templateUrl: "templates/orders_all.html",
        controller: "OrdersAllCtrl"
    })
    //订单详情
    .when("/orders/:order_id", {
        templateUrl: "templates/order_detail.html",
        controller: "OrderDetailCtrl"
    })
    //订单商品统计
    .when("/orders_statistics/:checked_id", {
        templateUrl: "templates/orders_statistics.html",
        controller: "OrderStatCtrl"
    })
    //---------------------------------------------------------------------------------------
    .when("/studio/studio_basic", {
        templateUrl: "templates/studio_edit.html",
        controller: "StudioEditCtrl"
    })
    .when("/studio/:studio_pwd", {
        templateUrl: "templates/studio_pwd.html",
        controller: "StudioPwdCtrl"
    })
    .when("/messages", {
        templateUrl: "templates/messages.html",
        controller: "MessagesCtrl"
    })
    .when("/register", {
        templateUrl: "templates/register.html",
        controller: "RegisterCtrl"
    })
    .when("/register_success", {
        templateUrl: "templates/register_success.html",
        controller: "RegisterSuccessCtrl"
    })
    .when("/login", {
        templateUrl: "templates/login.html",
        controller: "LoginCtrl"
    })
    .when("/forget_pwd", {
        templateUrl: "templates/forget_pwd.html",
        controller: "ForgetPwdCtrl"
    })
    .when("/activate/:code", {
        templateUrl: "templates/activate.html",
        controller: "ActivateCtrl"
    })
    .when("/reset_pwd/:code", {
        templateUrl: "templates/reset_pwd.html",
        controller: "ResetPwdCtrl"
    })
    .when("/preview_linesheet", {
        templateUrl: "templates/preview_linesheet.html",
        controller: "PreViewProductListCtrl"
    })
    .when("/preview_product/:id", {
        templateUrl: "templates/preview_product.html",
        controller: "PreViewProductCtrl"
    })
    .when("/preview_brand", {
        templateUrl: "templates/preview_brand.html",
        controller: "PreViewBrandCtrl"
    })
    .when("/data_list", {
        templateUrl: "templates/data_list.html",
        controller: "DataListCtrl"
    })
    .when("/404", {
        templateUrl: "templates/404.html"
    })
    .otherwise({
    redirectTo: "/404"
    });
}]);

var host = "http://120.26.201.59";
if(location.host.indexOf("127.0.0.1") === 0){
    host = "http://127.0.0.1:8000";
}

if(location.host.indexOf("192.168.0.162") === 0){
    host = "http://192.168.0.162:9000";
}

app.run(function ($rootScope, $cookieStore, $location) {
      $rootScope.host = host;

      $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        var token = $cookieStore.get('brand');
        var bpk = $cookieStore.get('bpk');
        if($location.path() === '/register'){
        }else if($location.path() === '/register_success'){
        }else if($location.path() === '/forget_pwd'){
        }else if($location.path().indexOf('/activate') === 0){
        }else{
            if (token === undefined || bpk === undefined) {//
                $rootScope.$evalAsync(function() {
                    $location.path('/login'); // go to login
                });
            }
        }
      });
   });


app.constant('order_categories', {
        'unconfirm': 0,
        'underway': 1,
        'finish': 2,
        'cancel': 3
      });

app.constant('goods_status', {
        '-1':"未确认",
        '0': "未发货",
        '1': "已发货",
        '2': "交易完成",
        '3': "交易取消"
      });

app.constant('payment_status', {
        '0': "未付款",
        '1': "订金已收",
        '2': "全款已收"
      });