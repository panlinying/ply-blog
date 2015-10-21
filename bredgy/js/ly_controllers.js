app.controller("ordersNewCtrl",function($scope, $http, $location, $route, buyerService, productService, goods_status, payment_status){
    $scope.payment_status = payment_status;
    $scope.goods_status = goods_status;
    $scope.status_g = -1;
    $scope.status_p = 0;
    //过滤器
    //scope
    $scope.dec_num=function(s, product){
        if(s.amount === 0){
            return;
        }
        s.amount -= 1;
        product.total_number -= 1;
        $scope.total_number -= 1;
        $scope.total_price -= product.price;
    };
    $scope.inc_num=function(s, product){
        s.amount += 1;
        product.total_number += 1;
        $scope.total_number += 1;
        $scope.total_price += product.price;
    };
    $scope.price_type = {
        '0': "以零售价为基准",
        '1': "以打折价为基准"
    };
    $scope.changeby = false;
    $scope.new_by = function(){ 
        $("#NewBuyer").show();
    };

    $scope.chose_buyer = function(){ 
        $("#ChoseBuyer").show();
        $("#addGoods").hide();
        buyerService.get_buyer_list($scope);
    };

   $scope.change_buyer = function(){ 
        $("#ChoseBuyer").show();
    }; 

    $scope.hide_chose_buyer = function(){ 
        $("#ChoseBuyer").hide();
    };

    $scope.choice_finish = false;
    $scope.chose_buyer_sure = function(){
        $scope.chosed_buyer = $scope.select_buyer;
        $scope.changeby = true;
        $("#ChoseBuyer").hide();
        $scope.choice_finish = true;
        $(".distpicker").distpicker({
                province: $scope.chosed_buyer.province,
                city: $scope.chosed_buyer.city,
            });
    };

    $scope.discount = 100;
    $scope.pickon_buyer = function(buyer){
        $scope.select_buyer = buyer;
        $scope.address = buyer.address;
        $scope.mobile = buyer.phone;
        $scope.contact = buyer.username;
        $scope.discount = buyer.discount;
    };

    $scope.add_goods = function(){ 
        $("#addGoods").show();
        $("#ChoseBuyer").hide();
        
    };
    productService.get_product_list($scope);
    productService.get_collections($scope);

    $scope.new_buyer = function(pristine){
            var company = $("#Pop_company").val();
            var username = $("#Pop_username").val();
            var email = $("#Pop_email").val();
            var phone = $("#Pop_phone").val();
            var province = $("#Pop_province").val();
            var city = $("#Pop_city").val();
            var address = $("#Pop_address").val();
            var price_type = $("#Pop_price_type").val();
            var discount = $("#Pop_discount").val();
            var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var post_data={
                "company":company,
                "username":username,
                "email":email,
                "phone":phone,
                "province":province,
                "city":city,
                "address":address,
                "price_type": price_type,
                "discount":discount,
                "create_by_brand": true
            };
            if(company==''){
                $.msg_bre({ content:'请输入买手店名！' });
                return;
            }
            if(username==''){
                $.msg_bre({ content:'请输入买手姓名！' });
                return;
            }
            if(address==''){
                $.msg_bre({ content:'请输入具体收货地址！' });
                return;
            }
            if(price_type==''){
                $.msg_bre({ content:'请输入价格方式！' });
                return;
            }
            if(discount==''){
                $.msg_bre({ content:'请输入折扣！' });
                return;
            }

            $http.post(host + "/studio/buyer/", post_data)
            .success(function(data, status, headers, config){
                $.msg_bre({ content: "新建买手成功" });
                $("#NewBuyer").hide();
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        };

    $scope.product_key = null;
    $scope.filter_goods = function(){
        if(!$scope.product_key){
            $scope.products = $scope.all_products;
            return;
        };
        $scope.products = [];
        angular.forEach($scope.all_products, function(p){
            if(p.name.indexOf($scope.product_key) > -1){
                $scope.products.push(p);
            }

            //angular foreach dont support 'break'
            var breakFlag = false;
            angular.forEach(p.sizes, function(s){
                if((!breakFlag) && (s.sku.indexOf($scope.product_key) > -1)){
                    $scope.products.push(p);
                    breakFlag = true;
                };
            });
        });
    };

    $scope.hide_addGoods = function(){
        $("#addGoods").hide();
    };


    $scope.checked_id = [];
    $scope.headChecked =false;
    $scope.SelectAll=function(list){
        $scope.headChecked = !$scope.headChecked;
        Select_All(list,$scope.checked_id,$scope.headChecked);
    };

    $scope.SelectOne = function(i){
        Select_One(i,$scope.checked_id);
    };

    $scope.show_goods_box = false;
    $scope.add_goods_sure = function(idNum){
        $scope.total_number = 0;
        $scope.total_price = 0;
        angular.forEach($scope.products, function(product){
            if(product.checked){
                $scope.total_number += product.total_number;
                $scope.total_price += product.total_number * product.price;
                product.selected = true;
            }else{
                product.selected = false;
            }
        });
        $scope.show_goods_box = true;
        $("#addGoods").hide();
    };

    $scope.delete_product = function(product){
        product.checked = false;
        product.selected = false;
        $scope.total_number -= product.total_number;
        $scope.total_price -= product.total_number * product.price;
    };


    $scope.discount = 100;
    $scope.new_order = function(){
        var selected_goods = [];
        angular.forEach($scope.products, function(product){
            if(product.checked){
                selected_goods.push(product);
            }
        });
        if(!$scope.select_buyer){
            $.msg_bre({'content': '缺少买手数据'});
            return;
        }
        if(selected_goods.length === 0){
            $.msg_bre({'content': '缺少商品数据'});
            return;
        }
        var post_data = {
            'total_number': $scope.total_number,
            'total_price': $scope.total_price,
            'contact': $scope.contact,
            'mobile': $scope.mobile,
            'shop': $scope.select_buyer.company,
            'discount': $scope.discount,
            'price_type': $scope.select_buyer.price_type,
            'province': $('#province').val(),
            'city': $('#city').val(),
            'address': $scope.address,
            'goods': selected_goods,
            'total': $scope.total_price,
            'goods_status': $scope.status_g,
            'payments_status': $scope.status_p,
            'buyer': $scope.select_buyer.pk
        };
        $http.post(host + "/studio/order/", post_data)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
                $.msg_bre({ content:'订单创建成功' });
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
    };
})
.controller("DataListCtrl",function($scope, $http, $location, $routeParams){
    //data_one
        var line_data_one = {
            labels : ["10-1","10-5","10-9","10-13","10-17","10-21","10-25","10-29"],
            datasets : [
                {
                    label: "My First dataset",
                    fillColor : "rgba(245, 165, 35, 0.43)",  //填充颜色
                    strokeColor : "#f5a623",  //曲线颜色
                    pointColor : "#f5a623",  //点的颜色
                    pointStrokeColor : "#fff",   //点的边框颜色
                    pointHighlightFill : "#fff",    // 鼠标经过填充颜色
                    pointHighlightStroke : "rgba(220,220,220,1)",  // 鼠标经过边框颜色
                    data : [12000,13000,15000,14000,16000,18000,15000,17000]
                },
            ]
        };

        var data_one = document.getElementById("data_one_canvas").getContext("2d");
        window.myLine = new Chart(data_one).Line(line_data_one, {
            responsive: true
        });

        //data_two
        var cli_data_three = [
            {
                value: 300,
                color:"#eb4d4c",
                highlight: "#eb4d4c",
                label: "衣服"
            },
            {
                value: 50,
                color: "#494949",
                highlight: "#494949",
                label: "衣服"
            },
            {
                value: 100,
                color: "#ff7574",
                highlight: "#ff7574",
                label: "衣服"
            },
            {
                value: 40,
                color: "#99938d",
                highlight: "#99938d",
                label: "衣服"
            },
        ];

        var data_two = document.getElementById("data_two_canvas").getContext("2d");
        window.myDoughnut = new Chart(data_two).Doughnut(cli_data_three, {responsive : true});

        //data_three
        var line_data_three = {
            labels : ["10-1","10-5","10-9","10-13","10-17","10-21","10-25","10-29"],
            datasets : [
                {
                    label: "My First dataset",
                    fillColor : "rgba(235, 76, 75, 0.55)",  //填充颜色
                    strokeColor : "#eb4d4c",  //曲线颜色
                    pointColor : "#eb4d4c",  //点的颜色
                    pointStrokeColor : "#fff",   //点的边框颜色
                    pointHighlightFill : "#fff",    // 鼠标经过填充颜色
                    pointHighlightStroke : "rgba(220,220,220,1)",  // 鼠标经过边框颜色
                    data : [12000,13000,15000,14000,16000,18000,15000,17000]
                },
            ]
        };

        var data_three = document.getElementById("data_three_canvas").getContext("2d");
        window.myLine = new Chart(data_three).Line(line_data_three, {
            responsive: true
        });

         //data_five
        var cli_data_four = [
            {
                value: 300,
                color:"#1777c9",
                highlight: "#1777c9",
                label: "买手店"
            },
            {
                value: 50,
                color: "#bfe6ff",
                highlight: "#bfe6ff",
                label: "买手店"
            },
            {
                value: 100,
                color: "#4baae6",
                highlight: "#4baae6",
                label: "买手店"
            },
            {
                value: 40,
                color: "#3e4249",
                highlight: "#3e4249",
                label: "买手店"
            },
        ];

        var data_four = document.getElementById("data_four_canvas").getContext("2d");
        window.myDoughnut = new Chart(data_four).Doughnut(cli_data_four, {responsive : true});

        //data_five
        var line_data_five = {
            labels : ["10-1","10-5","10-9","10-13","10-17","10-21","10-25","10-29"],
            datasets : [
                {
                    label: "My First dataset",
                    fillColor : "rgba(26, 119, 202, 0.42)",  //填充颜色
                    strokeColor : "#1b77ca",  //曲线颜色
                    pointColor : "#1b77ca",  //点的颜色
                    pointStrokeColor : "#fff",   //点的边框颜色
                    pointHighlightFill : "#fff",    // 鼠标经过填充颜色
                    pointHighlightStroke : "rgba(220,220,220,1)",  // 鼠标经过边框颜色
                    data : [12000,13000,15000,14000,16000,18000,15000,17000]
                },
            ]
        };

        var data_five = document.getElementById("data_five_canvas").getContext("2d");
        window.myLine = new Chart(data_five).Line(line_data_five, {
            responsive: true
        });
  
})
//订单管理--未确认
//---------------------------------------------------------------------------------------------------------------------------------
.controller("OrdersUnconfirmCtrl",function($scope, $http, $location, $route, $routeParams, order_categories, goods_status, payment_status){
        //打钩选择
        $scope.checked_id = [];
        $scope.headChecked =false;
        $scope.SelectAll=function(list){
            $scope.headChecked = !$scope.headChecked;
            Select_All(list,$scope.checked_id,$scope.headChecked);
        };
         $scope.SelectOne = function(i){
            Select_One(i,$scope.checked_id);
         };
         $scope.newWindow =function(){
            new_Window($scope.checked_id);  
         };
        //表单排序
        $scope.order_by = 'index';
        $scope.reverse = true;
        $scope.order = function(order_by){
            $scope.reverse = ($scope.order_by === order_by)?!$scope.reverse:false;
            $scope.order_by = order_by;
        };
        //确认取消订单
        var newDialog = function(m,n) {
            var targetDiv = $("#canceldd"+n);
            //var dialogParent = targetDiv.parent();  
            //var dialogOwn = targetDiv.clone();  
            //dialogOwn.hide();
            targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:"body",
                resizable: false,
                width:"40%",
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.cancel_order(m,n);
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () {
                    //dialogOwn.appendTo(dialogParent);  
                    //$(this).dialog("destroy").remove(); 
                    $(this).hide();
                }
            });
        };

        $scope.confirm_cancel=function(m,n){
            $(newDialog(m,n));
            $( "#canceldd"+n).dialog("open");
            $('.ui-dialog :button').blur();
        };
        $scope.goods_status = goods_status;
        $scope.payment_status = payment_status;
        //确认收到付款
        var newMoneyDialog = function(m,n) {
            var targetDiv = $("#money-confirm"+n);
            //var dialogParent = targetDiv.parent();  
            //var dialogOwn = targetDiv.clone();  
            //dialogOwn.hide();
            targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".ddqk",
                width:"345px",
                resizable: false,
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.confirm_payment(m);
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () {
                    //dialogOwn.appendTo(dialogParent);  
                    //$(this).dialog("destroy").remove(); 
                    $(this).hide();
                }
            });
        };
        $scope.confirm_money=function(m,n){
            $(newMoneyDialog(m,n));
            $( "#money-confirm"+n).dialog("open");
            $('.ui-dialog :button').blur();
        };

        $scope.show = false;
        $scope.choose= function() {
            $scope.show = !$scope.show;
        };

        $http.get(host + "/studio/order/?category=" + order_categories.unconfirm)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

        $scope.delivery = function(i) {
            i.wait_visible = true;
        };

        $scope.cancel_deliver = function(i){
            i.wait_visible = false;
        };

        $scope.show_confirm = function(i){
            $scope.win_visible = true;
        };

         $scope.cancel_order = function(i, index){
            var data = {
                "cancel": true
            };
            $http.put(host + "/studio/order/" + i.id + "/", data)
                .success(function(data, status, headers, config){
                    i.goods_status = 3;
                    $scope.order_list.splice(index, 1);
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
         };
        $scope.confirm_payment = function(i){
            var data = {
                "payment_status": 1
            };
            $http.put(host + "/studio/order/" + i.id + "/", data)
                .success(function(data, status, headers, config){
                    i.payment_status = 1;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
        $scope.confirm_delivery = function(i){
            var data = {
                "confirm": 1,
                "delivery": i.delivery,
                "express_num": i.express_num
            };
            $http.put(host + "/studio/order/" + i.id + "/", data)
                .success(function(data, status, headers, config){
                    i.goods_status = 1;
                    i.wait_visible = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        $scope.filter_orders = function() {
            $http.post(host + "/studio/orderfilter/", $scope.filter_data)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
                $.msg_bre({ content:'搜索完成' });
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        };
})
//订单管理--进行中
//---------------------------------------------------------------------------------------------------------------------------------
.controller("OrdersUnderwayCtrl",function($scope, $http, $location, $route, $routeParams,order_categories, goods_status, payment_status){
        //打钩选择
        $scope.checked_id = [];
        $scope.headChecked =false;
        $scope.SelectAll=function(list){
            $scope.headChecked = !$scope.headChecked;
            Select_All(list,$scope.checked_id,$scope.headChecked);
        };
         $scope.SelectOne = function(i){
            Select_One(i,$scope.checked_id);
         };
         $scope.newWindow =function(){
            new_Window($scope.checked_id);  
         };
        //表单排序
        $scope.order_by = 'index';
        $scope.reverse = true;
        $scope.order = function(order_by){
            $scope.reverse = ($scope.order_by === order_by)?!$scope.reverse:false;
            $scope.order_by = order_by;
        };
        //日期控件
        $(".finish-time-from,.finish-time-to,.deal-time-from,.deal-time-to")
            .datepicker({dateFormat:'yy-mm-dd'});

        $scope.goods_status = goods_status;
        $scope.payment_status = payment_status;

        //表单重置
        $scope.order_reset=function() {
            reset();
        };
        var reset=function(){
            $scope.goods_status_filter = {
                'not_confirmed':'',
                'not_delivery': '',
                'delivery': '',
                'done': '',
                'cancel': ''
            };
            $scope.payment_status_filter = {
                'not_pay': '',
                'part_payed': '',
                'all_payed': ''
            };
            $scope.filter_data = {
                'payment_status': [],
                'goods_status': [],
                'category': order_categories.underway,
                'order_number': '',
                'product': '',
                'shop': '',
                'name': '',
                'sku': '',
                'phone': '',
                'city': '',
                'min_total': '',
                'max_total': '',
                'min_complete_time': '',
                'max_complete_time': '',
                'min_confirm_time': '',
                'max_confirm_time': '',
                'min_book_time': '',
                'max_book_time': ''
            };
        };
        reset();
        //确认取消订单
        var newDialog = function(m,n) {
            var targetDiv = $("#canceldd"+n);
            //var dialogParent = targetDiv.parent();  
            //var dialogOwn = targetDiv.clone();  
            //dialogOwn.hide();
            targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:"body",
                resizable: false,
                width:"40%",
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.cancel_order(m,n);
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () {
                    //dialogOwn.appendTo(dialogParent);  
                    //$(this).dialog("destroy").remove(); 
                    $(this).hide();
                }
            });
        };

        $scope.confirm_cancel=function(m,n){
            $(newDialog(m,n));
            $( "#canceldd"+n).dialog("open");
            $('.ui-dialog :button').blur();
        };
        //确认收到付款
        var newMoneyDialog = function(m,n) {
            var targetDiv = $("#money-confirm"+n);
            //var dialogParent = targetDiv.parent();  
            //var dialogOwn = targetDiv.clone();  
            //dialogOwn.hide();
            targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".ddqk",
                width:"345px",
                resizable: false,
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.confirm_payment(m);
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () {
                    //dialogOwn.appendTo(dialogParent);  
                    //$(this).dialog("destroy").remove(); 
                    $(this).hide();
                }
            });
        };
        $scope.confirm_money=function(m,n){
            $(newMoneyDialog(m,n));
            $( "#money-confirm"+n).dialog("open");
            $('.ui-dialog :button').blur();
        };

        $scope.show = false;
        $scope.choose= function() {
            $scope.show = !$scope.show;
        };

        $http.get(host + "/studio/order/?category=" + order_categories.underway)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

        $scope.delivery = function(i) {
            i.wait_visible = true;
        };

        $scope.cancel_deliver = function(i){
            i.wait_visible = false;
        };

        $scope.show_confirm = function(i){
            $scope.win_visible = true;
        };

         $scope.cancel_order = function(i, index){
            var data = {
                "cancel": true,
                "content": $scope.cancel_reason   //增加取消原因
            };
            $http.put(host + "/studio/order/" + i.id + "/", data)
                .success(function(data, status, headers, config){
                    i.goods_status = 3;
                    $scope.order_list.splice(index, 1);
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
         };

         //确认订金
         $scope.confirm_deposit = function(i){
            var data = {
                "payment_status": 1
            };
            $http.put(host + "/studio/order/" + i.id + "/", data)
                .success(function(data, status, headers, config){
                    i.payment_status = 1;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        //确认全款
         $scope.confirm_payment = function(i){
            var data = {
                "payment_status": 2
            };
            $http.put(host + "/studio/order/" + i.id + "/", data)
                .success(function(data, status, headers, config){
                    i.payment_status = 1;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
        $scope.confirm_delivery = function(i){
            var data = {
                "confirm": 1,
                "delivery": i.delivery,
                "express_num": i.express_num
            };
            $http.put(host + "/studio/order/" + i.id + "/", data)
                .success(function(data, status, headers, config){
                    i.goods_status = 1;
                    i.wait_visible = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
        $scope.filter_orders = function() {
            $scope.filter_data.goods_status = [];
                angular.forEach($scope.goods_status_filter, function(v, k){
                    if(v !== ''){
                        $scope.filter_data.goods_status.push(v);
                    }
                });
                $scope.filter_data.payment_status = [];
                angular.forEach($scope.payment_status_filter, function(v, k){
                    if(v !== ''){
                        $scope.filter_data.payment_status.push(v);
                    }

                });
            $http.post(host + "/studio/orderfilter/", $scope.filter_data)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
                $.msg_bre({ content:'搜索完成' });
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        };
})
//订单管理--已完成
//-------------------------------------------------------------------------------------------------------------------------------
.controller("OrdersFinishCtrl",function($scope, $http, $location, $routeParams,order_categories, goods_status, payment_status){
        //打钩选择
        $scope.checked_id = [];
        $scope.headChecked =false;
        $scope.SelectAll=function(list){
            $scope.headChecked = !$scope.headChecked;
            Select_All(list,$scope.checked_id,$scope.headChecked);
        };
         $scope.SelectOne = function(i){
            Select_One(i,$scope.checked_id);
         };
         $scope.newWindow =function(){
            new_Window($scope.checked_id);  
         };
        //表单排序
        $scope.order_by = 'index';
        $scope.reverse = true;
        $scope.order = function(order_by){
            $scope.reverse = ($scope.order_by === order_by)?!$scope.reverse:false;
            $scope.order_by = order_by;
        }; 
        //日期控件
        $(".finish-time-from,.finish-time-to,.deal-time-from,.deal-time-to")
            .datepicker({dateFormat:'yy-mm-dd'});
        $scope.order_reset=function() {
            reset();
        };

        $scope.goods_status = goods_status;
        $scope.payment_status = payment_status;

        var reset=function(){
            $scope.deal_status_filter = {
                '2': '',
                '3': ''
            };
            $scope.goods_status_filter = {
                'not_delivery': '',
                'delivery': '',
                'done': '',
                'cancel': ''
            };
            $scope.payment_status_filter = {
                'not_pay': '',
                'payed': ''
            };

            $scope.filter_data = {
                'category': order_categories.finish,
                'order_number': '',
                'product': '',
                'shop': '',
                'name': '',
                'sku': '',
                'phone': '',
                'city': '',
                'min_total': '',
                'max_total': '',
                'min_complete_time': '',
                'max_complete_time': '',
                'min_confirm_time': '',
                'max_confirm_time': '',
                'min_book_time': '',
                'max_book_time': ''
            };
        };
        reset();

        $scope.show = false;
        $scope.choose= function() {
            $scope.show = !$scope.show;
        };


    $http.get(host + "/studio/order/?category="+order_categories.finish)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
    $scope.filter_orders = function() {
            $http.post(host + "/studio/orderfilter/", $scope.filter_data)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
                $.msg_bre({ content:'搜索完成' });
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        };
    })
//订单管理--已作废
//-------------------------------------------------------------------------------------------------------------------------------
.controller("OrdersCancelCtrl",function($scope, $http, $location, $routeParams,order_categories, goods_status, payment_status){
        //打钩选择
        $scope.checked_id = [];
        $scope.headChecked =false;
        $scope.SelectAll=function(list){
            $scope.headChecked = !$scope.headChecked;
            Select_All(list,$scope.checked_id,$scope.headChecked);
        };
         $scope.SelectOne = function(i){
            Select_One(i,$scope.checked_id);
         };
         $scope.newWindow =function(){
            new_Window($scope.checked_id);  
         };
        //表单排序
        $scope.order_by = 'index';
        $scope.reverse = true;
        $scope.order = function(order_by){
            $scope.reverse = ($scope.order_by === order_by)?!$scope.reverse:false;
            $scope.order_by = order_by;
        }; 
        //日期控件
        $(".finish-time-from,.finish-time-to,.deal-time-from,.deal-time-to")
            .datepicker({dateFormat:'yy-mm-dd'});
        $scope.order_reset=function() {
            reset();
        };
      
        $scope.goods_status = goods_status;
        $scope.payment_status = payment_status;

        var reset=function(){
            $scope.filter_data = {
                'category': order_categories.cancel,
                'order_number': '',
                'product': '',
                'shop': '',
                'name': '',
                'sku': '',
                'phone': '',
                'city': '',
                'min_total': '',
                'max_total': '',
                'min_complete_time': '',
                'max_complete_time': '',
                'min_confirm_time': '',
                'max_confirm_time': '',
                'min_book_time': '',
                'max_book_time': ''
            };
        };
        reset();

        $scope.show = false;
        $scope.choose= function() {
            $scope.show = !$scope.show;
        };

    $http.get(host + "/studio/order/?category="+order_categories.cancel)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
    $scope.filter_orders = function() {
            $http.post(host + "/studio/orderfilter/", $scope.filter_data)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
                $.msg_bre({ content:'搜索完成' });
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        };
})
//全部订单
//-------------------------------------------------------------------------------------------------------------------------------
.controller("OrdersAllCtrl",function($scope, $http, $location, $route, $routeParams, goods_status, payment_status){
        //打钩选择
        $scope.checked_id = [];
        $scope.headChecked =false;
        $scope.SelectAll=function(list){
            $scope.headChecked = !$scope.headChecked;
            Select_All(list,$scope.checked_id,$scope.headChecked);
        };
         $scope.SelectOne = function(i){
            Select_One(i,$scope.checked_id);
         };
         $scope.newWindow =function(){
            new_Window($scope.checked_id);  
         };
        //表单排序
        $scope.order_by = 'index';
        $scope.reverse = true;
        $scope.order = function(order_by){
            $scope.reverse = ($scope.order_by === order_by)?!$scope.reverse:false;
            $scope.order_by = order_by;
        };
        //日期控件
        $(".finish-time-from,.finish-time-to,.deal-time-from,.deal-time-to")
            .datepicker({dateFormat:'yy-mm-dd'});
        //表单重置
        $scope.payment_status = payment_status;
        $scope.goods_status = goods_status;
        
        $scope.order_reset=function() {
            reset();
        };
        var reset=function(){
            $scope.goods_status_filter = {
                'not_confirmed':'',
                'not_delivery': '',
                'delivery': '',
                'done': '',
                'cancel': ''
            };
            $scope.payment_status_filter = {
                'not_pay': '',
                'part_payed': '',
                'all_payed': ''
            };
            $scope.filter_data = {
                'payment_status': [],
                'goods_status': [],
                'order_number': '',
                'product': '',
                'shop': '',
                'name': '',
                'sku': '',
                'phone': '',
                'city': '',
                'min_total': '',
                'max_total': '',
                'min_complete_time': '',
                'max_complete_time': '',
                'min_confirm_time': '',
                'max_confirm_time': '',
                'min_book_time': '',
                'max_book_time': ''
            };
        };
        reset();
        //确认取消订单
        var newDialog = function(m,n) {
            var targetDiv = $("#canceldd"+n);
            //var dialogParent = targetDiv.parent();  
            //var dialogOwn = targetDiv.clone();  
            //dialogOwn.hide();
            targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:"body",
                resizable: false,
                width:"40%",
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.cancel_order(m,n);
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () {
                    //dialogOwn.appendTo(dialogParent);  
                    //$(this).dialog("destroy").remove(); 
                    $(this).hide();
                }
            });
        };
        $scope.confirm_cancel=function(m,n){
            $(newDialog(m,n));
            $( "#canceldd"+n).dialog("open");
            $('.ui-dialog :button').blur();
        };
        //确认收到付款
        var newMoneyDialog = function(m,n) {
            var targetDiv = $("#money-confirm"+n);
            //var dialogParent = targetDiv.parent();  
            //var dialogOwn = targetDiv.clone();  
            //dialogOwn.hide();
            targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".ddqk",
                width:"345px",
                resizable: false,
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.confirm_payment(m);
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () {
                    //dialogOwn.appendTo(dialogParent);  
                    //$(this).dialog("destroy").remove(); 
                    $(this).hide();
                }
            });
        };
        $scope.confirm_money=function(m,n){
            $(newMoneyDialog(m,n));
            $( "#money-confirm"+n).dialog("open");
            $('.ui-dialog :button').blur();
        };

        $scope.show = false;
        $scope.choose= function() {
            $scope.show = !$scope.show;
        };

        $http.get(host + "/studio/order/")
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

        $scope.delivery = function(i) {
            i.wait_visible = true;
        };

        $scope.cancel_deliver = function(i){
            i.wait_visible = false;
        };

        $scope.show_confirm = function(i){
            $scope.win_visible = true;
        };

         $scope.cancel_order = function(i, index){
            var data = {
                "cancel": true
            };
            $http.put(host + "/studio/order/" + i.id + "/", data)
                .success(function(data, status, headers, config){
                    i.goods_status = 3;
                    //$scope.order_list.splice(index, 1);
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
         };
        $scope.confirm_payment = function(i){
            var data = {
                "payment_status": 1
            };
            $http.put(host + "/studio/order/" + i.id + "/", data)
                .success(function(data, status, headers, config){
                    i.payment_status = 1;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
        $scope.confirm_delivery = function(i){
            var data = {
                "confirm": 1,
                "delivery": i.delivery,
                "express_num": i.express_num
            };
            $http.put(host + "/studio/order/" + i.id + "/", data)
                .success(function(data, status, headers, config){
                    i.goods_status = 1;
                    i.wait_visible = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
        $scope.filter_orders = function() {
            $scope.filter_data.goods_status = [];
            angular.forEach($scope.goods_status_filter, function(v, k){
                if(v !== ''){
                    $scope.filter_data.goods_status.push(v);
                }
            });
            $scope.filter_data.payment_status = [];
            angular.forEach($scope.payment_status_filter, function(v, k){
                if(v !== ''){
                    $scope.filter_data.payment_status.push(v);
                }

            });
            $http.post(host + "/studio/orderfilter/", $scope.filter_data)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
                $.msg_bre({ content:'搜索完成' });
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

        };
})
//订单详情
//-------------------------------------------------------------------------------------------------------------------------------
.controller("OrderDetailCtrl",function($scope, $http, $location, $routeParams, goods_status, payment_status){
        $http.get(host + "/studio/order/" + $routeParams.order_id + "/")
            .success(function(data, status, headers, config){
                $scope.order = data.data;

            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

        $scope.price_type = {
            '0': "以零售价为基准",
            '1': "以打折价为基准"
        };
        $scope.goods_status = goods_status;
        $scope.payment_status = payment_status;
        
        $scope.update_order = function(){
            $http.put(host + "/studio/order/" + $scope.order.id + '/', $scope.order)
            .success(function(data, status, headers, config){
                console.log(data);
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        };
        //确认订单弹窗
         var cDialog = function() {
            var targetDiv = $("#confirmdd");
                targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".wrapper",
                width:"345px",
                resizable: false,
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.confirm_order();
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () {
                    $(this).hide();
                }
            });
        };
        $scope.confirm_dd=function(){
            $(cDialog());
            $( "#confirmdd").dialog("open");
            $('.ui-dialog :button').blur();
        };
        //确认取消订单弹窗
        var newDialog = function(order_id) {
            var targetDiv = $("#canceldd"+order_id);
                targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".wrapper",
                width:"40%",
                resizable: false,
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.cancel_order(order_id);
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () {
                    $(this).hide();
                }
            });
        };
        $scope.confirm_cancel=function(order_id){
            $(newDialog(order_id));
            $( "#canceldd"+order_id).dialog("open");
            $('.ui-dialog :button').blur();
        };
        //确认收到定金弹窗
        var newDepositMoneyDialog = function(order_id) {
            var targetDiv = $("#deposit-money-confirm"+order_id);
            targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".wrapper",
                width:"345px",
                resizable: false,
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.confirm_deposit_payment(order_id);
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () { 
                    $(this).hide();
                }
            });
        };
        $scope.confirm_depositMoney=function(order_id){
            $(newDepositMoneyDialog(order_id));
            $( "#deposit-money-confirm"+order_id).dialog("open");
            $('.ui-dialog :button').blur();
        };
        //确认收到全款
        var newAllMoneyDialog = function(order_id) {
            var targetDiv = $("#all-money-confirm"+order_id);
            targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".wrapper",
                width:"345px",
                resizable: false,
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.confirm_all_payment(order_id);
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () { 
                    $(this).hide();
                }
            });
        };
        $scope.confirm_allMoney=function(order_id){
            $(newAllMoneyDialog(order_id));
            $( "#all-money-confirm"+order_id).dialog("open");
            $('.ui-dialog :button').blur();
        };
        //发货弹窗
        var sendDialog = function(order_id) {
            var targetDiv = $("#delivery"+order_id);
            targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".wrapper",
                width:"345px",
                resizable: false,
                modal: true,
                buttons:{
                        "确认发货":function() {
                            $scope.confirm_delivery(order_id);
                            $( this ).dialog( "close" );

                        },
                        "返回":function() {
                            $( this ).dialog( "close" );
                            
                        }
                        },
                close:function () {
                    $(this).hide();
                }
            });
        };
        $scope.delivery=function(order_id){
            $(sendDialog(order_id));
            $( "#delivery"+order_id).dialog("open");
            $('.ui-dialog :button').blur();
        };
        //显示和隐藏状态的改变
        $scope.showDeal=true;
        //调整
        
        $scope.change_discount = function(){
            $scope.temporary_discount = $scope.order.discount;
            $scope.beginDiscount = $scope.order.discount;
            $scope.showDeal = false;
            //临时变量
        };
        //保存 调整
        $scope.save_discount = function(order_id){
            $scope.showDeal=true;
            $http.put(host + "/studio/order/" + order_id + '/', {
                discount: $scope.temporary_discount
            })
            .success(function(data, status, headers, config){
                $scope.order.discount = $scope.temporary_discount;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        };
        
        //取消 调整
        $scope.change_cancel = function(){
            $scope.showDeal=true;  
        };
        //确认订单
        $scope.confirm_order = function(){
            var data = {
                "confirm": true
            };
            $http.put(host + "/studio/order/" + $scope.order.id + "/", data)
                .success(function(data, status, headers, config){
                    $scope.order.goods_status = 0;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });    
        };
        //取消订单
        $scope.cancel_order = function(){
            var data = {
                "cancel": true,
                "content": $scope.cancel_reason   //增加取消原因
            };
            $http.put(host + "/studio/order/" + $scope.order.id + "/", data)
                .success(function(data, status, headers, config){
                    $scope.order.goods_status = 3;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
        //确定定金
        $scope.confirm_deposit_payment = function(){
            var data = {
                "payment_status": 1
            };
            $http.put(host + "/studio/order/" + $scope.order.id + "/", data)
                .success(function(data, status, headers, config){
                    $scope.order.payment_status = 1;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
          //确定全款
        $scope.confirm_all_payment = function(){
            var data = {
                "payment_status": 2
            };
            $http.put(host + "/studio/order/" + $scope.order.id + "/", data)
                .success(function(data, status, headers, config){
                    $scope.order.payment_status = 2;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
        //确定发货
        $scope.confirm_delivery = function(){
            var data = {
                "send_goods": 1,
                "delivery": $scope.order.delivery,
                "express_num": $scope.order.express_num
            };
            $http.put(host + "/studio/order/" + $scope.order.id + "/", data)
                .success(function(data, status, headers, config){
                    $scope.order.goods_status = 1;
                    $scope.order.wait_visible = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
    })

//订单统计
//-------------------------------------------------------------------------------------------------------------------------------
.controller("OrderStatCtrl",function($scope, $http, $location, $routeParams,$route){
        var post_data = {"ids": $routeParams.checked_id};
        $http.put(host + "/studio/orderstat/", post_data)
            .success(function(data, status, headers, post_data){
                $scope.order_list = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        
        //表单排序
        /*$scope.order_by = 'index';
        $scope.reverse = true;
        $scope.order = function(order_by){
            $scope.reverse = ($scope.order_by === order_by)?!$scope.reverse:false;
            $scope.order_by = order_by;
        };
        //日期控件
        $(".finish-time-from,.finish-time-to,.deal-time-from,.deal-time-to")
            .datepicker({dateFormat:'yy-mm-dd'});
        $scope.order_reset=function() {
            reset();
        };     
        //表单重置
        $scope.order_reset=function() {
            reset();
        };
        var reset=function(){
            $scope.goods_status_filter = {
                'not_confirmed':'',
                'not_delivery': '',
                'delivery': '',
                'done': '',
                'cancel': ''
            };
            $scope.payment_status_filter = {
                'not_pay': '',
                'payed': ''
            };
            $scope.filter_data = {
                'finished': false,
                'payment_status': [],
                'goods_status': [],
                'order_number': '',
                'product': '',
                'shop': '',
                'name': '',
                'sku': '',
                'phone': '',
                'city': '',
                'min_total': '',
                'max_total': '',
                'min_complete_time': '',
                'max_complete_time': '',
                'min_confirm_time': '',
                'max_confirm_time': '',
                'min_book_time': '',
                'max_book_time': ''
            };
        };
        reset();
        
        $scope.payment_status = {
            '0': "未付款",
            '1': "已收款"
        };
        $scope.goods_status = {
            '-1':"未确认",
            '0': "未发货",
            '1': "已发货",
            '2': "交易完成",
            '3': "交易取消"
        };
        $scope.show = false;
        $scope.choose= function() {
            $scope.show = !$scope.show;
        };

        $http.get(host + "/studio/order2/")
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        $scope.filter_orders = function() {
            $scope.filter_data.goods_status = [];
            angular.forEach($scope.goods_status_filter, function(v, k){
                if(v !== ''){
                    $scope.filter_data.goods_status.push(v);
                }
            });
            $scope.filter_data.payment_status = [];
            angular.forEach($scope.payment_status_filter, function(v, k){
                if(v !== ''){
                    $scope.filter_data.payment_status.push(v);
                }

            });
            $http.post(host + "/studio/orderfilter2/", $scope.filter_data)
            .success(function(data, status, headers, config){
                $scope.order_list = data.data;
                $.msg_bre({ content:'搜索完成' });
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        };*/
})
//商品管理
//-------------------------------------------------------------------------------------------------------------------------------
.controller("ProductManageCtrl",function($scope, $http, $window, $routeParams, $location, productService){
        //打开标签页
        $scope.preview_linesheet = function(){
            $window.open("#/preview_linesheet");
        }
        //商品排序
        $scope.order_by = 'created';
        $scope.reverse = true;
        $scope.sortWay = '添加时间降序';
        $scope.showSort = false;
        $scope.proOrder = function(order_by,upDown,method){
            $scope.reverse = upDown;
            $scope.order_by = order_by;
            $scope.sortWay = method;
            $scope.showSort = false;
        };
        $scope.showOrder = function(){
            $scope.showSort = !$scope.showSort;
        };
        
        $scope.hideSort = function(e){
            if(!$('.eTarget').is(event.target)){
                $scope.showSort = false;    
            }
        };
        
        var pending = 0, confirmed=1, processing=2, closed=3, cancel=4;
        $scope.changeNum=function() {

            $.msg_bre({
                model: 'make.5',
                vanish: false,
                inverse: true,
                make: [
                    {
                        col: 1,
                        tag: 'span',
                        class: '',
                        text:'总数量{{product.count}}'
                    },
                    {
                        col: 2,
                        tag: 'span',
                        class: '',
                        text: '均码'
                    },
                    {
                        col: 2,
                        tag: 'text',
                        class: '',
                        text: ''
                    },
                    {
                        col: 3,
                        tag: 'span',
                        class: '',
                        text: 'S码'
                    },
                    {
                        col: 3,
                        tag: 'text',
                        class: '',
                        text: ''
                    },
                    {col: 4,
                        tag: 'confirm',
                        class: 'btn btn-action',
                        text: '保存'},
                    {col: 4,
                        tag: 'cancel',
                        class: 'btn btn-action',
                        text: '取消'}
                ]
            });
        };

        $scope.order_reset=function() {
            reset();
        };
        var reset=function(){
            $scope.filter_data = {
                'channel': [],
                'collection': [],
                'category': [],
                'gender': [],
                'pre_order': [],
                'min_price': '',
                'max_price': '',
                'product': '',
                'sku': '',
                'name':''
            };
            $scope.pre_order_filter = {
                '0': '',
                '1': ''
            };
            $scope.gender_filter = {
                'all': '',
                'male': '',
                'female': ''
            };

            $scope.col_filter = {};
            angular.forEach($scope.collections, function(i){
                $scope.col_filter[i.title] = '';
            });

            $scope.cate_filter = {};
            angular.forEach($scope.categories, function(i){
                $scope.cate_filter[i.name] = '';
            });
        };
        reset();

        $scope.show = false;
        $scope.choose= function() {
            $scope.show = !$scope.show;
        };

        $scope.filter_products = function(){
            $scope.filter_data.gender = [];
            angular.forEach($scope.gender_filter, function(v, k){
                if(v !== ''){
                    $scope.filter_data.gender.push(v);
                }
            });
            
            $scope.filter_data.pre_order = [];
            angular.forEach($scope.pre_order_filter, function(v, k){
                if(v !== ''){
                    $scope.filter_data.pre_order.push(v);
                }
            });

            $scope.filter_data.collection = [];
            angular.forEach($scope.collections, function(i){
                if($scope.col_filter[i.title] !== ''){
                    $scope.filter_data.collection.push($scope.col_filter[i.title]);
                }
            });

            $scope.filter_data.category = [];
            angular.forEach($scope.categories, function(i){
                if($scope.cate_filter[i.name] !== ''){
                    $scope.filter_data.category.push($scope.cate_filter[i.name]);
                }
            });

            productService.filter_product_list($scope);
        };

        productService.get_product_list($scope);
        productService.get_collections($scope);


//        $http.get(host + "/category/")
//            .success(function(data, status, headers, config){
//                $scope.categories = data;
//                $scope.cate_filter = {};
//                angular.forEach($scope.categories, function(i){
//                    $scope.cate_filter[i.name] = '';
//                });
//            })
//            .error(function(data, status, headers, config){
//                console.log(data);
//            });
    })
.controller("AnnouncementListCtrl",
    function($scope, $http, $location, $routeParams){
        $http.get(host + "/common/message/")
            .success(function(data, status, headers, config){
                $scope.data = data.data;

            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
    });
