app.controller('GlobalCtrl',
    function($scope, $http, $location, $cookieStore, $window,$route,$routeParams, brandService){
        $scope.menubool = false;
        $scope.show_hide_menu = function() {
            $scope.menubool = !$scope.menubool;
            if($scope.menubool){
                $(".menu").animate({"width":"70px"});
                $(".container").animate({"padding-left":"30px"});
            } else{
                $(".menu").animate({"width":"214px"});
                $(".container").animate({"padding-left":"200px"});
            }
        };

        $scope.NewBuyerShow=function(){
            $("#NewBuyer").show();
        };
 
        $scope.newBrand=function(){
            $("#newBrand").show();
        };  

        $scope.hidenewBrand=function(){
            $("#newBrand").hide();
        };

        brandService.init($scope);

        $scope.isActive = function (loca) {
           return (loca === $location.path());
        };

        $scope.isOrderActive = function () {
            return ("/orders_unconfirm" === $location.path()) || ("/orders_underway" === $location.path()) || ("/orders_finish" === $location.path()) || ("/orders_cancel" === $location.path()) || ("/orders_all" === $location.path()) || ("/orders_statistics" === $location.path());
        };
		
        $scope.showMenu2 = function(event){
            var evt = $(event.currentTarget);
            if(!$scope.menubool){
                evt.siblings(".menuson").slideToggle("0.1");
                evt.parent().addClass("activetwo");
            }
        };

		var token = $cookieStore.get('brand');
        if(token){
            brandService.get_profile();
            brandService.get_brand_info();
            brandService.get_brand_list();
        }

        $scope.new_brand = function(){
            var name = $("#NewBd_name").val();
            var create_time = $("#NewBd_time").val();
            var description = $("#NewBd_des").val();
            var post_data = {
                'name': name,
                'create_time': create_time,
                'description': description
            };
            if(name === ''){
                $.msg_bre({content: "品牌名称不能为空"});
                return;
            }
            if(create_time === ''){
                $.msg_bre({content: "成立时间不能为空"});
                return;
            }
            $http.post(host + "/brand/", post_data)
                .success(function(data, status, headers, config){
                    $cookieStore.remove("bpk");
                    $cookieStore.put("bpk", data.id);
                    $("#newBrand").hide();
                    brandService.get_brand_info();
                    brandService.get_brand_list();
                    $location.path("/");
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        $scope.change_brand = function(id){
            $cookieStore.remove("bpk");
            $cookieStore.put("bpk", id);
            brandService.get_brand_info();
            $route.reload();
            $location.path("/");
        };

        $scope.delete_brand = function(numid, numindex){
            $("#DeltBrand").show();
            $scope.numid = numid;
            $scope.numindex = numindex;
        };

        $scope.YDBrand=function(){
            $http.delete(host + "/brand/" + $scope.numid + "/")
             .success(function(data, status, headers, config){
                $scope.g_brand_list.splice($scope.numindex, 1);
                $scope.change_brand($scope.g_brand_list[0].id);
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
            $("#DeltBrand").hide();
        };

        $scope.NDBrand=function(){
            $("#DeltBrand").hide();
        };

		$scope.logout = function(){
		    $http.get(host + "/logout/")
                .success(function(data, status, headers, config){
                    $cookieStore.remove("brand");
                    $cookieStore.remove("bpk");
                    $route.reload();
                    $location.path("/login");
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
		};

		$scope.send_message = function(){
		    var msg = $("#message").val();
		    if(msg === ''){
		        $.msg_bre({content: "不能发送空消息"});
		        return;
		    }
		    var post_data = {
		        'content': msg
		    };
		    $http.post(host + "/suggestion/", post_data)
                .success(function(data, status, headers, config){
                    $.msg_bre({ content: "留言发送成功" });
                    $("#message").val("");
                    $("#chatBox").hide();
                    $("#chatTool").show();
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
		};

        $scope.closeChatTool=function(){
            $scope.chatnum=true;
            $("#chatBox").remove();
            $("#chatTool").remove();
        };

        $scope.showchatBox=function(){
            $("#chatTool").hide();
            $("#chatBox").show();
        };
        $scope.hidechatBox=function(){
            $("#chatBox").hide();
            $("#chatTool").show();
        };

        $scope.showRelaDiv=function(e){
            var rel="<div class='RelaDiv'></div>";
            var con="<span class='tipCont'></span>";
            var tip=$(e.currentTarget).attr("data-tip");
            if(tip){
                $(e.currentTarget).parent().addClass("RelaDiv");
                $(e.currentTarget).before(con);
                $(e.currentTarget).siblings(".tipCont").html(tip);
                $(e.currentTarget).siblings(".tipCont").show();
            }
        };

        $scope.hideRelaDiv=function(e){
            $(e.currentTarget).siblings(".tipCont").remove();
        };

        //获取当前时间
        var myDate = new Date();
        $scope.p = function(time){
            return time <10 ?'0'+time : time;
        };
        $scope.nowTime = myDate.getFullYear()+'-'+$scope.p(myDate.getMonth()+1)+'-'+$scope.p(myDate.getDate());
    })
    .controller('HomeCtrl',
    function($scope, $http, $location, $cookieStore, brandService){
        var token = $cookieStore.get('brand');
        if(token){
            brandService.get_profile();
            brandService.get_brand_info();
            brandService.get_brand_list();
            $http.get(host + "/studio/home/")
                .success(function(data, status, headers, config){
                    $scope.summary = data;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        }

        $scope.cli_a = true;
        $scope.cli_b = false;
        $scope.cli_c = false;
        $scope.cli_d = false;

        $scope.click_a = function(){
            $scope.cli_a = true;
            $scope.cli_b = false;
            $scope.cli_c = false;
            $scope.cli_d = false; 
        };

        $scope.click_b = function(){
            $scope.cli_a = false;
            $scope.cli_b = true;
            $scope.cli_c = false;
            $scope.cli_d = false;
        };

        $scope.click_c = function(){
            $scope.cli_a = false;
            $scope.cli_b = false;
            $scope.cli_c = true;
            $scope.cli_d = false;
        };

        $scope.click_d = function(){
            $scope.cli_a = false;
            $scope.cli_b = false;
            $scope.cli_c = false;
            $scope.cli_d = true;
        };

        $scope.seven_day_bool = true;
        $scope.one_month_bool = false;
        $scope.six_month_bool = false;

        $scope.seven_day = function(){
            $scope.seven_day_bool = true;
            $scope.one_month_bool = false;
            $scope.six_month_bool = false;
        };

         $scope.one_month = function(){
            $scope.seven_day_bool = false;
            $scope.one_month_bool = true;
            $scope.six_month_bool = false;
        };

        $scope.six_month = function(){
            $scope.seven_day_bool = false;
            $scope.one_month_bool = false;
            $scope.six_month_bool = true;
        };

        

       // 首页数据最近7天
        var seven_day = {
            labels : ["10-1","10-2","10-3","10-4","10-5","10-6","10-7","10-8"],
            datasets : [
                {
                    label: "My First dataset",
                    fillColor : "rgba(245, 165, 35, 0.43)",  //填充颜色
                    strokeColor : "#f5a623",  //曲线颜色
                    pointColor : "#f5a623",  //点的颜色
                    pointStrokeColor : "#fff",   //点的边框颜色
                    pointHighlightFill : "#fff",    // 鼠标经过填充颜色
                    pointHighlightStroke : "rgba(220,220,220,1)",  // 鼠标经过边框颜色
                    data : [15000,13000,15000,14000,13000,17000,15000,17000]
                },
            ]
        };
 

        var data_one = document.getElementById("seven_day").getContext("2d");
        window.myLine = new Chart(data_one).Line(seven_day, {
            responsive: true
        });


        // 首页数据最近30天
         var one_month = {
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
                    data : [15000,13000,16000,14000,16000,18000,15000,17000]
                },
            ]
        };

        var data_two = document.getElementById("one_month").getContext("2d");
        window.myLine = new Chart(data_two).Line(one_month, {
            responsive: true
        });

         // 首页数据最近六个月
        var six_month = {
            labels : ["4月","5月","6月","7月","8月","9月","10月","11月"],
            datasets : [
                {
                    label: "My First dataset",
                    fillColor : "rgba(245, 165, 35, 0.43)",  //填充颜色
                    strokeColor : "#f5a623",  //曲线颜色
                    pointColor : "#f5a623",  //点的颜色
                    pointStrokeColor : "#fff",   //点的边框颜色
                    pointHighlightFill : "#fff",    // 鼠标经过填充颜色
                    pointHighlightStroke : "rgba(220,220,220,1)",  // 鼠标经过边框颜色
                    data : [15000,16000,12000,12000,16000,19000,15000,12000]
                },
            ]
        };

        var data_three = document.getElementById("six_month").getContext("2d");
        window.myLine = new Chart(data_three).Line(six_month, {
            responsive: true
        });


        // 圆形数据
        var doughnutData = [
            {
                value: 300,
                color:"#1caf9a",
                highlight: "#1caf9a",
                label: "未确认"
            },
            {
                value: 50,
                color: "#d9534f",
                highlight: "#d9534f",
                label: "进行中"
            },
            {
                value: 100,
                color: "#f5a623",
                highlight: "#f5a623",
                label: "已完成"
            },
            {
                value: 40,
                color: "#1d2939",
                highlight: "#1d2939",
                label: "已作废"
            },
        ];

        var ctxh = document.getElementById("main_canvas_two").getContext("2d");
        window.myDoughnut = new Chart(ctxh).Doughnut(doughnutData, {responsive : true});


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
    })
    .controller('PopupCtrl',
    function($scope, $http, $location, $cookieStore, buyerService){
        $scope.hide_new_buyer = function(){
            $("#NewBuyer").hide();
        };
        $(".distpicker").distpicker({
            province: " —— 所在省 ——",
            city: "—— 所在市 ——",
        });

        $scope.buyer_key = null;

        $scope.buyerFilter = function(buyer){
            return (!$scope.buyer_key) || (buyer.username.indexOf($scope.buyer_key) > -1) || (buyer.company.indexOf($scope.buyer_key) > -1);
        };
    })
    .controller('ForgetPwdCtrl',
    function($scope, $http){
        $scope.send_email = function(){
            var post_data = {
                "username": $scope.email
            };
            $http.post(host + "/studio/forget_pwd/", post_data)
                .success(function(data, status, headers, config){
                    $.msg_bre({ content: "请至邮箱查看邮件" });
                    $scope.avoidClick = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    $scope.avoidClick = false;
                });
        };
        $scope.submitForm = function(isValid){
            if(isValid){
                $scope.avoidClick = true;
                $scope.submitted="true";
                $scope.send_email();
            }
            else{
                $scope.submitted="false";
            }
        };
    })
	.controller('StudioEditCtrl',
    function($scope, $http, cropService, brandService){
        //param: $scope, crop_width, crop_height, url, result_w, result_h, key
        cropService.init($scope, 64, 64, "/studio/update_avatar/", 200, 200, 'avatar');
        $http.get(host + "/studio/")
                .success(function(data, status, headers, config){
                    $scope.studio = data;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        $scope.submitted = false;
        $scope.update_studio = function(m){
            $scope.submitted = true;
            if(m){
                $scope.avoidClick = true;
            $http.put(host + "/studio/", $scope.studio)
                .success(function(data, status, headers, config){
                    brandService.set_username(data.username);
                    $.msg_bre({ content: "信息修改成功" });
                    $scope.avoidClick = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    $scope.avoidClick = false;
                });
            }
        };
    })
	.controller('StudioPwdCtrl',
    function($scope, $http){
        $scope.change_pwd = function(){
            $scope.avoidClick = true;
            if($scope.new_password != $scope.new_password_confirm){
                $.msg_bre({ content: "两次新密码不一致" });
                $scope.avoidClick = false;
                return;
            }
            var post_data = {
                'old_password': $scope.old_password,
                'new_password': $scope.new_password,
                'new_password_confirm': $scope.new_password_confirm
            };
            $http.post(host + "/studio/update_password/", post_data)
                .success(function(data, status, headers, config){
                    $.msg_bre({ content: "密码修改成功" });
                    $scope.avoidClick = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    $scope.avoidClick = false;
                });
        };
    })
	.controller('OutputCtrl',
    function($scope, $http, $cookieStore){
       $('#start').datepicker({dateFormat:"yy-mm-dd"});
       $('#end').datepicker({dateFormat:"yy-mm-dd"});
       $scope.export_order = function(){
            var start = $('#start').val();
            var end = $('#end').val();

            if(start === ''){
                $.msg_bre({ content: "请选择开始时间" });
                return;
            }

            var hiddenElement = document.createElement('a');
            hiddenElement.href = host + "/studio/export/orders/?start=" + start + "&end=" + end + "&token=" +  $cookieStore.get('brand');
            hiddenElement.target = '_blank';
            hiddenElement.download = '订单.xlsx';
            hiddenElement.click();
       };
    })
	.controller('CouponCtrl',
    function($scope, $http){
		$scope.addCoupon = function(){
			$.msg_bre({
				inverse:true,
				vanish:false,

				model:'make.3',
				make:[
					{
						col:1,
						tag:'text',// 生成输入框
						class:'txt discount',
						text:'',
						before:'折扣：'
					},
					{
						col:2,
						tag:'text',// 生成输入框
						class:'txt discount_number',
						text:'',
						before:'数量：'
					},
					{
						col:3,
						tag:'confirm',
						class:'btn btn-com',
						text:'生成优惠券'
					},
					{
						col:3,
						tag:'cancel',
						class:'btn btn-cancel',
						text:'取消'
					}
				],
              msg_confirm: function(){
                $http.post(host + "/studio/coupons/", {
                    "amount": parseInt($(".discount_number").val()),
                    "discount": $(".discount").val(),
                    "last_time": '2015-9-1'
                    })
                    .success(function(data, status, headers, config){
                        $scope.coupons.push.apply($scope.coupons, data.data);
                        $('#check_all').attr('class', cb_check);
                    })
                    .error(function(data, status, headers, config){
                        console.log(data);
                    });
              }
			});
		};
		$scope.couponSelect = function(event, coupon){
			var evt = $(event.currentTarget);
			checkSingle( evt );
			coupon.checked = !coupon.checked;
		};
		$scope.couponSelectAll = function(event){
			var evt = $(event.currentTarget);
			var tar = $('.tb-coupon .icon-check, .tb-coupon .icon-checked');
			checkAll( evt , tar );
			if( evt.attr('class') == cb_check ){
                angular.forEach($scope.coupons, function(i){
                    i.checked = false;
                });
            }else{
                angular.forEach($scope.coupons, function(i){
                    i.checked = true;
                });
            }
		};

		$scope.delete_coupon = function(coupon_id, index){
            var json_data = { 'ids': [coupon_id] };
            $http.put(host + "/studio/coupons/", json_data)
                .success(function(data, status, headers, config){
                    $scope.coupons.splice(index, 1);
                    $('#check_all').attr('class', cb_check);
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        $scope.delete_coupon_list = function(){
            var json_data = { 'ids': [] };
            var index2del = [];
            for(var i=$scope.coupons.length-1; i>=0; i--){
                if($scope.coupons[i].checked){
                    json_data.ids.push($scope.coupons[i].id);
                    index2del.push(i);
                }
            }
            $http.put(host + "/studio/coupons/", json_data)
                .success(function(data, status, headers, config){
                    angular.forEach(index2del, function(i){
                        $scope.coupons.splice(i, 1);
                    });
                    $('#check_all').attr('class', cb_check);
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

		$scope.status = {
		    0: "未使用",
		    1: "已发送",
		    2: "已使用"
		};

		$http.get(host + "/studio/coupons/")
            .success(function(data, status, headers, config){
                $scope.coupons = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
    })
    .controller('CategoryCtrl',
    function($scope, $http){
		$scope.gender = 1;
		$scope.cateSelect = function(event, c, gender){
			var evt = $(event.currentTarget);
			evt.parent('.btng').find('.selected').removeClass('selected');
			evt.addClass('selected');
			c.gender = gender;
		};

		$scope.newCateSelect = function(event, gender){
			var evt = $(event.currentTarget);
			evt.parent('.btng').find('.selected').removeClass('selected');
			evt.addClass('selected');
			$scope.gender = gender;
		};
		
		$scope.saveCate = function(){
			$.msg_bre({
				inverse:true,
				vanish:false,
				
				model:'make.2',
				make:[
					{
						col:1,
						tag:'text',// 生成输入框
						class:'txt',
						text:'test2',
						before:'test:'
					},
					{
						col:2,
						tag:'confirm',
						class:'btn btn-com',
						text:'发送'
					},
					{
						col:2,
						tag:'cancel',
						class:'btn btn-cancel',
						text:'取消'
					}
				],
              msg_confirm: function(){

              }
			});
		};
		
        $http.get(host + "/category/")
            .success(function(data, status, headers, config){
                $scope.categories = data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

        $scope.add_category = function(){
            if(!$scope.category){
                return;
            }
            var post_data = {
                    "name": $scope.category,
                    "gender": $scope.gender
            };
            $http.post(host + "/category/", post_data)
                .success(function(data, status, headers, config){
                    $scope.categories.push(data);
                    $scope.category = "";
					$('.msg-category-success').fadeIn().delay(1000).fadeOut();
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });

        };

        $scope.delete_category = function(i, id){
            $http.delete(host + "/category/" + id + "/")
                 .success(function(data, status, headers, config){
                    $scope.categories.splice(i, 1);
                 })
                 .error(function(data, status, headers, config){
                    console.log(data);
                 });
        };

        $scope.update_category = function(c){
            $http.put(host + "/category/" + c.id + "/", c)
                .success(function(data, status, headers, config){
                    console.log("update ok");
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });

        };
    })
    .controller('CollectionCtrl',
    function($scope, $http){
		
		$scope.saveCollection = function(){
			$.msg_bre({ content:'保存成功！' });
		};

        $http.get(host + "/collection/")
            .success(function(data, status, headers, config){
                $scope.collections = data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

        
        $scope.add_collection = function(){
            var post_data = {
                    "title": $scope.title,
                    "description": $scope.description
            };
            $http.post(host + "/collection/", post_data)
                .success(function(data, status, headers, config){
                    $scope.collections.push(data);
                    $scope.title = "";
                    $scope.description = "";
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });

        };

        $scope.update_collection = function(c){
            $http.put(host + "/collection/" + c.id + "/", c)
                .success(function(data, status, headers, config){
                    $.msg_bre({ content:'保存成功！' });
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });

        };

        $scope.delete_collection = function(i, id){
            $http.delete(host + "/collection/" + id + "/")
                 .success(function(data, status, headers, config){
                    $scope.collections.splice(i, 1);
                 })
                 .error(function(data, status, headers, config){
                    console.log(data);
                 });
        };
		
		$scope.show_detail = function(event){
			var evt = $(event.currentTarget);
			var tar = evt.closest('.table-list').find('.col-detail');
			var state = tar.css('display');
			if( state == 'none'){
				tar.slideDown();
			}
			else{
				tar.slideUp();
			}
		};
    })
    .controller('ProductCtrl',
    function($scope, $http, $routeParams, $location){
        //页面上下滚动
        $(window).scroll(function() {
            if ($(this).scrollTop() > 300 ) {
                $('.scrolltop:hidden').stop(true,true).fadeIn();
            } else {
                $('.scrolltop').stop(true,true).fadeOut();
            }
        });

        $(function(){
            $(".scroll").click(function(){
                $("html,body").animate({scrollTop:$(".container").offset().top
                },"1000");
                return false;
            });
        });
        $http.get(host + "/products/" + $routeParams.product_id + "/")
            .success(function(data, status, headers, config){
                $scope.product = data;
                $scope.tags = data.tags.join(",");
                $scope.product.composition = $scope.product.composition.replace(/\n/g,'<br/>');
                $scope.product.description = $scope.product.description.replace(/\n/g,'<br/>');

                if($scope.product.pre_order){
                    $scope.pre_order = "是";
                }else{
                    $scope.pre_order = "否";
                }
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

//        $http.get(host + "/category/")
//            .success(function(data, status, headers, config){
//                $scope.categories = {};
//                angular.forEach(data, function(i){
//                    $scope.categories[i.id] = i.name;
//                });
//            })
//            .error(function(data, status, headers, config){
//                console.log(data);
//            });

        $scope.edit_product = function(product_id){
             $location.path("/products/" +  product_id + "/edit");
        };

        $scope.delete_product = function(product_id){
             $http.delete(host + "/products/" + product_id + "/")
             .success(function(data, status, headers, config){
                $location.path("/product_manage/");
             })
             .error(function(data, status, headers, config){
                console.log(data);
             });
        };
        //删除确认
        $(function() {
            var targetDiv=$("#delete-product");
            targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".product-info",
                width:"345px",
                resizable: false,
                modal: true,
                closeOnEscape: false,
                buttons:{
                        "删除":function() {
                            $scope.delete_product($scope.product.id);
                            $( this ).dialog( "close" );
                        },
                        "取消":function() {
                            $( this ).dialog( "close" );
                        }
                        },
                close: function () {
                    //dialogOwn.appendTo(dialogParent);
                    $(this).hide();
                }

            });
        });
        $scope.confirm_delete=function(){
            $( "#delete-product" ).dialog("open");
            $('.ui-dialog :button').blur();
        };
    })
    .controller('ProductEditCtrl',
    function($scope, $http, $routeParams, $location, cropService){
        //图片按钮的显示和隐藏
        $(".l-image-upload ,.s-image-upload").hover(function(){
            $(this).find(".icon-delete-button").show(300);
        },function(){
            $(this).find(".icon-delete-button").hide();
        });
        //在线订货的隐藏和显示
        $scope.category_show_hide=function(){
            $scope.product.online_sale=!$scope.product.online_sale;
            $(".checkbox").toggleClass("icon-right");
        };

        $scope.nextdiv_show=function(){
            $(".nextdiv").slideToggle("fast");
        };

        $scope.nextdiv_post=function(v){
            $scope.product.gender = v;
            $(".nextdiv").hide();
        };

        $scope.collshow_hide=function(){
            $(".ccshow").slideToggle("fast");
        };

        $scope.popAdd_show=function(){
            $("#popAddColl").show();
        };

        $scope.popAdd_hide=function(){
            $("#popAddColl").hide();
        };

        $scope.hidePost=function(i){
            $scope.product.collection = i.id;
            $(".ccshow").hide();
        };

        $scope.add_collection = function(){
            var post_data = {
                    "title": $scope.col_title,
                    "description": $scope.col_description
            };
            $http.post(host + "/collection/", post_data)
                .success(function(data, status, headers, config){
                    $scope.collections.push(data);
                    $scope.collections_dict[data.id] = data.title;
                    $scope.col_title = "";
                    $scope.col_description = "";
                    $("#popAddColl").hide();
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    $("#popAddColl").hide();
                });
        };

        $scope.$watch("product", function(newValue, oldValue) {
            if(oldValue){
                $scope.product_changed = true;
            }
         }, true);

       $scope.$on('$locationChangeStart', function(event, next, current) { 
            if($scope.flag){return;}
            if($scope.product_changed === true || $scope.image1 || $scope.image2 || $scope.image3 || $scope.image4 || $scope.image5){
                event.preventDefault();
                $("#dontsave").show();
                $scope.flag = true;
            }
        });

        $scope.backsave=function(){
            $("#dontsave").hide();
            history.back();
        };

        $scope.hidedts=function(){
            $("#dontsave").hide();
             $scope.flag = false;
        };
        

      //最后下单时间控件
        $('.lastbuy-time').datepicker({dateFormat:"yy-mm-dd",minDate: new Date()});
        
        $http.get(host + "/products/" + $routeParams.product_id + "/")
            .success(function(data, status, headers, config){
                $scope.product = data;
                $scope.product.tags = $scope.product.tags.join(",");
                $scope.product.collection = $scope.product.collection.id;
                if($scope.product.online_sale){
                        $(".checkbox").toggleClass("icon-right");
                }
                $scope.product.allow_discount = $scope.product.allow_discount.toString();
                if($scope.product.last_order_time){
                    $scope.product.last_order_time = $scope.product.last_order_time.split("T")[0];
                }
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });


        $http.get(host + "/collection/")
            .success(function(data, status, headers, config){
                $scope.collections = data;
                $scope.collections_dict = {};
                angular.forEach(data, function(i){
                    $scope.collections_dict[i.id] = i.title;
                });
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

//        $http.get(host + "/category/")
//            .success(function(data, status, headers, config){
//                $scope.categories = data;
//            })
//            .error(function(data, status, headers, config){
//                console.log(data);
//            });
//
//
//        $http.get(host + "/ice/category/")
//            .success(function(data, status, headers, config){
//                $scope.ice_categories = data;
//            })
//            .error(function(data, status, headers, config){
//                console.log(data);
//            });

        var update_image = function(i, img, is_primary){
            var product_img = $scope.product.images[i];
            var post_data = {
                "image": img,
                "is_primary": is_primary,
                "product": $scope.product.id
            };
            if(product_img){
                $http.put(host + "/product/images/" + product_img.pk + "/", post_data)
                    .success(function(data, status, headers, config){
                        $scope.product.images[i] = data;
                    })
                    .error(function(data, status, headers, config){
                        console.log(data);
                    });
            }else{
                $http.post(host + "/product/images/", post_data)
                    .success(function(data, status, headers, config){
                        $scope.product.images[i] = data;
                    })
                    .error(function(data, status, headers, config){
                        console.log(data);
                    });
            }
        };

        //param: $scope, crop_width, crop_height, url, result_w, result_h, key
        cropService.init($scope, 120, 120, "", 1000, 1000, "");
        $scope.crop_image = function(){
            cropService.upload_product_image($scope, 1000, 1000);
        };

         $scope.$watch("image2", function(newValue, oldValue) {
            if($scope.product){
                update_image(1, newValue, false);
            }
         });

         $scope.$watch("image3", function(newValue, oldValue) {
            if($scope.product){
                update_image(2, newValue, false);
            }
         });

         $scope.$watch("image4", function(newValue, oldValue) {
            if($scope.product){
                update_image(3, newValue, false);
            }
         });

         $scope.$watch("image5", function(newValue, oldValue) {
            if($scope.product){
                update_image(4, newValue, false);
            }
         });

        $scope.delete_image = function(pk, i){
            $http.delete(host + "/product/images/" + pk + "/")
             .success(function(data, status, headers, config){
                $scope.product.images[i] = null;
             })
             .error(function(data, status, headers, config){
                console.log(data);
             });
        };

//        $scope.add_fare = function(){
//            post_data = {
//                    "product": $scope.product.id,
//                    "destination": $scope.destination,
//                    "fare": $scope.fare,
//                    "cost_time": $scope.cost_time,
//                    "underwriter": $scope.underwriter
//            }
//            $http.post(host + "/product/fares/", post_data)
//                .success(function(data, status, headers, config){
//                    $scope.product.fares.push(data)
//                })
//                .error(function(data, status, headers, config){
//                    console.log(data);
//                });
//
//        }
//
//        $scope.delete_fare = function(i, id){
//            $http.delete(host + "/product/fares/" + id + "/")
//                 .success(function(data, status, headers, config){
//                    $scope.product.fares.splice(i, 1);
//                 })
//                 .error(function(data, status, headers, config){
//                    console.log(data);
//                 });
//        }

//        $scope.add_wholesale_prices = function(){
//            post_data = {
//                    "product": $scope.product.id,
//                    "min_number": $scope.min_number,
//                    "max_number": $scope.max_number,
//                    "price": $scope.wholesale_price
//                };
//            $http.post(host + "/product/wholesale/price/", post_data)
//                .success(function(data, status, headers, config){
//                    $scope.product.wholesale_prices.push(data)
//                })
//                .error(function(data, status, headers, config){
//                    console.log(data);
//                });
//
//        };
//
//        $scope.delete_wholesale_prices = function(i, id){
//            $http.delete(host + "/product/wholesale/price/" + id + "/")
//                 .success(function(data, status, headers, config){
//                    $scope.product.wholesale_prices.splice(i, 1);
//                 })
//                 .error(function(data, status, headers, config){
//                    console.log(data);
//                 });
//        };

        $scope.add_size = function(){
            if($scope.product.sizes.length !== 0 && $scope.product.sizes[$scope.product.sizes.length -1].size === null){
                return;
            }
            var sku = '';
            if($scope.product.sizes.length>=1){
                sku = $scope.product.sizes[$scope.product.sizes.length-1].sku;
            }
            $scope.product.sizes.push({
                "size": "",
                "description": "",
                "sku": sku,
                "barcode": "",
                "retail": 0,
                "wholesale":1
            });
        };

        $scope.delete_size = function(size, i){
            if(size.id){
                size.deleted = true;
            }else{
                $scope.product.sizes.splice(i,1);
            }
        };

        $scope.add_wholesale_prices = function(){
            $scope.product.wholesale_prices.push({
                "min_number": $scope.min_number,
                "max_number": $scope.max_number,
                "price": $scope.price
            });
            $scope.min_number = '';
            $scope.max_number = 0;
            $scope.price = '';
        };
        $scope.delete_wholesale_prices = function(price, i){
            if(price.id){
                price.deleted = true;
            }else{
                $scope.product.wholesale_prices.splice(i, 1);
            }
        };

//        $scope.add_extra = function(){
//            post_data = {
//                        "product": $scope.product.id,
//                        "key": $scope.key,
//                        "description": $scope.description
//                };
//            $http.post(host + "/product/extra/", post_data)
//                .success(function(data, status, headers, config){
//                    $scope.product.extra.push(data)
//                })
//                .error(function(data, status, headers, config){
//                    console.log(data);
//                });
//        };
//
//        $scope.delete_extra = function(i, id){
//            $http.delete(host + "/product/extra/" + id + "/")
//                 .success(function(data, status, headers, config){
//                    $scope.product.extra.splice(i, 1);
//                 })
//                 .error(function(data, status, headers, config){
//                    console.log(data);
//                 });
//        };

        $scope.change_wholesale_size = function(size, event){
            if(size.wholesale === ''){
                size.wholesale = 1;
                $(event.currentTarget).removeClass('normalstyle');
                $(event.currentTarget).addClass('closestyle');
            }else{
                size.wholesale = '';
                $(event.currentTarget).removeClass('closestyle');
                $(event.currentTarget).addClass('normalstyle');
            }
        };
        $scope.update_product = function(product_id,isValid,isValid2){
            $scope.flag = true;
            $scope.avoidClick = true;
            $scope.submitted = true;
            if (isValid && isValid2 || isValid && !isValid2 && !$scope.product.online_sale){
                if(typeof($scope.product.tags) == 'string'){
                    $scope.product.tags = $scope.product.tags.split(/,|，/);
                }
//                if($scope.air_category){
//                    $scope.product.category = [
//                        {
//                            'category': $scope.air_category,
//                            'channel': '1',
//                            'active': $scope.category_show
//                        }
//                    ];
//                }

                var t = $('.lastbuy-time').val();
                if(t){
                     $scope.product.last_order_time = t;
                     if(t.indexOf(" ") === -1){
                        $scope.product.last_order_time += " 00:00:00";
                     }
                }
                if($scope.product.last_order_time === ''){
                    $scope.product.last_order_time = null;
                }
                if($scope.product.wholesale_price === undefined){
                    $scope.product.wholesale_price = null;
                }
                $http.put(host + "/products/" + product_id + "/", $scope.product)
                    .success(function(data, status, headers, config){
                        $location.path("/products/" + product_id);
                        
                    })
                    .error(function(data, status, headers, config){
                        console.log(data);
                        $scope.avoidClick = false;
                    });
            }
            else if(!isValid){
                $("html,body").animate({scrollTop:$("#newProductForm").offset().top-80},"800");
                $scope.avoidClick = false;
            }
            else if (!isValid2 && $scope.product.online_sale){
                $("html,body").animate({scrollTop:$("#newProductForm2").offset().top-80},"500");
                $scope.avoidClick = false;
            }
        };
    })
    .controller("NewProductCtrl",
    function($scope, $http, $location, $timeout, cropService, checkService){
        
        //在线订货的隐藏和显示
        $scope.category_show_hide=function(){
            $scope.product.online_sale=!$scope.product.online_sale;
            $(".checkbox").toggleClass("icon-right");
        };
        //最后下单时间控件
        $('.lastbuy-time').datepicker({dateFormat:"yy-mm-dd",minDate: new Date()});

        $scope.ice_category = '';
        $scope.online_category = '';
        $scope.air_category = '';
        $scope.product = {
            'name': '',
            'gender': '',
            'catagory': '',
            'color': '',
            'price': '',
            'online_sale': false,
            'model_height': 0,
            'model_weight': 0,
            'collection': '',
            'composition': '',
            'weight': 0,
            'pre_order': false,
            'pre_order_number': 0,
            'last_order_time': null,
            'delivery': '',
            'payment_term': 0,
            'return_term': 'TODO',
            'description': '',
            'category': [],
            'images': [],
            'sizes': [],
            'tags': ''
        };

        //param: $scope, crop_width, crop_height, url, result_w, result_h, key
        cropService.init($scope, 250, 250, "", 1000, 1000, "");

        $scope.crop_image = function(){
            cropService.crop_image($scope, 1000, 1000);
            console.log($scope.image1);
        };


        $scope.nextdiv_show=function(){
            $(".nextdiv").slideToggle("fast");
        };

        $scope.nextdiv_post=function(v){
            $scope.product.gender = v;
            $(".nextdiv").hide();
        };

        $scope.collshow_hide=function(){
            $(".ccshow").slideToggle("fast");
        };

        $scope.popAdd_show=function(){
            $("#popAddColl").show();
        };

        $scope.popAdd_hide=function(){
            $("#popAddColl").hide();
        };

        $scope.hidePost=function(i){
            $scope.product.collection = i.id;
            $(".ccshow").hide();
        };

        $scope.$watch("product", function(newValue, oldValue) {
            if(newValue!=oldValue){
                $scope.product_changed = true;
            }
        }, true);

        $scope.$on('$locationChangeStart', function(event, next, current) { 
            if($scope.product_changed === true || $scope.image1 || $scope.image2 || $scope.image3 || $scope.image4 || $scope.image5){
                event.preventDefault();
                $("#dontsave").show();
            }
        });

        $scope.backsaveT=function(){
            $scope.product_changed = false;
            $scope.image1 = $scope.image2 = $scope.image3 = $scope.image4 = $scope.image5 = null;
            $("#dontsave").hide();
            history.back();
        };

        $scope.hidedtsT=function(){
            $("#dontsave").hide();
        };

        $http.get(host + "/collection/")
            .success(function(data, status, headers, config){
                $scope.collections = data;
                $scope.collections_dict = {};
                angular.forEach(data, function(i){
                    $scope.collections_dict[i.id] = i.title;
                });
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });



//        $http.get(host + "/category/")
//            .success(function(data, status, headers, config){
//                $scope.categories = data;
//            })
//            .error(function(data, status, headers, config){
//                console.log(data);
//            });


//        $http.get(host + "/ice/category/")
//            .success(function(data, status, headers, config){
//                $scope.ice_categories = data;
//            })
//            .error(function(data, status, headers, config){
//                console.log(data);
//            });


        $scope.add_wholesale_prices = function(){
            $scope.product.wholesale_prices.push({
                "min_number": $scope.min_number,
                "max_number": $scope.max_number,
                "price": $scope.wholesale_price
            });
        };

        $scope.delete_wholesale_prices = function(i){
            $scope.product.wholesale_prices.splice(i, 1);
        };

        $scope.add_size = function(){
            if($scope.product.sizes.length !== 0 && $scope.product.sizes[$scope.product.sizes.length -1].size === null){
                return;
            }
            var sku = '';
            if($scope.product.sizes.length>=1){
                sku = $scope.product.sizes[$scope.product.sizes.length-1].sku;
            }
            $scope.product.sizes.push({
                "size": null,
                "description": '',
                "sku": sku,
                "barcode": '',
                "retail": 0,
                "wholesale": 1
            });
        };

        $scope.delete_size = function(i){
            $scope.product.sizes.splice(i, 1);
        };

        $scope.change_wholesale_size = function(size, event){
            if(size.wholesale === ''){
                size.wholesale = 1;
                $(event.currentTarget).removeClass('normalstyle');
                $(event.currentTarget).addClass('closestyle');
            }else{
                size.wholesale = '';
                $(event.currentTarget).removeClass('closestyle');
                $(event.currentTarget).addClass('normalstyle');
            }
        };

        $scope.add_extra = function(){
            $scope.product.extra.push({
                "key": $scope.key,
                "description": $scope.description
            });
        };

        $scope.delete_extra = function(i){
            $scope.product.extra.splice(i, 1);
        };

        $scope.add_collection = function(){
            var post_data = {
                    "title": $scope.col_title,
                    "description": $scope.col_description
            };
            $http.post(host + "/collection/", post_data)
                .success(function(data, status, headers, config){
                    $scope.collections.push(data);
                    $scope.collections_dict[data.id] = data.title;
                    $scope.col_title = "";
                    $scope.col_description = "";
                    $("#popAddColl").hide();
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    $("#popAddColl").hide();
                });
        };

        $scope.new_product = function(e, isValid,isValid2) {
            if($scope.image1 === null || $scope.image1 === undefined ){
                $("html,body").animate({scrollTop:$("#newProductForm").offset().top-500},"900");
                $.msg_bre({ content:'请选择商品大图' });
                return;
            }

            $scope.submitted = true;

            if (isValid &&// product basic info valid &&
                 (isValid2 || (!isValid2 && !$scope.product.online_sale)) // online form valid
                ) {
                if(!checkService.checkUsable($(e.currentTarget))){
                    return;
                }
                if (typeof($scope.product.tags) == 'string') {
                    $scope.product.tags = $scope.product.tags.split(/,|，/);
                }
                $scope.product.images = [
                    $scope.image1,
                    $scope.image2,
                    $scope.image3,
                    $scope.image4,
                    $scope.image5
                ];
//                $scope.product.category = [
//                {
//                        'category': $scope.air_category,
//                        'channel': '1',
//                        'active': $scope.category_show
//                }
//                ];

                var t = $('.lastbuy-time').val();
                if (t) {
                    $scope.product.last_order_time = t;
                    if (t.indexOf(" ") === -1) {
                        $scope.product.last_order_time += " 00:00:00";
                    }
                }

                if($scope.product.wholesale_price === undefined){
                    $scope.product.wholesale_price = null;
                }

                $http.post(host + "/products/", $scope.product)
                    .success(function (data, status, headers, config) {
                        $scope.product_changed = false;
                        $scope.image1 = $scope.image2 = $scope.image3 = $scope.image4 = $scope.image5 = null;
                        $location.path("/products/" + data);
                    })
                    .error(function (data, status, headers, config) {
                        console.log(data);
                        checkService.doAfterAction($(e.currentTarget));
                    });
            }
            else if(!isValid){
                $("html,body").animate({scrollTop:$("#newProductForm").offset().top-80},"800");
            }
            else if (!isValid2 && $scope.product.online_sale){
                $("html,body").animate({scrollTop:$("#newProductForm2").offset().top-80},"500");
            }
        };
    })
    .controller("LoginCtrl",
    function($scope, $http, $cookieStore, $location){
        $scope.login = function(){
            $http.post(host + "/login/", {
                "username": $scope.username,
                "password": $scope.password
            })
            .success(function(data, status, headers, config){
                $cookieStore.put("brand", data.token);
                $cookieStore.put("bpk", data.bpk);
                $location.path("/");
            })
            .error(function(data, status, headers, config){
                console.log(data);
                $scope.avoidClick = false;
            });
        };
        //登录验证
        $scope.submitForm = function(isValid){
            if(isValid){
                $scope.avoidClick = true;
                $scope.submitted="true";
                $scope.login();
            }
            else{
                $scope.submitted="false";
            }
        };
    })
    .controller("RegisterCtrl",
    function($scope, $http, $location, sharedProperties){
        //注册验证
        $scope.username = "";
        $scope.password = "";
        $scope.password_confirm = "";
        $scope.submitForm = function(isValid){
            if(isValid){
                $scope.submitted="true";
                if($scope.password == $scope.password_confirm){
                    $scope.register();
                    $scope.avoidClick = true;
                }
            }
            else{
                $scope.submitted="false";
            }
        };
        $scope.register = function(){
                $http.post(host + "/studio/register/", {
                    "username": $scope.username,
                    "email": $scope.username,
                    "password": $scope.password
                })
                    .success(function (data, status, headers, config) {
                        sharedProperties.set_email($scope.username);
                        $location.path("/register_success");
                    })
                    .error(function (data, status, headers, config) {
                        console.log(data);
                        $scope.avoidClick = false;
                    });
            
        };

    })
    .controller("RegisterSuccessCtrl",
    function($scope, $http, $location, $interval, sharedProperties){
        
      //goto email company
      $scope.email = sharedProperties.get_email();
      var emailCompany={
                'qq.com': 'http://mail.qq.com',
                'gmail.com': 'http://mail.google.com',
                'sina.com': 'http://mail.sina.com.cn',
                '163.com': 'http://mail.163.com',
                '126.com': 'http://mail.126.com',
                'yeah.net': 'http://www.yeah.net/',
                'sohu.com': 'http://mail.sohu.com/',
                'tom.com': 'http://mail.tom.com/',
                'sogou.com': 'http://mail.sogou.com/',
                '139.com': 'http://mail.10086.cn/',
                'hotmail.com': 'http://www.hotmail.com',
                'live.com': 'http://login.live.com/',
                'live.cn': 'http://login.live.cn/',
                'live.com.cn': 'http://login.live.com.cn',
                '189.com': 'http://webmail16.189.cn/webmail/',
                'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
                'yahoo.cn': 'http://mail.cn.yahoo.com/',
                'eyou.com': 'http://www.eyou.com/',
                '21cn.com': 'http://mail.21cn.com/',
                '188.com': 'http://www.188.com/',
                'foxmail.coom': 'http://www.foxmail.com'
      };
      $scope.gotoEmailCom= function(){
                var url = $scope.email.split('@')[1];
                for (var i in emailCompany){
                        $('.activateEmail').attr("href",emailCompany[url]);
                }
         };
      $scope.gotoEmailCom();
      $scope.waitTime= true;
      $scope.countDown = function(){
            $scope.secClock = function(){
                if($scope.m>0){
                    $scope.m--; 
                }
                else{
                    $scope.waitTime= true;
                    $interval.cancel($scope.clock);
                    return false;
                }
            };
           $scope.clock = $interval($scope.secClock,1000);
      };
      $scope.avoidClick = false;   
      $scope.resend_activate = function(){
          $scope.avoidClick = true;   
          $http.post(host + "/studio/resend_code/", {
            "email": sharedProperties.get_email()
           })
            .success(function(data, status, headers, config){
                $scope.uese=data.data;
                $.msg_bre({content:'邮件发送成功!'});
                $scope.avoidClick = false;  
                $scope.waitTime= false;
                $scope.m = 60;
                $scope.countDown();
            })
            .error(function(data, status, headers, config){
                $scope.avoidClick = false;     
                console.log(data);
            });
            return false;
      };
    })
    .controller("StatisticCtrl",
    function($scope, $http, $location, $routeParams){
    })
    .controller("ActivateCtrl",
    function($scope, $http, $location, $routeParams){
        $http.post(host + "/studio/auth_activate/", {
            'code': $routeParams.code
            })
            .success(function(data, status, headers, config){
                $scope.id = data.id;
            })
            .error(function(data, status, headers, config){
                  $location.path("/register");
            });

        $scope.update_data = function(formValid){
            $scope.submitted = true;
            if(formValid){
                
                $scope.avoidClick = true;
                $http.put(host + "/studio/auth_activate/", {
                "id": $scope.id,
                "name": $scope.name,
                "description": $scope.description,
                "username": $scope.username,
                "phone": $scope.phone,
                "create_time": $scope.create_time
                })
                .success(function(data, status, headers, config){
                    $location.path("/login");
                    $scope.avoidClick = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    $scope.avoidClick = false;
                });
        }
        };

    })
    .controller("ResetPwdCtrl",
    function($scope, $http, $location, $routeParams){

        $scope.reset_pwd = function(){
            if($scope.new_password_confirm != $scope.new_password){
                $.msg_bre({ content: "两次新密码不一致" });
                return;
            }
            $http.post(host + "/studio/reset_pwd/", {
                "code": $routeParams.code,
                "new_password": $scope.new_password
                })
                .success(function(data, status, headers, config){
                    $location.path("/login");
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

    })
    .controller("StudioCtrl",
    function($scope, $http, $location, $routeParams){
        $http.get(host + "/studio/")
            .success(function(data, status, headers, config){
                $scope.studio = data;
                $scope.studio.avatar = host + "/static/" + $scope.studio.avatar;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

        $scope.edit_studio = function(studio_id){
             $location.path("/studio/" +  studio_id + "/edit");
        };

    })
    .controller("BrandCtrl",
    function($scope, $http, $location, $cookieStore, $routeParams, cropService, brandService){
        cropService.init($scope, 300, 65, "", 300, 65, "");
        $scope.cur_brand_id = $routeParams.brand_id;
        $scope.crop_image = function(){
            cropService.upload_brand_image($scope, 300, 65, $routeParams.brand_id);
        };
        $http.get(host + "/brand/" + $routeParams.brand_id + "/")
            .success(function(data, status, headers, config){
                $scope.brand = data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
		$scope.updateBrand = function(){
            $scope.avoidClick = true;
            $http.put(host + "/brand/" +  $routeParams.brand_id + "/", $scope.brand)
                .success(function(data, status, headers, config){
                    $.msg_bre({ content:'保存成功！' });
                    $scope.avoidClick = false;
                })
                .error(function(data, status, headers, config){
                    $.msg_bre({ content: data });
                    $scope.avoidClick = false;
                });
		};
    })
    .controller("StylistCtrl",
    function($scope, $http, $location, $routeParams, cropService){
        $scope.cur_brand_id = $routeParams.brand_id;
        $http.get(host + "/brand/designer/")
            .success(function(data, status, headers, config){
                $scope.stylist = data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

        $scope.new_stylist = function(){
            var json_data = { 'name': $scope.name,
                              'summary': $scope.summary,
                               'brand': $routeParams.brand_id
                             };
            $http.post(host + "/brand/designer/", json_data)
                .success(function(data, status, headers, config){
                    $scope.stylist.push(data);
                    $scope.name = "";
                    $scope.summary = "";
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        $scope.delete_stylist = function(i, id){
            $http.delete(host + "/brand/designer/" + id + "/")
                 .success(function(data, status, headers, config){
                    $scope.stylist.splice(i, 1);
                 })
                 .error(function(data, status, headers, config){
                    console.log(data);
                 });
        };

        $scope.update_stylist = function(d){
            $http.put(host + "/brand/designer/" + d.id + "/", d)
                .success(function(data, status, headers, config){
                    $.msg_bre({ content:'保存成功！' });
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

    })
    .controller("CodeCtrl",
    function($scope, $http, $location, $route){
		$scope.addCode = function(){
			$.msg_bre({
				inverse:true,
				vanish:false,
				model:'make.2',
				make:[
					{
						col:1,
						tag:'text',// 生成输入框
						class:'txt code_num',
						before:'生成的数量：'
					},
					{
						col:2,
						tag:'confirm',
						class:'btn btn-com',
						text:'生成'
					},
					{
						col:2,
						tag:'cancel',
						class:'btn btn-cancel',
						text:'取消'
					}
				],
              msg_confirm: function(){
                $http.post(host + "/studio/code/", {
                    "num": parseInt($(".code_num").val())
                    })
                    .success(function(data, status, headers, config){
                        $scope.code_list.push.apply($scope.code_list, data.data);
                        $('#check_all').attr('class', cb_check);
                    })
                    .error(function(data, status, headers, config){
                        console.log(data);
                    });
              }
			});
		};

        $scope.delete_code = function(code_id, index){
            var json_data = { 'ids': [code_id] };
            $http.put(host + "/studio/code/", json_data)
                .success(function(data, status, headers, config){
                    $scope.code_list.splice(index, 1);
                    $('#check_all').attr('class', cb_check);
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        $scope.delete_code_list = function(){
            var json_data = { 'ids': [] };
            var index2del = [];
            for(var i=$scope.code_list.length-1; i>=0; i--){
                if($scope.code_list[i].checked){
                    json_data.ids.push($scope.code_list[i].id);
                    index2del.push(i);
                }
            }
            $http.put(host + "/studio/code/", json_data)
                .success(function(data, status, headers, config){
                    angular.forEach(index2del, function(i){
                        $scope.code_list.splice(i, 1);
                    });
                    $('#check_all').attr('class', cb_check);
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        $scope.code_status = {
            false: '未使用',
            true: '已使用'
        };

        $http.get(host + "/studio/code/")
            .success(function(data, status, headers, config){
                $scope.code_list = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        $scope.codeSelect = function(event, code){
            var evt = $(event.currentTarget);
            checkSingle( evt );
            code.checked = !code.checked;
        };
        $scope.codeSelectAll = function(event){
            var evt = $(event.currentTarget);
            var tar = $('.tb-code .icon-check, .tb-code .icon-checked');
            checkAll( evt , tar );
            if( evt.attr('class') == cb_check ){
                angular.forEach($scope.code_list, function(i){
                    i.checked = false;
                });
            }else{
                angular.forEach($scope.code_list, function(i){
                    i.checked = true;
                });
            }
        };		
    })
    .controller("BuyerListCtrl",
    function($scope, $http, $location, $route, buyerService){
        //排序
        $scope.order_by = 'index';
        $scope.reverse = true;
        $scope.order = function(order_by){
            $scope.reverse = ($scope.order_by === order_by)?!$scope.reverse:false;
            $scope.order_by = order_by;
        }; 

        $scope.filter_reset=function() {
            reset();
        };
        var reset=function(){
            $scope.status = {
                'unverified':'',
                'verified': ''
            };

            $scope.price_type = {
                'retail_based':'',
                'wholesale_based': ''
            };

            $scope.filter_data = {
                'company': "",
                'username': "",
                'email': "",
                'phone': "",
                'city': "",
                'status': [],
                'price_type': []
            };
        };
        reset();
        $scope.category_show=false;
        $scope.category_show_hide=function(){
            $scope.category_show=!$scope.category_show;
            $(".checkbox").toggleClass("icon-right");
        };

        $scope.delete_buyers = function(){
            json_data = { 'ids': [] };
            index2del = [];
            for(var i=$scope.buyer_list.length-1; i>=0; i--){
                if($scope.buyer_list[i].checked){
                    json_data.ids.push($scope.buyer_list[i].id);
                    index2del.push(i);
                }
            }
            $http.put(host + "/studio/group/", json_data)
                .success(function(data, status, headers, config){
                    angular.forEach(index2del, function(i){
                        $scope.buyer_list.splice(i, 1);
                    });
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        $scope.filter_buyer = function(){
            $scope.avoidClick = true;
            $scope.filter_data.price_type = [];
            angular.forEach($scope.price_type, function(v, k){
                if(v !== ''){
                    $scope.filter_data.price_type.push(v);
                }

            });
            $scope.filter_data.status = [];
            angular.forEach($scope.status, function(v, k){
                if(v !== ''){
                    $scope.filter_data.status.push(v);
                }

            });
            buyerService.filter_buyer($scope);
        };
        //删除弹窗
        var delDialog = function(buyer,i,userName) {
            var targetDiv = $("#unverify"+buyer);
                targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".wrapper",
                width:"345px",
                resizable: false,
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.unverify(buyer,i,userName);
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
        $scope.del_buyer=function(buyer,i,userName){
            $(delDialog(buyer,i,userName));
            $( "#unverify"+buyer).dialog("open");
            $('.ui-dialog :button').blur();
        };
        $scope.unverify = function(buyer,i,userName){
            $http.delete(host + "/studio/group/" +buyer + "/")
                .success(function(data, status, headers, config){
                    $scope.buyer_list.splice(i,1);
                    $.msg_bre({ content: "删除成功" });

                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
        //不接受
        $scope.refuse = function(buyer,i,userName){
            $http.delete(host + "/studio/group/" +buyer.id + "/")
                .success(function(data, status, headers, config){
                    $scope.buyer_list.splice(i,1);
                    $.msg_bre({ content: "未接受关联" });

                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
        //接受
        $scope.verify = function(buyer,userName){
            buyer.status = 1;
            $http.put(host + "/studio/group/" + buyer.id + "/", buyer)
                .success(function(data, status, headers, config){
                    buyer.status = 1;
                    $.msg_bre({ content: "您已与"+userName + "关联" });
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        buyerService.get_buyer_list($scope);

    })
    .controller("BuyerDetailCtrl",
    function($scope, $http, $location, $routeParams){
        $scope.show_detail = false;
        $http.get(host + "/studio/group/" + $routeParams.buyer_id + "/")
            .success(function(data, status, headers, config){
                $scope.buyer = data;
                $scope.show_detail = !$scope.buyer.create_by_brand;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        //接受弹窗
        var accDialog = function() {
            var targetDiv = $("#confirmAccept");
                targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".wrapper",
                width:"345px",
                resizable: false,
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.verify();
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
        $scope.confirmAccept=function(){
            $(accDialog());
            $( "#confirmAccept").dialog("open");
            $('.ui-dialog :button').blur();
        };
        //不接受弹窗
        var refDialog = function() {
            var targetDiv = $("#confirmRefuse");
                targetDiv.dialog({
                dialogClass: "no-close",
                autoOpen:false,
                appendTo:".wrapper",
                width:"345px",
                resizable: false,
                modal: true,
                buttons:{
                        "确认":function() {
                            $scope.unverify();
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
        $scope.confirmRefuse=function(){
            $(refDialog());
            $( "#confirmRefuse").dialog("open");
            $('.ui-dialog :button').blur();
        };   
        $scope.verify = function(){
            $scope.buyer.status = 1;
            $http.put(host + "/studio/group/" + $scope.buyer.id + "/", $scope.buyer)
                .success(function(data, status, headers, config){
                    $scope.buyer = data;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
        $scope.update = function(){
            $scope.avoidClick = true;
            $scope.buyer.status = 1;
            $http.put(host + "/studio/group/" + $scope.buyer.id + "/", $scope.buyer)
                .success(function(data, status, headers, config){
                    $scope.buyer = data;
                    $.msg_bre({ content: "保存成功！" });
                    $scope.avoidClick = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    $scope.avoidClick = false;
                });
        };

        $scope.unverify = function(){
            $http.delete(host + "/studio/group/" + $scope.buyer.id + "/")
                .success(function(data, status, headers, config){
                    $location.path('/buyer_list');
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        $scope.editbuyer = false; //切换按钮和显示编辑框
        $scope.Edit_Buyer = function(){
            $scope.editbuyer = true;
            $(".distpicker").distpicker({
                         province: $scope.buyer.province,
                         city: $scope.buyer.city,
                     });
        };

        $scope.price_type = {
            '0': "以零售价为基准",
            '1': "以打折价为基准"
        };

        $scope.Save_Buyer = function(){
            $scope.editbuyer = false; //切换按钮和显示编辑框
            $scope.avoidClick = true;
            $scope.buyer.province = $("#Edit_province").val();
            $scope.buyer.city = $("#Edit_city").val();
            var company = $("#Edit_company").val();
            var username = $("#Edit_username").val();
            var email = $("#Edit_email").val();
            var phone = $("#Edit_phone").val();
            var province = $("#Edit_province").val();
            var city = $("#Edit_city").val();
            var address = $("#Edit_address").val();
            var price_type = $("#Edit_price_type").val();
            var discount = $("#Edit_discount").val();
            var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(company==''){
                $.msg_bre({ content:'请输入买手店名！' });
                $scope.editbuyer = true; 
                return;
            }
            if(username==''){
                $.msg_bre({ content:'请输入买手姓名！' });
                $scope.editbuyer = true; 
                return;
            }
            if(price_type==''){
                $.msg_bre({ content:'请输入价格方式！' });
                $scope.editbuyer = true; 
                return;
            }
            if(discount==''){
                $.msg_bre({ content:'请输入折扣！' });
                $scope.editbuyer = true; 
                return;
            }
            if (!filter.test(email)) {
                $.msg_bre({ content:'您的电子邮件格式不正确' });
                $scope.editbuyer = true; 
                return;
            }

            $http.put(host + "/studio/buyer/" + $scope.buyer.pk + "/", $scope.buyer)
                .success(function(data, status, headers, config){
                    $scope.buyer = data;
                    $.msg_bre({ content: "保存成功！" });
                    $scope.avoidClick = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    $scope.avoidClick = false;
                });
        };

        $scope.Delete_Buyer = function(){
            $scope.unverify();
        };
    })
    .controller("AnnouncementDetailCtrl",
    function($scope, $http, $location, $routeParams){
        $http.get(host + "/common/announce/" + $routeParams.id + "/")
            .success(function(data, status, headers, config){
                $scope.announcement = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });

    })
    .controller("MessagesCtrl",
    function($scope, $http, $location, $routeParams){
        $http.get(host + "/common/message/?type=1")
            .success(function(data, status, headers, config){
                $scope.data = data.data;
            })
            .error(function(data, status, headers, config){
                console.log(data);
            });
        
        var scrollWin = function(){
            var DIV = $(".user-say-body-container");
            DIV.animate({scrollTop :10000},10);
        };
        
        $scope.mark_read = function(id){
            var post_data = {
                    "pk": id
            };
            $http.put(host + "/common/noreadmessage/", post_data)
                .success(function(data, status, headers, config){
                    $scope.data.unread -= data.number;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };

        $scope.trigger_reply = function(m){
            m.show_reply = !m.show_reply;
            $(".user-say").show();
            scrollWin();//聊天框滑到底
            if(m.show_reply){
                $scope.mark_read(m.id);
                $(".user-say").hide();
            }
        };
        $scope.send_message = function(m){
            $scope.avoidClick = true;
            if(m.reply === undefined || m.reply === ''){
                $.msg_bre({ content: "不能发送空内容" });
                $scope.avoidClick = false;
                return;
            }
            var post_data = {
                "type": m.type,
                "pk": m.id,
                "receiver": m.sender_id,
                "message": m.reply
            };
            $http.post(host + "/common/message/", post_data)
                .success(function(data, status, headers, config){
                    m.reply = '';
                    m.message.push(data.data);
                    scrollWin();//聊天框滑到底
                    $scope.avoidClick = false;
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                    $scope.avoidClick = false;
                });
        };

        $scope.new_message = function(){
            var post_data = {
                    "content": $scope.message
            };
            $http.post(host + "/common/noreadmessage/", post_data)
                .success(function(data, status, headers, config){
                    $scope.categories.push(data);
                })
                .error(function(data, status, headers, config){
                    console.log(data);
                });
        };
});