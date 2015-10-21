/* ----------------------------------------
   
   MESSAGE_BRE.JS 
   
   Author: PATHEN
   VERSION: 1.1
   		
   ---------------------------------------- */

;(function($,window,document,undefined) {
	
	var MSG_F = function( ele, opt ){
		
		this.$element = ele;
		
		// 基础属性
		this.defaults = {
			
			// 显示文本
			content: 'Success',
			
			/* 工作模式

				1.message
					- 默认模式
					- 显示文本，并在一段时间后消失
					
				2.make.x
					- 创造模式
					- 该模式下可自定义弹出框内的内容，x为行数
				
			*/
			model: 'message'
						
		};
		
		// 高级选项
		this.ex = {
			
			// 绑定元素选择
			dom: 'body',
			
			// 显示一段时间后是否自动消失
			vanish: true,
			
			// 默认样式颜色是否反转
			inverse: false,
			
			// 默认遮罩样式
			// 1.是否启用 2.颜色 3.透明度 4.Z-INDEX
			wrapper: [true,'#ffffff','0.8','900'],
			
			// 标题栏是否启用，标题栏文本
			// title: [false,'Title'],
			
			/* make模式下自定义布局
				使用格式为：
				[ {
					col : 该元素放置在第几行（超过最大行数默认放在最后一行）
					tag：放置的标签，支持的有:
						1. a 链接
						2. text 一个输入框
						3. span 文本
						4. confirm （插件默认的确认按钮，可响应确认事件） 
						5. cancel（插件默认的取消按钮，响应取消事件）
					class：样式名称
					text：元素中内容
					before：text 前置文本
				}, { ... } , { ... }]
			*/
			make: [],
			
			// 弹出框的确认事件和取消事件
			msg_confirm: function(){
				return null;
			},
			msg_cancel: function(){
				return null;
			}
		};
		
		this.options = $.extend({}, this.defaults, this.ex, opt);
	};
	
	MSG_F.prototype = {
		showMessage: function(){
			var $o = this.options;
			if( $('.msg_bre').length ){
				$('.msg_bre').remove();
				$('.msg_bre_wrapper').remove();
			}
			if( $o.wrapper[0] ){
				$('body').prepend('<div class="msg_bre_wrapper" style="width:100%;height:100%;position:fixed;left:0;top:0;background-color:'+$o.wrapper[1]+';opacity:'+$o.wrapper[2]+';z-index:'+$o.wrapper[3]+'"></div>');
			}
			$( $o.dom ).prepend('<div class="msg_bre"></div>');
			var height, $tmp_dom, $dom = $('.msg_bre'), $wrapper = $('.msg_bre_wrapper');
			$dom.css({ 'opacity': '0' });
			var $model = $o.model.split('.');
			switch( $model[0] ){
				case 'make':
					var colnum = parseInt($model[1]) ;
					var ori_htm, htm, i = 1, tmp_colnum = colnum;
					if( colnum ){
						$dom.prepend('<div class="msg_bre_make"></div>');
						$tmp_dom = $('.msg_bre_make');
						for( i = 1; i <= colnum ; i++ ){ $tmp_dom.prepend('<p></p>'); }
						var $tmp_dom_inner = $('.msg_bre_make p');
						colnum = $o.make.length;
						var m_col, m_tag, m_class, m_text, defaults, lastChild;
						for( i = 0; i < colnum ; i++ ){
							htm ='';
							defaults = { col:1,  tag:'span', class:'', text:'', before:'' };
							$.extend( defaults, $o.make[i] );
							switch(defaults.tag){
								case 'a': 
									htm = '<a class="' + defaults.class +'">' + defaults.text + '</a>';
									break;
								case 'span':
									htm = '<span class="' + defaults.class +'">' + defaults.text + '</span>';
									break;
								case 'text':
									htm = defaults.before + '<input type="text" class="' + defaults.class +'" value="' + defaults.text + '">';
									break;
								case 'confirm':
									htm = '<a role="button" class="btn_bre_confirm ' + defaults.class +'">' + defaults.text + '</a>';
									break;
								case 'cancel':
									htm = '<a role="button" class="btn_bre_cancel ' + defaults.class +'">' + defaults.text + '</a>';
									break;
							}
							m_col = parseInt( defaults.col );
							if( m_col > tmp_colnum ){ m_col = tmp_colnum; }
							ori_htm = $tmp_dom_inner.eq( m_col - 1 ).html();
							$tmp_dom_inner.eq( m_col - 1 ).html( ori_htm + htm );
						}
					}
					else{
						$dom.html( '<p>参数设置错误！</p>' );
					}
					height = ( $dom.height() - $tmp_dom.height() )/2;
					$tmp_dom.css({
						'position':'relative',
						'top':height
					});
					break;
				default: 
					$dom.html( '<p>' + $o.content + '</p>' );
					height = ( $dom.height() - $dom.find('p').height() )/2;
					$dom.find('p').css({
						'position':'relative',
						'top':height
					});
					break;
			}
			
			/* 绑定确认和取消事件 */
			if( $('.btn_bre_confirm') ){
				$('.btn_bre_confirm').one('click', function(e){
					$o.msg_confirm();
					$dom.fadeOut();
					$wrapper.fadeOut();
				});
			}
			if( $('.btn_bre_cancel') ){
				$('.btn_bre_cancel').one('click', function(e){
					$o.msg_cancel();
					$dom.fadeOut();
					$wrapper.fadeOut();
				});
			}
			
			/* 初始化弹出框样式并执行 */
			
			// 高度调整
			height = $dom.height();
			height = 0 - height/2;
			$dom.css({ 'margin-top': height+'px' });
			height = height - 25;
			
			// 配色设置
			if( $o.inverse ){
				$dom.css({
					'border-color':'#dcdcdc',
					'background-color':'#fff',
					'box-shadow':'0 0 12px #dcdcdc',
					'color':'#4a4a4a'
				});
			}
			
			// 执行
			$dom.show().animate({
				marginTop: height + 'px',
				opacity: '1'
			},400);
			$wrapper.fadeIn();
			if( $o.vanish ){
				$dom.delay(1000).fadeOut();
				$wrapper.delay(1400).fadeOut();
			}
		}
	};
	
	$.extend({
			msg_bre: function( options ){
				var main = new MSG_F( this, options);
				return main.showMessage();
			}
	});
	
})(jQuery,window,document);

// 加载点击事件，在弹出框外部点击时会关闭窗口
$(document).mouseup(function(e){
	var dom = $('.msg_bre');
	var wrapper = $('.msg_bre_wrapper');
	if( !dom.is(e.target) && dom.has(e.target).length === 0 ){
		dom.fadeOut();
		wrapper.fadeOut();
	}
});