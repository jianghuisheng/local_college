
//课程播放器
var musicBox = document.getElementById('musicBox');
var music_arry = [];
var music_index = 0;

//优惠券状态 
var couponUser;

// wait周一提示
var res_wait;
var status;

// 服务器路径
var host = 'http://ollege.mrwfg.cn';


// tab切换
$('#tab span').click(function () {
    var index = $(this).index();
    $(this).addClass('select').siblings('span').removeClass('select');
    if (index == 2) {
        index = 1;
    }
    $('#con li').eq(index).show().siblings().hide();
});

//判断页面滚动到顶部和底部
$(window).scroll(function () {
    var scroll_top = $(document).scrollTop();
    if (scroll_top >= 383) {
        $('#tab').addClass('fixed_top');
    } else {
        $('#tab').removeClass('fixed_top');
    }
});


$(document).ready(function () {

    // 点击试听按钮
    $(".try_listen").click(function () {
        $(this).hide(0);
        $('.pause_listen').show(0);
        // 试听页面
        $(".dialog").show(500).css('overflow', 'auto');
        // 弹窗显示
        $('.black_overlay').css('display', 'block');
        // 播放器显示
        $('#musicBox').css('display', 'block');
        // 防报错白条隐藏
        $('.deBug').css('display', 'none');
        // 红包优惠券页面下的底部菜单
        $('.pack_wrap').css('display', 'none');

        musicBox.play();

        // 微信登录验证
        // $.ajax({
        //     type: 'post',
        //     url: '/index.php/index/index/click_audition',
        //     data: '',
        //     dataType: 'json',
        //     success: function (res) { }
        // });

    });
})

//点击暂停按钮
$(".pause_listen").click(function () {
    $(this).hide(0);
    $('.try_listen').show(0);
    $(".dialog").hide(500).css('overflow', 'auto');
    $('.black_overlay').css('display', 'none')
    musicBox.pause();
});

// 报名跳转
$('.pay').click(function () {
    location.href = 'payout.html';
})

// 点击折叠按钮
$('.arrow_down').click(function () {
    $('.dialog').hide(500);
    $('.black_overlay').css('display', 'none');
    $('.deBug').css('display', 'none');
});


// 静态轮播图渲染实现
$.ajax({
    type: 'post',
    url: host + '/index.php/index/index/user_list',
    data: '',
    dataType: 'json',
    success: function (res) {
        if (res.code == 200) {
            console.log(res);
            
            var html = '';
            $.each(res.data, function (index, item) {
                html += `<li class='swiperShow'>
                <img src="${item.avatar}" alt=""><span>${item.nickname}</span>
            </li>`
            })
            $('.con1').append(html);
        } else {
            layui.use(['layer', 'laypage', 'element'], function () {
                var layer = layui.layer;
                layer.open({
                    title: '提示',
                    content: res.message
                });
            });
        }
    }
});


//获取滚动列表容器
var area = document.getElementById('moocBox');
var liHeight;
setTimeout(function () {
    liHeight = $('li.swiperShow').height();
    //克隆area的内容
    area.innerHTML += area.innerHTML;
}, 500)

//设定向上滚动初始值为0
area.scrollTop = 0;

//声明定时器
var time;

//循环间歇滚动时间间隔
var speed = 50;

//单次间歇滚动时间间隔
var delay = 1500;

//循环间歇滚动
function startMove() {
    //开始滚
    area.scrollTop++;
    //延迟50毫秒执行单次间歇滚动
    time = setInterval("scrollUp()", speed)
};

//单次间歇滚动
function scrollUp() {
    //当滚动列表向上滚动的高度是单个li的整倍数时
    if (area.scrollTop % liHeight == 0) {
        //清除定时器，停止滚动
        clearInterval(time);
        //延迟2秒钟后再继续滚
        setTimeout("startMove()", delay);
        //当滚动列表向上滚动的高度不是单个li的整倍数时
    } else {
        //继续滚
        area.scrollTop++;
        //当滚动的高度等于滚动内容一半时
        if (area.scrollTop >= area.scrollHeight / 2) {
            //将滚动高度归零
            area.scrollTop = 0;
        }
    }
};

//设定定时器，2秒后开始执行startMove
setTimeout("startMove()", delay);



// 是新用户,已支付课程,支付时间未满一周弹窗
var statusReswait0 = `<div class="layer_wrapper">
                        <div class="layer_content">
                            <p>报名后课程每天更新</p>
                            <p>欢迎宝粉们明天再来哦</p>
                        </div>
                        <div class="layer_footer">
                            <span class="layer_exit" style="margin:5px 30px;"><a class=" layui-layer-close layui-layer-close1" href="javascript:;"style='color: #165816;position:static;letter-spacing: 2px;
                            font-family: serif;'>我知道了</a></span>
                        </div>
                    </div>`

// 用户支付课程后到达下周一弹窗
var statusReswait1 = `<div class="layer_wrapper">
                        <div class="layer_content">
                            <p>我们为您排班中</p>
                            <p>亲,请下周一来听课哟</p>
                        </div>
                        <div class="layer_footer">
                            <span class="layer_exit" style="margin:5px 30px;"><a class=" layui-layer-close layui-layer-close1" href="javascript:;"style='color: #165816;position:static;letter-spacing: 2px;
                            font-family: serif;'>我知道了</a></span>
                        </div>
                    </div>`
// 用户支付弹窗
var nonPayment = `<div class="layer_wrapper">
                        <div class="layer_content">
                            <p>课程尚未开放</p>
                            <p>加入学习计划可畅听所有课程</p>
                        </div>
                        <div class="layer_footer">
                            <span class="layer_exit" style="margin:5px 30px;"><a class=" layui-layer-close layui-layer-close1" href="javascript:;"style='color: #165816;position:static;letter-spacing: 2px;
                            font-family: serif;'>我知道了</a></span>
                        </div>
                    </div>`

$(document).ready(function () {
    $.ajax({
        type: 'post',
        url: host + '/index.php/index/index/list_1',
        data: '',
        dataType: 'json',
        success: function (res) {
            console.log(res);
            if (res.code == 200) {
                
                // 是否到下周一参数
                res_wait = res.data.wait;
                // 是否显示优惠券
                couponUser = res.data.get_coupon;
                // 总章节
                $('.details').text('(' + res.data.title + ')');


                // 实际支付价格
                $('.currentPrice').text(res.data.price);
                // 押金
                $('.pledgePrice').text(res.data.deposit);
                // 原件
                $('.originPrice').text(res.data.market_price);
                // 折扣价格
                $('.discoutPrice').text(res.data.waiver_rice);



                // 总报名用户
                $('.totalUsers').text(res.data.total_user);



                var html = '';
                $.each(res.data.list, function (index, item) {

                    // 文章标题
                    html += '<li class="titles"' + item.id + '>' + item.book_name + '</li>'

                    // 章节对应显示锁子还是待享听状态
                    $.each(item.chapter, function (i, v) {
                        var lockHtml = '';
                        if (v.is_lock) {
                            lockHtml = '<span class="lock"><i class="fa fa-lock"></i></span>'
                        } else {
                            lockHtml = '<span class="audition">待享听</span>'
                        }

                        // 音乐地址存起来
                        music_arry.push(v.content);

                        // 标题章节
                        html += '<li class="cons" data-isLock=' + v.is_lock + ' data-id=' + v.book_id + ' data-status=' + v.status + ' data-chapter-id=' + v.chapter_id + ' data-content=' + v.content + '>' + v.chapter_name + lockHtml + '</li>'
                    })
                });
                $('#lists').append(html);

                // 课程音频默认地址
                musicBox.src = music_arry[music_index];
                // console.log($('.cons').attr('data-wait'),'167');

                // 默认选中第一个章节样式(自动执行点击方法的样式)
                // $('.cons').first().click();

                // 默认选中第一个样式
                $('.cons').first().addClass('clicked');
                $('.cons').first().find('span').text('享听中');
                $('.cons').first().find('span').removeClass('lock').addClass('audition');

                // 是否是付费用户
                status = $('.cons').attr('data-status');

                // 付费用户对应样式
                if (status == 1) {
                    // 红包优惠券层消失
                    $('.packCoupon').css('display', 'none');
                    $('.foot_bottom').css('z-index', 9999);
                    // 底部布局文字改为付费状态
                    $('.listen_status').text('享听');
                    $('.discount').css('display', 'none');
                    $('.pay').css('display', 'none');
                    $('.tell').text('宝粉请享听...');
                    $('.tell').css('color', '#fff');
                }

                // 未付费并且没有领取优惠券
                if (status == 0 && couponUser == 0) {
                    $('.packCoupon').css('display', 'block');
                    $('.red_packet').css('display', 'block');
                    $('.foot_bottom').css('z-index', 4444);
                    $(".dialog").css('z-index', 6000);
                    // 红包优惠券遮罩层弹出
                    $('.black_overlay2').css('display', 'block');
                }
            } else {
                layui.use(['layer', 'laypage', 'element'], function () {
                    var layer = layui.layer;
                    layer.open({
                        title: '提示',
                        content: res.message
                    });
                });
            }
        }
    })
})

// 点击对应课程
$('#lists').on('click', 'li.cons', function (e) {
    $('.try_listen').show(0);
    $('.pause_listen').hide(0);

    var musicUrl = $(this).attr('data-content');
    // 赋值后台返回地址
    $('#musicBox').attr('src', musicUrl);

    // 音乐数组对应的id
    music_index = ($(this).attr('data-chapter-id')) - 1;
    console.log(music_index);

    // 对课程解锁状态进行样式调整,并响应点击事件播放课程
    if ($(this).attr('data-isLock') == 0) {
        $(this).css('color', 'red');
        $(this).siblings().css('color', '#aaa');
        $(this).siblings().removeClass('clicked');
        $(this).siblings('li').find('span.audition').text('待享听');
        $(this).find('span').text('享听中');
        $(this).find('span').removeClass('lock').addClass('audition');
        $('.deBug').css('display', 'none');
        $('.try_listen').show(0);
        $('.pause_listen').hide(0);
        setTimeout(function () {
            musicBox.play();
        }, 0)
    }

    // 未付费点击未解锁课程弹框
    if ($(this).attr('data-isLock') == 1 && status == 0) {
        $('#musicBox').css('display', 'none');
        $('.deBug').css('display', 'block');
        layui.use(['layer', 'laypage', 'element'], function () {
            var layer = layui.layer;
            layer.open({
                title: '提示',
                closeBtn: 0,
                type: 1,
                content: nonPayment,
            });
        });
    }

    // 付费但是未到下周一的用户弹框点击解锁或者未接锁的课程弹框
    else if (status == 1 && res_wait == 1) {
        $('#musicBox').css('display', 'none');
        $('.deBug').css('display', 'block');
        layui.use(['layer', 'laypage', 'element'], function () {
            var layer = layui.layer;
            layer.open({
                title: '提示',
                closeBtn: 0,
                type: 1,
                content: statusReswait1,
            });
        });
    }

    // 付费并且到了下周一时,点击未解锁课程的弹框
    else if ($(this).attr('data-isLock') == 1 && status == 1 && res_wait == 0) {
        $('#musicBox').css('display', 'none');
        $('.deBug').css('display', 'block');
        layui.use(['layer', 'laypage', 'element'], function () {
            var layer = layui.layer;
            layer.open({
                title: '提示',
                closeBtn: 0,
                type: 1,
                content: statusReswait0,
            });
        });
    }

})

// 点击立即报名跳转
$('.tell_now').click(function () {
    location.href = 'payout.html';
});

// 点击模态框逻辑
$('.black_overlay').click(function () {
    $('.dialog').hide(500);
    $('.deBug').css('display', 'none');
    // 红包优惠券窗口下的底部布局
    $('.pack_wrap').css('display', 'none');
    $('.times').css('display', 'none');
    $('.tell').css('display', 'flex');
    $('.tell_now').css('display', 'none');
    $(this).css('display', 'none');
});


// 红包点击事件(点击红包发送给后台一个状态,couponUser,下次进入界面红包优惠券不再弹出)
$('.packCoupon').on('click', 'li.red_packet', function () {
    $.ajax({
        type: 'post',
        url: host + '/index.php/index/index/get_coupon',
        dataType: 'json',
        success: function (res) { }
    });
    // 点击红包,红包层消失,优惠券层弹出
    $('.times').css('display', 'block');
    $(this).css('display', 'none');
    $('.coupon').css('display', 'block');
    // 优惠券文字显示
    $('.discountData').css('display', 'block');
});

// 优惠券点击事件
$('.packCoupon').on('click', 'li.coupon', function () {
    $(this).css('display', 'none');
    // 优惠券文字隐藏
    $('.discountData').css('display', 'none');
    $('.times').css('display', 'none');
    $('.black_overlay2').css('display', 'none');
    $('.black_overlay').css('display', 'block');
    $('.pack_wrap').css('display', 'block');
    $('.foot_bottom').css('z-index', '6666');
    $('.tell').css('display', 'none');
    $('.tell_now').css('display', 'flex');
})

// 自动播放下一曲
musicBox.addEventListener('ended', function () {
    // 对应课程序号加一
    music_index++;
    // 课程是上锁状态
    if ($('.cons').eq(music_index).find('span').hasClass('lock')) {
        --music_index;
        // 是新用户,已支付课程,res_wait=0刚支付未满一周,res_wait=1支付满一周
        if ($('.cons').eq(music_index).attr('data-status') == 1 && res_wait == 0) {
            layui.use(['layer', 'laypage', 'element'], function () {
                var layer = layui.layer;
                layer.open({
                    title: '提示',
                    closeBtn: 0,
                    type: 1,
                    content: statusReswait0,
                });
            });
            musicBox.pause();
            $('.pause_listen').show(0);
            $('.try_listen').hide(0);
        }
        // 用户支付课程后到达下周一
        else if ($('.cons').eq(music_index).attr('data-status') == 1 && res_wait == 1) {
            layui.use(['layer', 'laypage', 'element'], function () {
                var layer = layui.layer;
                layer.open({
                    title: '提示',
                    closeBtn: 0,
                    type: 1,
                    content: statusReswait1,
                });
            });
            musicBox.pause();
            $('.pause_listen').show(0);
            $('.try_listen').hide(0);
        }
        // 用户未支付课程
        else {
            layui.use(['layer', 'laypage', 'element'], function () {
                var layer = layui.layer;
                layer.open({
                    title: '提示',
                    closeBtn: 0,
                    type: 1,
                    content: nonPayment,
                });
            });
            musicBox.pause();
            $('.pause_listen').show(0);
            $('.try_listen').hide(0);
        }
    }
    // 课程开放状态
    else {
        // 课程序号等于课程最大值时从第一个课程开始播放,防止报错.
        if (music_index == music_arry.length) {
            music_index = 0;
        };
        // 课程试听地址自动赋值,自动播放
        musicBox.src = music_arry[music_index];
        musicBox.play();



        $('.try_listen').show(0);
        $('.pause_listen').hide(0);
        // 默认选中的第一节课程样式类名消除
        $('.cons').first().removeClass('clicked');
        // 处理自动选中的课程对应的样式
        $('.cons').eq(music_index).css('color', 'red').siblings().css('color', '#aaa');
        $('.cons').eq(music_index).find('span').text('享听中');
        $('.cons').eq(music_index).siblings('li').find('span.audition').text('待享听');
    }
}, false);

// 优惠券倒计时
$(document).ready(function () {
    var second = parseInt($('#second').text());
    var minute = parseInt($('#minute').text());
    var timer = setInterval(function () {
        if (minute <= 0 && second == 0) {
            clearInterval(timer)
            return;
        };
        if (second == 0) {
            second = 60;
            minute = minute - 1;
            if (minute < 10) {
                minute = '0' + minute;
            }
            $('#minute').text(minute);
        }
        second = second - 1;
        if (second < 10) {
            second = '0' + second;
        }
        $('#second').text(second);
    }, 1000);
});




