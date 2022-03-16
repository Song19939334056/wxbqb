function start(url) { //获取html
    const res = http.get(url);
    if (res.statusCode === 200) {
        toast('网站获取成功')
        findUrl(res)
    } else {
        toast('网站获取失败')
    }
}
console.show()
function checkDir() { // 检查下载目录
    const hasdir = files.isDir("/sdcard/DCIM/表情包/")
    if (!hasdir) {
        files.create('/sdcard/DCIM/表情包/')
        log('检测到没有目录，已自动创建...')
    }
}
function findUrl(res) { // 过滤img标签
    const urllist = []
    var keyUrl = res.body.string().match(/<img data-ratio=.*? data-type=.*? data-src=(.*?) /g)
    for (var i = 0; i < keyUrl.length; i++) {
        var reg2 = /data-src="([^"]+)"/;
        var result2 = reg2.exec(keyUrl[i]);  //匹配src
        urllist.push(RegExp.$1)
    }
    checkDir()
    downImg(urllist)
}
function downImg(urls) { // 下载表情包
    index = 0
    const fun = function () {
        if (index < urls.length) {
            http.get(urls[index], {}, function (value, err) {
                const name = "/sdcard/DCIM/表情包/" + "name" +index + ".png"
                files.writeBytes(name, value.body.bytes())
                app.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE,android.net.Uri.fromFile(java.io.File(name)))); // 刷新图库
                index += 1
                log("第" + index + "张下载完成！")
                fun()
            })
        } else {
            toast('下载完成!')
            return
        }
    }
    fun()
}

start('https://mp.weixin.qq.com/s/Go8T0AR_0mJnMHddzgG-pQ')