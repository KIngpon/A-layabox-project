function canvas() {
    document.getElementsByClassName('ani')[0].style.bottom = '1000px';
    (function () {
        var Sprite = Laya.Sprite;
        var Stage = Laya.Stage;
        var Event = Laya.Event;
        var Rectangle = Laya.Rectangle;
        var Texture = Laya.Texture;
        var Browser = Laya.Browser;
        var Handler = Laya.Handler;
        var WebGL = Laya.WebGL;
        var stop = 0
        var width = 375
        var height = 603
        var interval = {}
        var tton = -1
        var isdoing = false
        var chance = localStorage.chance || 2
        Laya.init(width * 2, height * 2);
        Laya.stage.alignV = Stage.ALIGN_MIDDLE;
        Laya.stage.alignH = Stage.ALIGN_CENTER;
        bg()
        control()
        head()
        continueI()
        var ttonInter = setInterval(function () {
            tton += 1
            ttoGo()
        }, 1000);
        // 3,2,1,GO            
        function ttoGo () {
            var url
            var h
            var w
            var x = 330
            var y = 440
            isdoing = true
            img = new Sprite()
            img.name = 'ttImg'
            Laya.stage.removeChildByName('ttImg')
            img.graphics.clear()
            if (tton == 4) return clearInterval(ttonInter)
            if (tton == 3) {
                isdoing = false
                setTime()
            }
            if (tton == 2) {
                this.time = new Laya.Timer()
                this.time.loop(1500, this, huandong)
            }
            switch (tton) {
                case 0:
                    url = '../laya/assets/three.png'
                    w = 130
                    h = 191
                    break;
                case 1:
                    url = '../laya/assets/two.png'
                    w = 130
                    h = 200
                    break;
                case 2:
                    url = '../laya/assets/one.png'
                    w = 130
                    h = 200
                    break;
                case 3:
                    url = '../laya/assets/GO.png'
                    w = 300
                    h = 200
                    x = 240
                    break;
            }
            img.loadImage(url,x,y,w,h)
            Laya.stage.addChild(img)
        }
        // 背景
        function bg() {
            var img = new Sprite();
            img.loadImage('../laya/assets/bg.png',0,0,width * 2, height * 2);
            Laya.stage.addChild(img)
        }
        // 头部
        function head(p) {
            if (Math.abs(p) >= 0) {
                this.text.text = "总得分 " + p + '亿'
            } else {
                var url = "../laya/assets/button.png"
                this.img1 = new Laya.Sprite()
                this.img2 = new Laya.Sprite()
                this.img1.loadImage(url, 20, 15, 146 * 2, 35 * 2)
                this.img2.loadImage(url, 430, 15, 146 * 2, 35 * 2)
                this.text = new Laya.Text()
                this.text1 = new Laya.Text()
                this.text1.text = "今天剩余" + chance + "次"
                this.text.text = "总得分 0 亿"
                this.text.bold = this.text1.bold = true
                this.text1.color = this.text.color = "#8E4A10"
                this.text1.fontSize = this.text.fontSize = 30;
                this.text.pos(90, 35)
                this.text1.pos(490, 35)
                Laya.stage.addChild(this.img1)
                Laya.stage.addChild(this.img2)
                Laya.stage.addChild(this.text)
                Laya.stage.addChild(this.text1)
            }
        }
        // 倒计时
        var iTime = 30;
        function setTime (i) {
            if (isdoing) return
            if (i) Laya.stage.removeChildByName('timeT')
            if (interval.time <= 0) return
            var time = new Laya.Text()
            time.pos(340, 35)
            time.fontSize = 30
            time.name = 'timeT'
            iTime = interval.time || 30
            Laya.stage.addChild(time)
            let it = setInterval(() => {
                if (iTime <= 0) {
                    clearInterval(it)
                    stop = 1
                    result()
                }
                time.text = iTime + '秒'
                iTime -= 1
                interval.it = it
                interval.time = iTime
            }, 1000)
        }
        // 暂停/继续
        var stopGo = []
        function continueI (i) {
            var url = i ? '../laya/assets/Continue.png' : '../laya/assets/stop.png'
            this.start = new Sprite()
            Laya.stage.addChild(this.start)
            this.start.loadImage(url, 0, 0, 80, 80)
            this.start.x = 630
            this.start.y = 120
            this.start.name = 'toggle'
            if (iTime <= 0) return
            this.start.on('click',this, function () {
                if (stopGo.length > 0) {
                    for (var s = 0; s < stopGo.length; s++) {
                        stopGo[s].resume()
                    }
                    stopGo = []
                }
                clearInterval(interval.it)
                isdoing = false
                if (i) setTime(1)
                stop = i ? 0 : 1
                Laya.stage.removeChildByName('toggle')
                i ? continueI(0) : continueI(1)
            })
        }
        var point = 0; // 分数
        var oldObj;
        var imgs = ["../laya/assets/guys_0.png", "../laya/assets/guys_1.png", "../laya/assets/guys_2.png", "../laya/assets/guys_3.png"];
        // 缓动
        function newObj(obj, i) {
            var speed = Math.round(2 + Math.random() * (6 - 2))
            let random = Math.round(Math.random() * 11)
            let w = random * width / 6
            obj = new Sprite()
            if (!i) i = Math.floor(Math.random() * 4)
            obj.loadImage(imgs[i], w, 0, 60, 60)
            obj.y = Laya.stage.height
            Laya.stage.addChild(obj)
            let go = Laya.Tween.from(obj, {
                y: -100,
                update: Handler.create(this, function () {
                    if (stop) {
                        stopGo.push(go)
                        return go.pause()
                    }
                    if (oldObj == obj) return
                    if (obj.y >= height / 2 * 3 && obj.y <= height / 2 * 3 + 250 / 10) {
                        let x = w - 30;  //物品的x中心
                        let left = ape.x - ape.width / 2 - 30; // 瓶子左边缘 
                        let right = ape.x + ape.width / 2 - 60; // 瓶子右边缘
                        if (x >= left && x <= right) { // if (物品的x中心 >= 左边缘 && 物品的x中心 <= 右边缘)
                            if (i == 0) {
                                point -= 30
                            } else {
                                point += 30;
                            }
                            oldObj = obj
                            go.complete()
                            head(point)
                            thridty(i,ape)
                        }
                    }
                }, null, false)
            }, 10000 / speed, null, Handler.create(this, function () {
                // console.info('缓动完成')
            }), random * 1000);
        }
        // +/-30亿
        function thridty (i,obj) {
            var url = i ? '../laya/assets/plus.png' : '../laya/assets/minus.png'
            var img = new Sprite()
            img.name = 'thridtyY'
            img.loadImage(url, obj.x - 50, obj.y / 5 * 4,100,50)
            Laya.stage.addChild(img)
            setTimeout(function() {
                Laya.stage.removeChildByName('thridtyY')
            }, 500);
        }
        function huandong() {
            for (let i = 0; i < imgs.length; i++) {
                if (stop) return
                var a = 'img' + i
                newObj(a, i)
            }
        }
        // 瓶子
        var ape, dragRegion;
        function control() {
            var ApePath = "../laya/assets/jar.png";

            (function () {
                Laya.stage.scaleMode = "showall";

                Laya.loader.load(ApePath, Handler.create(this, setup));
            })();

            function setup() {
                createApe();
                showDragRegion();
            }

            function createApe() {
                ape = new Sprite();

                ape.loadImage(ApePath);
                Laya.stage.addChild(ape);

                var texture = Laya.loader.getRes(ApePath);
                ape.pivot(texture.width / 2, texture.height / 2);
                ape.x = Laya.stage.width / 2;
                ape.y = height / 2 * 3.5;

                ape.on(Event.MOUSE_DOWN, this, onStartDrag);
                Laya.stage.on(Event.KEY_DOWN, this, key_go)
            }

            function showDragRegion() {
                //拖动限制区域
                var dragWidthLimit = Laya.stage.width;
                var dragHeightLimit = -Laya.stage.height / 3 * 2.25;
                dragRegion = new Rectangle(Laya.stage.width - dragWidthLimit >> 1, Laya.stage.height - dragHeightLimit >> 1, dragWidthLimit, 0);
                //画出拖动限制区域
                // Laya.stage.graphics.drawRect(
                //     dragRegion.x, dragRegion.y, dragRegion.width, dragRegion.height,
                //     null, "#FFFFFF", 2);
            }

            function onStartDrag(e) {
                //鼠标按下开始拖拽(设置了拖动区域和超界弹回的滑动效果)
                ape.startDrag(dragRegion);
            }
            // 键盘移动
            function key_go(e) {
                if (e["keyCode"] == 37) {
                    if (ape.x <= 0) return
                    ape.x -= 25
                } else if (e["keyCode"] == 39) {
                    if (ape.x >= Laya.stage.width) return
                    ape.x += 25
                }
            }
        }
        // 结果
        function result() {
            var img = new Sprite()
            var text = new Laya.Text()
            var text2 = new Laya.Text()
            var text3 = new Laya.Text()
            var btn = new Sprite()
            var cls = new Sprite()
            var grap = new Sprite()
            var again = new Sprite()
            var againPlay = new Sprite()
            var hitarea = new Laya.HitArea()  //新建一个点击区域实例
            var hitarea2 = new Laya.HitArea()  //新建一个点击区域实例
            var path = [
                ["moveTo",0,0],
                ["arcTo", 350, 0, 350, 30, 30],
                ["arcTo", 350, 100, 320, 100, 30],
                ["arcTo", 0, 100, 0, 80, 30],
                ["arcTo", 0, 0, 100, 0, 30]
            ]
            btn.graphics.drawPath(220, 650, path, { fillStyle: '#e69643' })
            grap.graphics.drawRect(595,305,55,55,'blue')
            grap.alpha = 0
            hitarea.hit = grap.graphics  //让实例的点击区域设置为矩形
            cls.hitArea = hitarea  //让sprite实例的hitArea属性等于实例
            cls.on('click',this,function () {
                document.getElementsByClassName('ani')[0].style.bottom = 0
                setTimeout(function() {
                    Laya.stage.destroyChildren()
                    ranking()
                }, 800);
            })
            again.graphics.drawRect(222, 650, 345,95, 'blue')
            again.alpha = 0
            hitarea2.hit = again.graphics
            againPlay.hitArea = hitarea2
            Laya.stage.addChild(img)
            Laya.stage.addChild(text)
            Laya.stage.addChild(text2)
            Laya.stage.addChild(btn)
            Laya.stage.addChild(cls)
            Laya.stage.addChild(grap)
            Laya.stage.addChild(again)
            Laya.stage.addChild(text3)
            Laya.stage.addChild(againPlay)
            img.loadImage('../laya/assets/result.png',120,300,368 * 3 / 2,381 * 3 / 2)
            img.name = "resultBg"
            text.name = "resultT1"
            text2.name = "resultT2"
            text3.name = "resultT3"
            btn.name = "resultBtn"
            if (localStorage.point) {
                if (point > Number(localStorage.point)) localStorage.point = point               
            } else {
                localStorage.point = point
            }
            text.text = '总得分: ' + point + ' 亿'
            text2.text = '今天剩余次数: ' + chance
            text3.text = '再来一次'
            text3.color = "white"
            text.bold = text2.bold = text3.bold = true
            text.color = text2.color = "#8E4A10"
            text.fontSize = text2.fontSize = 30;
            text3.fontSize = 40
            text.pos(160 * 2, 230 * 2, true)
            text2.pos(135 * 2, 280 * 2,true)
            text3.pos(160 * 2, 337 * 2, true)
            againPlay.on('click',this,function () {
                if (chance <= 0) {
                    localStorage.removeItem('chance')
                    alert('今天机会用完了,明天再来吧!')
                    return
                }
                Laya.stage.destroyChildren()
                localStorage.chance = chance - 1
                canvas()
            })
        }
    })();
}

//显示隐藏排行榜
function showMask(i) {
    if (i) {
        document.getElementsByClassName('mask')[0].style.display = 'block'
        document.getElementsByClassName('Rankings')[0].style.display = 'block'
    }else {
        document.getElementsByClassName('mask')[0].style.display = 'none'
        document.getElementsByClassName('Rankings')[0].style.display = 'none'
    }
}

//排行榜
function ranking() {
    if (!localStorage.point) localStorage.point = 0
    document.getElementById('point').innerHTML = localStorage.point + '分'
    let content = document.getElementsByClassName('content')[0]
    let list = [{
        name: '张三',
        point: 1200
    }, {
        name: '李四',
        point: 1120
    }, {
        name: '路人甲',
        point: 600
    }, {
        name: '路人乙',
        point: 1500
    }]
    list.push({
        name: '你',
        point: Number(localStorage.point)
    })
    let listSort = list.sort((x, y) => {
        return y.point - x.point
    })
    document.getElementsByClassName('content')[0].innerHTML = ''
    for (var i = 0; i < listSort.length; i++) {
        let div = document.createElement('div')
        let span = document.createElement('span')
        let p = document.createElement('p')
        let p2 = document.createElement('p')
        let img = document.createElement('img')
        span.innerHTML = 1 + i
        if (i == 0) span.style.color = 'yellow'
        if (i == 1) span.style.color = 'blue'
        if (i == 2) span.style.color = '#e57906'
        if (i >= 3) span.style.color = '#793e06'
        img.src = '../laya/assets/guys_1.png'
        div.style.display = "flex"
        p.innerHTML = listSort[i].name
        p.style.color = p2.style.color = '#8A4406'
        p.style.width = '4rem'
        p2.style.fontWeight = 'bold'
        p2.innerHTML = listSort[i].point + '分'
        if (listSort[i].name == '你') p.style.color = 'red'
        div.appendChild(span)
        div.appendChild(img)
        div.appendChild(p)
        div.appendChild(p2)
        content.appendChild(div)
        let listIndex = listSort.findIndex((it) => {
            return it.point == Number(localStorage.point)
        })
        document.getElementById('ranking').innerHTML = listIndex + 1 + '名'
    }
}
ranking()