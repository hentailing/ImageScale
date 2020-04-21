(function (window,func) {
    window.ImageScale = func();
})(window, function () {
    /**
     * 实例化函数
     * @param file {File}
     */
    function ImageZoom(file) {
        this.setFile(file);
        this.reset();
    }
    /**
     * 设置输出的类型为png
     * @returns {ImageZoom}
     */
    ImageZoom.prototype.toPng = function () {
        this.toIndex = 'png';
        return this;
    };
    /**
     * 设置输出的类型为jpg
     * @returns {ImageZoom}
     */
    ImageZoom.prototype.toJpg = function () {
        this.toIndex = 'jpg';
        return this;
    };
    /**
     * 设置输出的类型为jpeg
     * @returns {ImageZoom}
     */
    ImageZoom.prototype.toJpeg = function () {
        this.toIndex = 'jpeg';
        return this;
    };
    /**
     * 设置输出的类型为bmp
     * @returns {ImageZoom}
     */
    ImageZoom.prototype.toBmp = function () {
        this.toIndex = 'bmp';
        return this;
    };
    /**
     * 设置输出的类型为webp
     * @returns {ImageZoom}
     */
    ImageZoom.prototype.toWebp = function () {
        this.toIndex = 'webp';
        return this;
    };
    /**
     * 设置缩放的倍率
     * @param ratio {number} 倍率
     * @returns {ImageZoom}
     */
    ImageZoom.prototype.setRatio = function (ratio) {
        if( isNaN(ratio) || ratio <= 0 || ratio > 10 ){
            throw new Error('ratio只能是大于0小于等于10的数字');
        }
        this.ratio = ratio.toFixed(2);
        return this;
    };
    /**
     * 设置缩放的倍率
     * @param quality {number} 倍率
     * @returns {ImageZoom}
     */
    ImageZoom.prototype.setQuality = function (quality) {
        if( isNaN(quality) || quality <= 0 || quality > 1 ){
            throw new Error('ratio只能是大于0小于等于1的数字');
        }
        this.quality = quality.toFixed(2);
        return this;
    };
    /**
     * 设置文件
     * @param file {File} 文件
     * @returns {ImageZoom}
     */
    ImageZoom.prototype.setFile = function(file){
        if( !file || !file.type || ['image/jpg','image/png','image/jpeg','image/webp','image/bmp'].indexOf(file.type) === -1 ){
            throw new Error('请选择一个正确的图片');
        }
        this.file = file;
        return this;
    };
    /**
     * 获取文件的blob
     * @returns {Blob | null}
     */
    ImageZoom.prototype.getBlob = function () {
        if( this.originBlob === null ){
            this.originBlob = new Blob([this.getFile()], {type:this.getMimeType()});
        }
        return this.originBlob;
    };
    /**
     * 获取源文件的base64
     * @returns {Promise<object>}
     */
    ImageZoom.prototype.getBase64 = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            if( that.originBase64 === null ){
                var reader = new FileReader();
                reader.readAsDataURL(that.getFile());
                reader.onload = function (e) {
                    that.originBase64 = this.result;
                    resolve(that.originBase64);
                };
                reader.onerror = function (e) {
                    reject(e);
                };
            }else{
                resolve(that.originBase64);
            }
        });
    };
    /**
     * 获取文件的url(仅一次)
     * @returns {string | null}
     */
    ImageZoom.prototype.getObjectURL = function () {
        if( this.originObjectURL === null ){
            this.originObjectURL = this.createObjectURL();
        }
        return this.originObjectURL;
    };
    /**
     * 创建URL
     * @returns {string}
     */
    ImageZoom.prototype.createObjectURL = function () {
        return URL.createObjectURL(this.getBlob());
    };
    /**
     * 加载图片对象
     * @param imageOnload {undefined|function}
     * @returns {HTMLImageElement | null}
     */
    ImageZoom.prototype.loadImageObject = function (imageOnload) {
        var that = this;
        if( this.originImage === null ){
            this.originImage = new Image();
        }
        this.originImage.addEventListener('load', function () {
            that.originWidth = this.width;
            that.originHeight = this.height;
            if( typeof imageOnload === 'function' ){
                imageOnload.call(this);
            }
        });
        this.originImage.src = this.createObjectURL();
        return this.originImage;
    };
    /**
     * 获取文件
     * @returns {File}
     */
    ImageZoom.prototype.getFile = function () {
        return this.file;
    };
    /**
     * 获取文件带后缀的文件名
     * @returns {string}
     */
    ImageZoom.prototype.getFullFilename = function(){
        return this.file.name;
    };
    /**
     * 获取文件名
     * @returns {string}
     */
    ImageZoom.prototype.getFilename = function () {
        return this.getFullFilename().split('.')[0];
    };
    /**
     * 获取文件后缀
     * @returns {string}
     */
    ImageZoom.prototype.getExtension = function(){
        return this.getFullFilename().split('.')[1]||'';
    };
    /**
     * 获取文件类型
     * @returns {string}
     */
    ImageZoom.prototype.getMimeType = function () {
        return this.file.type;
    };
    /**
     * 获取文件大小
     * @returns {number}
     */
    ImageZoom.prototype.getSize = function () {
        return this.file.size;
    };
    /**
     * 缩放文件用新的文件名
     * @param nextName {undefined|string}
     * @returns {ImageZoom}
     */
    ImageZoom.prototype.useNewFileName = function (nextName){
        this.newFilename = true;
        this.nextName = nextName||null;
        return this;
    };
    /**
     * 缩放
     * @returns {Promise<ImageZoom>}
     */
    ImageZoom.prototype.resize = function(){
        var canvas = document.createElement('canvas');
        if( !canvas.getContext ){
            throw new Error('您的浏览器不支持canvas,无法使用该功能');
        }
        var quality = this.quality;
        var ratio = this.ratio;
        var mimeType = 'image/'+this.toIndex;
        var newFilename;
        if( this.newFilename ){
            if( this.nextName ){
                newFilename = this.nextName + '.' + this.toIndex;
            }else{
                newFilename = this.getFilename() + '_ratio_'+ratio*100+'_quality_'+quality*100+'.' + this.toIndex;
            }
        }else{
            newFilename = this.getFilename() + '.' + this.toIndex;
        }
        var that = this;
        return new Promise(function (resolve, reject) {
            that.loadImageObject(function () {
                canvas.width = this.width * ratio;
                canvas.height = this.height * ratio;
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.scale(ratio, ratio);
                ctx.drawImage(this, 0, 0);
                ctx.restore();
                canvas.toBlob(function (blob) {
                    var zoomFile = new File([blob], newFilename, {type:mimeType});
                    resolve(new ImageZoom(zoomFile));
                }, mimeType, quality);
            });
        });
    };
    /**
     * 重置
     * @returns {ImageZoom}
     */
    ImageZoom.prototype.reset = function () {
        this.originBlob = null;
        this.originBase64 = null;
        this.originImage = null;
        this.originObjectURL = null;
        this.originWidth = null;
        this.originHeight = null;
        this.toIndex = 'webp';
        this.ratio = 1;
        this.quality = 1;
        this.newFilename = false;
        this.nextName = null;
        return this;
    };
    return ImageZoom;
});