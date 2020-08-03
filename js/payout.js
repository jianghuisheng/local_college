
// 获取用户头像和昵称
$.ajax({
    type: 'post',
    url: 'http://ollege.mrwfg.cn/index.php/index/index/user_info ',
    dataType: 'json',
    data: '',
    success: function (res) {
        if (res.code == 200) {
            // console.log(res);
            $('#user_head').attr('src', res.data.avatar);
            $('#userName').text(res.data.nickname);
        } else {
            layui.use(['layer', 'laypage', 'element'], function () {
                var layer = layui.layer;
                layer.open({
                    title: '提示',
                    closeBtn: 0,
                    type: 1,
                    content: `<div class="layer_wrapper">
                    <div class="layer_content">
                    <p>${res.message}</p>  
                    </div>
                    <div class="layer_footer">
                    <span class="layer_exit" style="margin:5px 30px;"><a class=" layui-layer-close layui-layer-close1" href="javascript:;"style='color: #aaa;position:static'>我知道了</a></span>
                    </div>`
                });
            });
        }
    },
});

var Data = {
    name: '',
    mobile: ''
};

//联系人校验正则
function isPhoneNumber(number) {
    var a = /^13\d{9}|14\d{9}|15\d{9}|16\d{9}|17\d{9}|18\d{9}$/;
    if (!number.match(a)) {
        return false;
    } else {
        return true;
    }
};

$('.pay_now').click(function () {
    Data.name = $("#pay_name").val();
    var tel = $("#pay_mobile").val();
    if (!isPhoneNumber(tel)) {
        alert('请填写正确电话号码!!');
        return;
    } else {
        Data.mobile = tel;
    }

    $.ajax({
        type: 'post',
        url: 'http://ollege.mrwfg.cn/index.php/index/index/sign_name',
        data: Data,
        dataType: 'json',
        success: function (res) {
            layui.use(['layer', 'laypage', 'element'], function () {
                var layer = layui.layer;
                layer.open({
                    title: '提示',
                    content: res.data,
                });
            });
        },

    });

});

//底部价格
$(document).ready(function () {
    $.ajax({
        type: 'post',
        url: 'http://ollege.mrwfg.cn/index.php/index/index/list_1',
        data: '',
        dataType: 'json',
        success: function (res) {
            if (res.code == 200) {
                // 实际支付价格
                $('.currentPrice').text(res.data.price);
                // 押金
                $('.pledgePrice').text(res.data.deposit);
                // 原价
                $('.originPrice').text(res.data.market_price);
                // 折扣价格
                $('.discoutPrice').text(res.data.waiver_rice);
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


