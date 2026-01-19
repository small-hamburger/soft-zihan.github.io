# CSS

## 基础

### 为什么要初始化CSS样式

1. **`消除浏览器之间的差异，提高兼容性`**
2. **`提高代码质量`**

**第一点：**

未初始化时，当我们添加进去一个DIV，会发现他并不是紧贴着窗口的，而是有一定的距离的。这就是一个例子，在不同的浏览器中，对一些标签是具有的默认值的，而且不同的浏览器默认值也肯是不一样的。如果没有对其 CSS样式做初始化，就可能导致在不同的浏览器之间展示的效果是不一样的。

**第二点：**

初始化后，便于我们对代码的统一管理，减少重复样式等。同时修改的时候便于统一管理。

### HTML页面中 id 和 class 有什么区别

1. 在css样式表中书写时，id选择符前缀应加"#“，class选择符前缀应加”."
2. id属性在一个页面中书写时只能使用一次，而class可以反复使用
3. id作为元素标签用于区分不同结构和内容，而class作为一个样式，可以应用到任何结构和内容当中去
4. 布局上的一般原则：id先确定结构和内容再为它定义样式。而class正好相反，是先定义样式，然后在页面中根据不同需求把样式应用到不同结构和内容上
5. 目前浏览器都允许同一个页面出现多个相同属性值的id，一般情况能正常显示，不过当javascript通过id来控制元素时就会出错
6. 在实际应用中，class常被用到文字版块和页面修饰上，而id多被用在宏伟布局和设计包含块，或包含框的样式。

### 伪元素和伪类

(:)用于伪类，(::)用于伪元素。

::before以一个子元素存在，定义的一个伪元素，只存在页面中。

 **伪元素** ：对选择元素**的指定部分**进行修改样式，常见的有 :before，:after，:first-line，first-letter 等等

 **伪类** ：对选择元素的**特殊状态**进行修改样式，常见的有 :hover，:active，:checked，:focus，:first-child 等等

### 单位

px % em 这几个单位，可以适用于大部分项目开发，且拥有较好兼容性

* **px** ： 一个固定像素单位，一个像素表示终端屏幕能显示的最小的区域
* % ：元素的宽高可随浏览器的变化而变化，实现响应式，一般子元素的百分比相对于直接父元素
* **em** ： 作为 font-size 的单位时，代表父元素的字体大小按比例计算值，作为其他属性单位时，代表相对自身字体大小按比例计算值

<pre><div><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="rounded p-1 text-2xl hover:bg-gray-200" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg><code class="language-css hljs" node="[object Object]" data-highlighted="yes">.parent {
font-size:32px;
}
/** child字体为16px **/
.child {
font-size:.5em;
width:2em;
/* 32 * 0.5 * 2 */}}

</code></div></pre>

* **rem** ： CSS3新增。相对于根元素字体大小按比例计算值；作用于根元素字体大小时，相对于其出初始字体大小（16px）

<pre><div><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="rounded p-1 text-2xl hover:bg-gray-200" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg><code class="language-css hljs" node="[object Object]" data-highlighted="yes">html {
font-size:20px;
}
/* 作用于非根元素，相对于根元素字体大小，所以为40px */
p {
font-size:2rem;
}
</code></div></pre>

* **vw** 相对于视图窗口宽度，视窗宽度为100vw
* **vh** 相对于视图窗口高度，视窗高度为100vh
* **vm**
* **rpx**

rpx是微信小程序独有的，解决屏幕自适应的尺寸单位

**responsive pixel（动态像素）**

**可以根据屏幕宽度进行自适应，无论屏幕大小，规定屏幕宽度为750rpx**

通过rpx设置元素和字体大小，可实现小程序在不同尺寸的屏幕上自动适配

rpx和px的换算

> iPhone6的屏幕宽度为375px，有750个物理像素，则750rpx=375px=750个物理像素

1px=2rpx

### block，inline，inline-block

 **块级元素** ：自动占据一行，可以设置宽高

常见的有 div，p，h1-h6，ul，li，form，table

 **行内元素** ：占据一行的一小部分，多个行内元素水平排版，无法设置宽高

常见的有 span ，img，a

 **行内块级元素** ：跟行内元素类似，不过可以设置宽高

常见的有 button ，img ， input, select, label，textarea

 **空元素** :img,br,input,link,meta

### link标签的伪类和用法

<pre><div><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="rounded p-1 text-2xl hover:bg-gray-200" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg><code class="language-css hljs" node="[object Object]" data-highlighted="yes"><div id="content">

  <h3>

   <a class="a1" href="#">

    a标签伪类link，hover，active，visited，focus区别

   </a>

 </h3>

</div> 

<style>

a.a1:link{  /*链接未被访问时的状态*/

 color: blue;

}

a.a1:visited{ /*链接访问后的状态*/

 color: green; 

}

a.a1:hover{  /*鼠标悬浮的状态*/

 color: red;

}

a.a1:focus{  /*鼠标点击后，刚松开的状态*/

 color: orange; 

}

a.a1:active{  /*点击中的状态，鼠标未松开时*/

 color: yellow;

}

</style>

`code`

`a:link 未设置超链接则无效`

`a:visited 针对URL，若两个a标签指向一个链接，点击一个另一个也有visited属性`

### `重排、重绘和合成`

`strong`

`strong`

`也叫重排 layout`

`渲染树中部分或全部元素的尺寸、结构或属性变化，浏览器会重新渲染部分或全部文档`

`触发回流的操作:`

* `初次渲染`
* `窗口大小改变(resize事件)`
* `元素属性、尺寸、位置、内容改变`
* `元素字体大小变化`
* `添加或者删除可见 dom 元素`
* `激活 CSS 伪类(如 :hover)`
* `查询某些属性或调用某些方法`

`修改样式的时候，**最好避免使用上面列出的属性，他们都会刷新渲染队列。**如果要使用它们，最好将值缓存起来。`

`strong`

`某些元素的样式如颜色改变，但不影响其在文档流中的位置，浏览器会对元素重新绘制`

`不再执行布局阶段，直接进入绘制阶段`

`strong`

`利用transform、opacity和filter可实现合成效果，即GPU加速`

`避开布局 分块和绘制阶段`

`strong`

* `最小化重绘和重排：样式集中改变，使用添加新样式类名`
* `使用 absolute或 fixed使元素脱离文档流(制作复杂动画时对性能有影响)`
* `开启GPU加速。利用css属性transform opacity will-change等，比如改变元素位置，使用 `
* `使用 visibility替换 display: none ，因为前者只会引起重绘，后者会引发回流（改变了布局）`
* `DOM 离线后修改，如：先把 DOM 设为display:none(有一次 Reflow)，然后修改再显示，只会触发一次回流`
* `不要把 DOM 结点属性值放在一个循环当成循环里的变量`
* `不要使用 table 布局，可能很小的一个小改动会造成整个 table 重新布局`
* `动画实现速度的选择，动画速度越快，回流次数越多，也可以选择使用 requestAnimationFrame`
* `CSS 选择符从右往左匹配查找，避免节点层级过多`
* `频繁运行的动画变为图层，图层能够阻止该节点回流影响别的元素。比如对于 video 标签，浏览器会自动将该节点变为图层`
* `通过documentFragment创建一个DOM文档片段，在它上面批量操作DOM，完成后再添加到文档中，只触发一次回流`

> `documentFragment不是真实DOM的一部分，它的变化不会触发DOM树的重新渲染，不会导致性能问题`
>
> `效果不甚明显，因为现代浏览器会使用队列存储储存多次修改进行优化`

## `盒子模型`

`strong`

`（1）普通盒模型`

`默认盒子属性：box-sizing: content-box;`

`strong`

`offsetWidth = (width + padding + border)，不算 margin`

`width 和 height 属性只会应用到这个元素的内容区`

`img`

`box-sizing: content-box;//定义引擎如何计算元素的总高度和总宽度`

* `content-box 默认值，元素的 width/height 不包含padding，border，与标准盒子模型表现一致`
* `border-box 元素的 width/height 包含 padding，border，与怪异盒子模型表现一致`
* `inherit 指定 box-sizing 属性的值，应该从父元素继承`

`（2）怪异盒模型`

`设置语句：box-sizing: border-box;`

`offsetWidth = width（padding 和 border 都挤压到内容里面）`

`width 和 height 包括内容区、padding 和 border，不算 margin`

`img`

`strong`

`margin 纵向重叠取重叠区最大值，不进行叠加`

`img`

`strong`

`margin-top 和 margin-left 是负值，元素会向上或者向左移动`

`margin-right 负值，右侧元素左移，自身不受影响`

`margin-bottom 负值，下侧元素上移，自身不受影响`

`strong`

`Block Format Context：块级格式化上下文`

`一块独立的渲染区域，内部元素的渲染不会影响边界以外的元素`

`形成 BFC 的条件：`

`float 不设置成 none
position 是 absolute 或者 fixed
overflow 不是 visible
display 是 flex 或者 inline-block 等`

`应用：清除浮动`

`strong`

`strong`

`strong`

`实现 pc 端三栏布局，中间一栏最先渲染
实现两边宽度固定，中间自适应`

`strong`

`img`

`strong`

`strong`

code

`strong`

code

`strong`

`strong`

code

`strong`

code

`（4）对比`

| 属性         | 圣杯布局              | 双飞翼布局       |
| ------------ | --------------------- | ---------------- |
| HTML         | 包裹三栏              | 只包裹中间一栏   |
| 是否定位     | 相对定位              | 无需定位         |
| 左右栏的空间 | 使用 padding 预留     | 使用 margin 预留 |
| 左栏处理     | positon + margin-left | margin-left      |
| 右栏处理     | margin-right          | margin-left      |

`（5）手写clearfix`

`CSS：`

code

`strong`

`（1）行内元素水平垂直居中`

`设置父级标签。`

`水平居中： text-align: center`

`垂直居中： line-height：盒子高度`

`（2）块级元素水平垂直居中`

`strong`

code

`水平垂直都居中`

code

`不会触发重排，因此最常用`

code

`容器设置：`

code

`容器：`

code

`子元素：`

code

`strong`

`em：相对于自身字体大小的单位
rem：相对于 html 标签字体大小的单位`

`vh：相对于视口高度大小的单位，20vh == 视口高度/10020
vw：相对于视口宽度大小的单位, 20vw == 视口宽度/10020`

### `margin 合并`

`margin 合并也叫外边框塌陷或者外边距重叠，注意不同于高度塌陷。`

`a`

`strong`

code

`code`

`code`

`code`

code

code

`code`

code

code

### `code`

`code`

`code`

`code`

`code`

`code`

## `code`

> `code`

* `code`
* `code`

`code`

* `code`
* `code`
* `code`

`code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

## `code`

`code`

`code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`
5. `code`
6. `code`

`code`

1. `code`
2. `code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`
5. `code`
6. `code`
7. `code`

`code`

`code`

`code`

`code`

## `code`

1. `code`
2. `code`
3. `code`
4. `code`
5. `code`
6. `code`

## `code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

## `code`

### `code`

| 选择器                                     | 例子                                         | 例子描述                                            |
| ------------------------------------------ | -------------------------------------------- | --------------------------------------------------- |
| .class                                     | .intro                                       | 选择 class=“intro” 的所有元素。                   |
| .class1.class2                             | .name1.name2                                 | 选择 class 属性中同时有 name1 和 name2 的所有元素。 |
| .class1 .class2                            | .name1 .name2                                | 选择作为类名 name1 元素后代的所有类名 name2 元素。  |
| #id                                        | #firstname                                   | 选择 id=“firstname” 的元素。                      |
| *                                          | *                                            | 选择所有元素。                                      |
| element                                    | p                                            | 选择所有 元素。                                     |
| element.class                              | p.intro                                      | 选择 class=“intro” 的所有 元素。                  |
| element,element                            | div, p                                       | 选择所有 元素和所有 元素。                          |
| element element                            | div p                                        | 选择 元素内的所有 元素。                            |
| element>element                            | div > p                                      | 选择父元素是 的所有 元素。                          |
| element+element                            | div + p                                      | 选择紧跟 元素的首个 元素。                          |
| element1~element2                          | p ~ ul                                       | 选择前面有 元素的每个 元素。                        |
| [attribute]                                | [target]                                     | 选择带有 target 属性的所有元素。                    |
| [attribute=value]                          | [target=_blank]                              | 选择带有 target=“_blank” 属性的所有元素。         |
| [attribute~=value]                         | [title~=flower]                              | 选择 title 属性包含单词 “flower” 的所有元素。     |
| [attribute                                 | =value]                                      | [lang                                               |
| [attribute^=value]                         | a[href^=“https”]                           | 选择其 src 属性值以 “https” 开头的每个 元素。     |
| [attribute$=value]   | a[href$=“.pdf”] | 选择其 src 属性以 “.pdf” 结尾的所有 元素。 |                                                     |
| [attribute*=value]                         | a[href*=“w3schools”]                       | 选择其 href 属性值中包含 “abc” 子串的每个 元素。  |
| :active                                    | a:active                                     | 选择活动链接。                                      |
| ::after                                    | p::after                                     | 在每个 的内容之后插入内容。                         |
| ::before                                   | p::before                                    | 在每个 的内容之前插入内容。                         |
| :checked                                   | input:checked                                | 选择每个被选中的 元素。                             |
| :default                                   | input:default                                | 选择默认的 元素。                                   |
| :disabled                                  | input:disabled                               | 选择每个被禁用的 元素。                             |
| :empty                                     | p:empty                                      | 选择没有子元素的每个 元素（包括文本节点）。         |
| :enabled                                   | input:enabled                                | 选择每个启用的 元素。                               |
| :first-child                               | p:first-child                                | 选择属于父元素的第一个子元素的每个 元素。           |
| ::first-letter                             | p::first-letter                              | 选择每个 元素的首字母。                             |
| ::first-line                               | p::first-line                                | 选择每个 元素的首行。                               |
| :first-of-type                             | p:first-of-type                              | 选择属于其父元素的首个 元素的每个 元素。            |
| :focus                                     | input:focus                                  | 选择获得焦点的 input 元素。                         |
| :fullscreen                                | :fullscreen                                  | 选择处于全屏模式的元素。                            |
| :hover                                     | a:hover                                      | 选择鼠标指针位于其上的链接。                        |
| :in-range                                  | input:in-range                               | 选择其值在指定范围内的 input 元素。                 |
| :indeterminate                             | input:indeterminate                          | 选择处于不确定状态的 input 元素。                   |
| :invalid                                   | input:invalid                                | 选择具有无效值的所有 input 元素。                   |
| :lang(language)                            | p:lang(it)                                   | 选择 lang 属性等于 “it”（意大利）的每个 元素。    |
| :last-child                                | p:last-child                                 | 选择属于其父元素最后一个子元素每个 元素。           |
| :last-of-type                              | p:last-of-type                               | 选择属于其父元素的最后 元素的每个 元素。            |
| :link                                      | a:link                                       | 选择所有未访问过的链接。                            |
| :not(selector)                             | :not§                                       | 选择非 元素的每个元素。                             |
| :nth-child(n)                              | p:nth-child(2)                               | 选择属于其父元素的第二个子元素的每个 元素。         |
| :nth-last-child(n)                         | p:nth-last-child(2)                          | 同上，从最后一个子元素开始计数。                    |
| :nth-of-type(n)                            | p:nth-of-type(2)                             | 选择属于其父元素第二个 元素的每个 元素。            |
| :nth-last-of-type(n)                       | p:nth-last-of-type(2)                        | 同上，但是从最后一个子元素开始计数。                |
| :only-of-type                              | p:only-of-type                               | 选择属于其父元素唯一的 元素的每个 元素。            |
| :only-child                                | p:only-child                                 | 选择属于其父元素的唯一子元素的每个 元素。           |
| :optional                                  | input:optional                               | 选择不带 “required” 属性的 input 元素。           |
| :out-of-range                              | input:out-of-range                           | 选择值超出指定范围的 input 元素。                   |
| ::placeholder                              | input::placeholder                           | 选择已规定 “placeholder” 属性的 input 元素。      |
| :read-only                                 | input:read-only                              | 选择已规定 “readonly” 属性的 input 元素。         |
| :read-write                                | input:read-write                             | 选择未规定 “readonly” 属性的 input 元素。         |
| :required                                  | input:required                               | 选择已规定 “required” 属性的 input 元素。         |
| :root                                      | :root                                        | 选择文档的根元素。                                  |
| ::selection                                | ::selection                                  | 选择用户已选取的元素部分。                          |
| :target                                    | #news:target                                 | 选择当前活动的 #news 元素。                         |
| :valid                                     | input:valid                                  | 选择带有有效值的所有 input 元素。                   |
| :visited                                   | a:visited                                    | 选择所有已访问的链接。                              |

### `code`

`code`

1. `code`
2. `code`
3. `code`

`code`

| 选择器         | 格式             | 优先级权重 |
| -------------- | ---------------- | ---------- |
| id选择器       | #id              | 100        |
| 类选择器       | .classname       | 10         |
| 属性选择器     | a[ref = “eee”] | 10         |
| 伪类选择器     | li:last-child    | 10         |
| 标签选择器     | div              | 1          |
| 为元素选择器   | li:after         | 1          |
| 相邻兄弟选择器 | h1 + p           | 0          |
| 子选择器       | ul > li          | 0          |
| 后代选择器     | li a             | 0          |
| 通配符选择器   | *                | 0          |

`code`

* `code`
* `code`
* `code`
* `code`
* `code`

### `code`

`code`

* `code`

> `code`
>
> `code`
>
> `code`
>
> `code`
>
> `code`

`code`

* `code`

code

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

## `code`

### `code`

`code`

* `code`

`code`

* `code`

`code`

`code`

`code`

* `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`

`code`

* `code`

`code`

* `code`

`code`

* `code`

`code`

* `code`

`code`

* `code`

`code`

* `code`

`code`

* `code`

`code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

`code`

* `code`

`code`

* `code`

`code`

* `code`

`code`

* `code`

`code`

* `code`

`code`

* `code`

`code`

* `code`

`code`

`code`

* `code`

`code`

* `code`

`code`

`code`

`code`

`code`

`code`

### `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`

### `code`

* `code`
* `code`
* `code`

## `code`

### `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

> `code`

### `code`

`code`

`code`

* `code`
* `code`

`code`

* `code`
* `code`
* `code`
* `code`

> `code`

### `code`

`code`

1. `code`
2. `code`
3. `code`

`code`

`code`

`code`

1. `code`
2. `code`

`code`

`code`

`code`

`code`

`code`

1. `code`
2. `code`

`code`

### `code`

`code`

code

`code`

`code`

`code`

`code`

`code`

### `code`

> `code`

`code`

* `code`
* `code`
* `code`

> `code`

`code`

`code`

> `code`

`code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`
5. `code`
6. `code`
7. `code`

> `code`

`code`

* `code`
* `code`
* `code`

### `code`

`code`

`code`

`code`

`code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

`code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`

`code`

`code`

`code`

## `code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`
5. `code`
6. `code`
7. `code`
8. `code`
9. `code`

`code`

## `code`

`code`

> `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`

`code`

`code`

`code`

`code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`

`code`

`code`

`code`

`code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

> `code`
>
> `code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

* `code`
* `code`
* `code`
* `code`

`code`

* `code`
* `code`
* `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`

> `code`

`code`

`code`

* `code`
* `code`
* `code`

`code`

* `code`
* `code`
* `code`

`code`

* `code`
* `code`
* `code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

## `code`

### `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

code

* `code`

### `code`

`code`

`code`

`code`

`code`

* `code`
* `code`
* `code`

code

code

code

`code`

code

code

`code`

code

code

`code`

code

code

code

code

`code`

`code`

`code`

code

code

code

code

code

code

code

code

`code`

`code`

> `code`

> `code`

code

code

code

`code`

code

code

`code`

code

code

`code`

code

code

code

code

`code`

`code`

code

code

code

`code`

code

code

`code`

code

code

`code`

code

code

code

code

`code`

`code`

`code`

`code`

`code`

code

code

code

`code`

code

code

`code`

code

code

`code`

code

code

code

code

`code`

`code`

`code`

code

code

code

code

code

code

code

code

code

code

`code`

`code`

`code`

`code`

code

code

code

code

code

`code`

code

code

code

code

code

code

`code`

`code`

`code`

`code`

code

code

code

`code`

code

code

`code`

code

code

`code`

code

code

code

code

`code`

`code`

code

code

code

code

code

code

code

code

code

code

code

### `code`

> `code`

* `code`
* `code`
* `code`
* `code`
* `code`

`code`

`code`

* `code`
* `code`
* `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`

> `code`

### `code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`
5. `code`

`code`

`code`

1. `code`
2. `code`

`code`

1. `code`
2. `code`

`code`

`code`

1. `code`
2. `code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`
5. `code`

### `code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`
5. `code`
6. `code`

### `code`

`code`

code

`code`

code

`code`

code

`code`

code

### `code`

`code`

### `code`

1. `code`
2. `code`
3. `code`

`code`

`code`

`code`

code

code

code

code

code

code

code

code

`code`

`code`

`code`

code

`code`

code

`code`

1. `code`
2. `code`

`code`

`code`

1. `code`
2. `code`

`code`

### `code`

`code`

* `code`
* `code`

`code`

`code`

* `code`
* `code`

code

`code`

`code`

`code`

code

`code`

`code`

* `code`
* `code`
* `code`

## `code`

`code`

`code`

`code`

code

1. `code`
2. `code`
3. `code`
4. `code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`

`code`

1. `code`
2. `code`
3. `code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`

### `code`

`code`

### `code`

`code`

### `code`

#### `code`

`code`

`code`

`code`

`code`

`code`

> `code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

* `code`
* `code`
* `code`

### `code`

`code`

## `code`

### `code`

`code`

`code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`
5. `code`

`code`

`code`

`code`

`code`

> `code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

### `code`

`code`

`code`

`code`

`code`

`code`

`code`

`code`

code

`code`

`code`

`code`

1. `code`
2. `code`
3. `code`

`code`

1. `code`
2. `code`

`code`

`code`

1. `code`
2. `code`
3. `code`
4. `code`

`code`

1. `code`
2. `code`

## `code`

`code`

code

`code`

code

`code`

code

`code`

code

## `code`

`code`

* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
* `code`
