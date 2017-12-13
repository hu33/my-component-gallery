import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import './index.css';

const DISPLAY_STATUS = {
    SHOW: 'show',      //渐渐显示（有出现动画）
    HIDE: 'hide',      //隐藏（状态为hide时就卸载组件）
    FADE: 'fade'       //渐渐消失（有消失动画）
};

let guideTipContainer = null;

class GuideTip extends Component {
    static propTypes = {
        active: PropTypes.bool.isRequired,     //引导组件的唯一标识
        text: PropTypes.string.isRequired,     //引导组件的文案内容
        style: React.CSSProperties,            //自定义样式，可覆盖掉组件自身定义的样式
        className: PropTypes.string,           //自定义class名字，可用于定义类样式
        position: PropTypes.oneOf([
            'bottom',
            'bottomLeft',
            'bottomRight'
        ]),                                    //组件显示的位置，引导组件一般只显示在目标组件的下方，所以只有三种位置
        arrowPosition: PropTypes.oneOf([
            'center',
            'left',
            'right'
        ]),                                    //尖角显示的位置
        confirmText: PropTypes.string,         //引导组件确认按钮文案，若不传则不显示按钮
        confirmHandler: PropTypes.func,        //确认按钮的回调
        closeHandler: PropTypes.func,          //关闭按钮的回调
    };

    static defaultProps = {
        active: false,
        text: '',
        position: 'bottom',
        arrowPosition: 'center',
        confirmText: '知道啦',
        confirmHandler: () => {

        },
        closeHandler: () => {

        }
    };

    constructor(props) {
        super(props);
        this.state = {
            status: DISPLAY_STATUS.HIDE,    //默认为隐藏状态
        }
    }

    componentWillMount() {
        if (this.props.active) {
            this.setState({
               status: DISPLAY_STATUS.SHOW
            });
        }
    }

    componentDidMount() {
        if (this.state.status === DISPLAY_STATUS.SHOW) {
            this.getStyle();
        }
    }

    componentWillReceiveProps(nextProps) {
        //若active由true变成false，则将组件状态设为fade，用于显示消失动画
        if (this.props.active && !nextProps.active) {
            this.setState({
                status: DISPLAY_STATUS.FADE
            });
        }
    }

    componentDidUpdate(preProps, preState) {
        //如果reRender为true或从隐藏变为显示就重新计算style
        if ((this.state.status === DISPLAY_STATUS.SHOW && this.reRender) || (this.state.status === DISPLAY_STATUS.HIDE && preState.status === DISPLAY_STATUS.SHOW)){
        // if (this.state.status === DISPLAY_STATUS.HIDE && preState.status === DISPLAY_STATUS.SHOW) {
            this.getStyle();
        }
    }

    getStyle = () => {
        let {position, style, target} = this.props;
        let styles = {};
        const selfDOM = ReactDOM.findDOMNode(this);
        const width = selfDOM.offsetWidth;
        const tipPosition = target.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollX = window.scrollX || window.pageXOffset;
        const top = scrollY + tipPosition.top;
        const left = scrollX + tipPosition.left;
        styles.top = top + target.offsetHeight;
        this.reRender = !width;      //为了解决第一次计算时width为0，导致left计算有差值的问题
        switch (position) {
            case 'bottom':
                styles.left = left + target.offsetWidth / 2 - width / 2;
                break;
            case 'bottomLeft':
                styles.left = left;
                break;
            case 'bottomRight':
                styles.left = left + target.offsetWidth - width;
                break;
            default:
                styles.left = left + target.offsetWidth / 2 - width / 2;
                break;
        }
        styles = Object.assign({}, styles, style);    //若用户传了style，则覆盖掉计算出来的style
        this.setState({
            styles: styles
        });
    };

    onConfirm = () => {
            this.setState({
                status: DISPLAY_STATUS.FADE
            });
        setTimeout(() => {  //设置延时，使消失动画完成后再卸载组件
            close();
        }, 300);
    };

    render() {
        let {text, arrowPosition, confirmText, className} = this.props;
        const {status, styles} = this.state;
        if (status === DISPLAY_STATUS.HIDE) {
            return null;
        }
        className = classnames({
            'comp-guide-tip': true,
            [className]: className,
            ['comp-guide-tip-' + arrowPosition]: arrowPosition,
            ['fade-' + arrowPosition]: status === DISPLAY_STATUS.FADE
        });

        const arrowClassName = classnames({
            'arrow': true,
            ['arrow-' + arrowPosition]: arrowPosition
        });
        return (
            <div className={className} style={styles}>
                <div className={arrowClassName}></div>
                <div className="text">{text}</div>
                { confirmText ? (
                    <span className="btn-confirm" onClick={this.onConfirm}>{confirmText}</span>
                ) : null}
            </div>
        )
    }
}

function show(props) {
    if (guideTipContainer) {
        //已有引导层时，就不再创建
        return;
    }
    guideTipContainer = document.createElement('div');
    guideTipContainer.setAttribute('class', 'guide-tip-container');
    ReactDOM.render(<GuideTip {...props} active={true} />, guideTipContainer);
    document.body.appendChild(guideTipContainer);
    return guideTipContainer;
}

function close() {
    if (guideTipContainer) {
        try {
            ReactDOM.unmountComponentAtNode(guideTipContainer);
            guideTipContainer.parentNode.removeChild(guideTipContainer);
            guideTipContainer = null;
        } catch (e) {
            //catch
        }
    }
}

export default {
    show,
    close
}
