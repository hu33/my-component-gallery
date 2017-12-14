## 带动画的单个引导组件GuideTip

### 说明

组件用React16的portal重写了一下，所以用法也变了，可以直接写在JSX中，但是它渲染的时候又是渲染在另一处DOM上，是不是很神奇？这就是Portal的魅力呀~~传说中的传送门，哈哈哈。

### 新用法

```javascript
//在你想要render的地方加上该组件，并且可以传children来自己定义里面的内容
<div className="steps-wrap">
    <div className="step step1" id="step1">步骤1</div>
    <GuideTip
        active={true}
        text='这是步骤1'
        parent="#step1"
        arrowPosition="left"
        position="bottomLeft"
    >
        <div>这是个引导</div>
    </GuideTip>
    <div className="step step2" ref="step2">步骤2</div>
    <div className="step step3" ref="step3">步骤3</div>
</div>
```

-----------分割线-----------

### 说明：

此组件为单个tip，有出现、抖动、消失动画。

由于这是引导组件，所以position只支持bottom、bottomLeft及bottomRight，分别表示位于目标节点的正下方、左下方、右下方。arrowPosition用于设置尖角的位置，可取的值为left、center、left。

动画效果图：

![](http://ow7p6xhhi.bkt.clouddn.com/guideTip.gif)



### 用法：

```javascript
GuideTip.show({
    text: '这是一个引导组件',
    className: 'my-guide-tip',
    target: ReactDOM.findDOMNode(this.searchRef),
    arrowPosition: 'right',
    position: 'bottomRight',
    style: {'width': '250px'},
    confirmText: 'OK'
});
```

