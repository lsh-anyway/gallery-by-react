require('normalize.css');
require('styles/App.sass');

import React from 'react';
import ReactDOM from 'react-dom';
import ImageFigure from './ImgFigure';
import ControllerUnit from './ControllerUnit';
import { getRangeRandom, get30DegRandom } from './util';

// 获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
(function (imageDatasArr) {
  imageDatasArr.forEach(function (singeImageData) {
    singeImageData.imageURL = require('../images/' + singeImageData.fileName);
  });
})(imageDatas);

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 图片的位置信息，在 render 时初始化，在 componentDidMount 时通过 rearrange 函数赋值
      imgsArrangeArr: [
        /* {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,   // 旋转角度
          isInverse: false,  // 图片正反面
          isCenter: false   // 图片是否居中
        } */
      ]
    };
  }

  // 各个分区的位置排布信息，在 componentDidMount 时初始化
  Constant = {
    centerPos: {
      left: 0,
      top: 0
    },
    hPosRange: {  // 左右分区位置排布
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {  // 上分区位置排布
      x: [0, 0],
      topY: [0, 0]
    }
  };

  /**
   * 重新布局所有图片
   * @param centerIndex 中心图片的索引
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      { centerPos, hPosRange, vPosRange } = Constant,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      // 上分区的图片信息
      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),  // 取一个或者不取
      topImgSpliceIndex = 0,  //上侧区域的图片是从数组对象中的哪个位置拿出来的

      // 居中图片信息
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首先居中 centerIndex 的图片
    // 居中的图片不需要旋转
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    // 取出要布局在上分区的图片信息
    topImgSpliceIndex = Math.random() * Math.floor(imgsArrangeArr.length - topImgNum);  //从这个位置往后取topImgNum个元素，所以要减topImgNum
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);  //上分区的图片

    // 布局位于上分区的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(...vPosRangeTopY),
          left: getRangeRandom(...vPosRangeX)
        },
        rotate: get30DegRandom(),
        isCenter:false
      };
    });

    // 布局左右两侧分区的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX;

      // 前半部分布局在左边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(...hPosRangeY),
          left: getRangeRandom(...hPosRangeLORX)
        },
        rotate: get30DegRandom(),
        isCenter:false
      };

    }

    // 将之前取出的上分区的图片和居中的图片重新合并
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr
    });

  }

  /**
   * 翻转图片
   * @param index 当前被执行翻转图片所对应图片信息数组的索引
   * @returns {function} 一个闭包函数，是真正的待执行函数
   */
  inverse(index) {
    return function () {
      let { imgsArrangeArr } = this.state;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr
      })
    }.bind(this);
  }

  center(index) {
    return function () {
      this.rearrange(index);
    }.bind(this);
  }

  // 组件加载后，为每张图片计算其位置范围
  componentDidMount() {

    // 首先获取舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this._stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.floor(stageW / 2),
      halfStageH = Math.floor(stageH / 2);

    // 获取每一个 imageFigure 的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this._imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.floor(imgW / 2),
      halfImgH = Math.floor(imgH / 2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    // 计算左右分区的位置排布
    this.Constant.hPosRange = {
      leftSecX: [-halfImgW, halfStageW - 3 * halfImgW],
      rightSecX: [halfStageW + halfImgW, stageW + halfImgW],
      y: [-halfImgH, stageH + halfImgH]
    };

    // 计算上分区的位置排布
    this.Constant.vPosRange = {
      x: [halfStageW - imgW, halfStageW],
      topY: [-halfImgH, halfStageH - 3 * halfImgH]
    };

    this.rearrange(0);

  }

  render() {

    let controllerUnit = [],  // 图片下方导航条，控制器组件数组
      imgFigures = [];  // 图片容器组件数组

    imageDatas.forEach(function (value, index) {

      // 初始化图片位置信息
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(<ImageFigure data={value} key={index} ref={imgFigure => this['_imgFigure' + index] = imgFigure} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

      controllerUnit.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));

    return (
      <section className="stage" ref={stage => this._stage = stage}>
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnit}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
