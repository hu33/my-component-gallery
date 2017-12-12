## 带动画的单个引导组件GuideTip



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

