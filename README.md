# ImageScale

#### 介绍
前端图片缩放的JS插件

#### 软件架构
引用了H5的File、Blob、FileReader、URL对象

#### 使用说明
可以支持bmp、jpg、png、webp
```javascript
var scale = new ImageScale(file);
scale.toJpg(); // 设置图片类型toJpg、toJpeg、toBmp、toWebp、toPng
scale.setRatio(0.8); // 设置缩放比例0-10
scale.getObjectURL(); // 生成本地浏览的url
scale.createObjectURL(); // 创建新的本地浏览url
scale.getBase64().then(function(base64) {
   console.log(base64);
});// 转base64
scale.getBlob() // 转二进制

scale.resize().then(function(newScale) {
  newScale.getFile();
}); // 缩放文件会返回新的ImageScale对象
```