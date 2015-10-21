# 响应式网站实践方法（一） #

 

----------
  &nbsp;&nbsp;现在做网站，不仅要考虑用户，还要考虑他们用的设备。让不同的用户在不同的环境下获得最佳体验，就是响应式网站的目的。
  
  &nbsp;&nbsp;我们观察国内外主流网站，第一个给用户响应式体验的，是它的导航。网站的所有部分都是内容大于形式的（这也正是后端比前端待遇好的的原因吧），先做好内容再做形式。导航内容做法是：
      
      <nav>
      	<ul>
      		<li><a href="#">首页</a></li>
      		<li><a href="#">list1</a></li>
      		<li><a href="#">list2</a></li>
      		<li><a href="#">list3</a></li>
      	</ul>
      </nav>
  &nbsp;&nbsp;做响应式网站首先要考虑小屏幕时的情况，再考虑大屏。
    小屏采用纵向导航，我们给小屏添加形式：
    
  	*{margin:0; padding:0;}  /*所有元素默认无边距*/
    nav ul {list-stytle-type:none;} /*去掉列表前的符号*/
    nav li {border:0.05em solid #f2f2f2;text-align: center;}/*使字体居中*/
    nav li a { text-decoration: none;} /*控制链接样式*/

  &nbsp;&nbsp;大于480px（默认情况等于30em）的大屏采用横向导航，利用css的媒体查询@media给大屏添加形式：

    @media only screen and (min-width: 480px){
        nav ul {overflow: hidden; }/*包住li*/
        nav li {display: block;float:left;width: 6em;height: 4em;}/*横向导航*/
        nav li a { line-height: 4em;} /*a字体居中*/
    }
   
  &nbsp;&nbsp;小屏情况下，往往需要隐藏导航。我们首先做一个三道杠图标：

    <header>
        <div id="list"><span class="btn-list"></span></div>
    </header>
  &nbsp;&nbsp;通过控制btn-list的shadow实现

    .btn-list {
        margin:0.9em 0.1em;
        height: 0.2em;width:1.5em;
        content: "";background-color:lightgreen;display:inline-block;
        box-shadow:0 0.5em 0 lightgreen,0 -0.5em 0 lightgreen;
        }
    header {height:2em}
    header div {float:right;cursor:pointer;text-align：center;height:2em;}
正常情况下，隐藏纵向导航，在三道杠激活时给予显示，

    nav {max-height:0;overflow:hidden;background-color:lightgreen;}
    .active {max-height:6em}
可以利用toggleClass给纵向导航添加一个.active类 ：

    <script type="text/javascript">
        $(document).ready(function(){
            $("#list").click(function(){
                $("nav").toggleClass("active");
            });
        });
    </script>
同时在大屏时隐藏三道杠图标，修改大屏时的css:

    @media only screen and (min-width: 30em){
            nav ul {overflow: hidden; }/*包住li*/
            nav li {display: block;float:left;width: 6em;height: 4em;}/*横向导航*/
            nav li a { line-height: 4em;} /*a字体居中*/
            nav{max-height:none;}
            .btn-list{display: none;}
        }
它们效果如下：

&nbsp;&nbsp;除了这种推出式导航之外，还有抽屉式导航等。类似的你可以控制菜单从左边，右边，下边出现。通过给他们添加样式可以获得更加丰富多彩的效果。
你可以在网上寻找到许多这方便资料，你需要记着，利用toggleClass给激活后的导航项目添加类，是制作导航的关键。

一个漂亮的网站有一个漂亮的导航它就漂亮了一半。做好了导航，就可以制作布局和框架了，同时在整个过程中，都要对用户有深入的研究。如果仅仅作为一个前端，此类的东西貌似应该是设计和产品考虑的事情，但是抱有这种态度明显给人消极怠工的感觉，毕竟总是按照别人的要求去做事情，不是一个有个性的人应该做的事。常常去思考这些问题，才能与他们更好地沟通，对自己也是一种提高。
