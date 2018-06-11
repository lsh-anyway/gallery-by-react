require('normalize.css');
require('styles/App.sass');

import React from 'react';

// 获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
(function (imageDatasArr) {
  imageDatasArr.forEach(function (singeImageData) {
    singeImageData.imageURL = require('../images/' + singeImageData.fileName);
  });
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
