$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function findTree(key, code) {
    console.log(key, code);
    var selector = '';
    code = code.split('');
    $(code).each(function(k, v) {
        if(k==code.length-1) {
            if(v=='1') {
                selector += '.one';
            } else {
                selector += '.zero';
            }
            return;
        } else {
            if(v=='1') {
                selector += '.one_child>';
            } else {
                selector += '.zero_child>';
            }
        }
    });
    $('.tree>'+selector).html('<span class="tree_number">'+key+'</span>').addClass('hasNum');
}
function makeTree(node, count) {
    count--;
    var html = Mustache.render($('#tree').html());
    node.html(html);
    if(count>0) {
        makeTree(node.find('.zero_child'), count);
        makeTree(node.find('.one_child'), count);
    }
}

function showResult() {
    var str = '';
    var max = 0;
    var sum = 0;
    $.each(numbers, function(k,v) {
        sum+=v.ver;
    });
    $.each(numbers, function(k, v) {
        if(v.code.length>max)
            max = v.code.length;
        
        var ver = v.code.length*(v.ver/sum);
        str += '<span class="result__number">'+k+' = '+v.code + ', вероятность: '+ver+'</span>';
    });

    $('.result').html(str).fadeIn(300, function() {
        console.log('Готово');
        makeTree($('.tree'), max);
        $('.tree').fadeIn(200);
        setTimeout(function() {

            $.each(numbers, function(k, v) {
                findTree(k, v.code);
            });
        }, 2000);
        setTimeout(function() {
            $('.zero_child, .one_child').each(function(k, v) {
                if($(v).find('.hasNum').length==0) {
                    $(v).html('');
                }
            });
        }, 4000);
    });
}

// remove from global env
var ignore = [],
    numbers =  {},
    tree = [],
    ready1 = false,
    ready2 = false,
    treeDone = false;
function shenonFano(str) {
    console.log('получили строку: ', str);
    var str1 = str.slice(0, str.length/2);
    var str2 = str.slice(str.length/2);
    var str1var2 = str.slice(0, (str.length+1)/2);
    var str2var2 = str.slice((str.length+1)/2);
    console.log('строка после разбиения', [str1, str2]);
    var sum11=0,
        sum12=0,
        sum21=0,
        sum22=0;
    //считаем суммы вероятностей для 2х вариантов
    for (var i = 0; i <= str1.length - 1; i++) {
        sum11 += numbers[str1[i]].ver;
    };
    for (var i = 0; i <= str1var2.length - 1; i++) {
        sum12 += numbers[str1var2[i]].ver;
    };
    for (var i = 0; i <= str2.length - 1; i++) {
        sum21 += numbers[str2[i]].ver;
    };
    for (var i = 0; i <= str2var2.length - 1; i++) {
        sum22 += numbers[str2var2[i]].ver;
    };
    console.log('сравниваем строки по суммам. первая половина, вариант 1', str1, sum11);
    console.log('сравниваем строки по суммам. вторая половина, вариант 1', str2, sum21);
    console.log('сравниваем строки по суммам. первая половина, вариант 2', str1var2, sum12);
    console.log('сравниваем строки по суммам. вторая половина, вариант 2', str2var2, sum22);
    var testSum1 = sum11-sum21;
    testSum1 = Math.abs(testSum1);
    console.log('тестовая разница в варианте 1', testSum1);
    var testSum2 = sum12-sum22;
    testSum2 = Math.abs(testSum2);
    console.log('тестовая разница в варианте 2', testSum2);

    if(testSum2 < testSum1) {
        str1 = str1var2;
        str2 = str2var2;
        console.log('выбираем 2 вариант');
    } else {
        console.log('выбираем 1 вариант');
    }

    //записываем код в глобальный массив чисел
    for (var i = 0; i <= str1.length - 1; i++) {
        numbers[str1[i]].code += '1';
    };
    for (var i = 0; i <= str2.length - 1; i++) {
        numbers[str2[i]].code += '0';
    };
    if(str1.length > 1)
        shenonFano(str1);
    else{
        //подстрока кончилась
        ready1=true;
        if(ready2)
            showResult();
    }
    if(str2.length > 1)
        shenonFano(str2)
    else{
        //подстрока кончилась
        ready2=true;
        if(ready1)
            showResult();
    }
}

$(function(){
    $('.calc').on('click', function() {
        ignore = [];
        numbers =  {};
        tree = [];
        ready1 = false;
        ready2 = false;
        treeDone = false;
        var str = '';
        var a = $('form').serializeObject();
        $.each(a.val, function(k, v) {
            str += (a.var[k]);

            numbers[a['var'][k]] = {};
            numbers[a['var'][k]].ver = parseFloat(a['val'][k]);
            numbers[a['var'][k]].code = '';
        });
        shenonFano(str);
    });

    $('form')
        .on('click', '.remove', function(e) {
            e.preventDefault();
            $(this).parent().hide(200, function() {$(this).remove();});

        })
        .on('click', '.add', function(e) {
            e.preventDefault();
            var html = Mustache.render($('#input-row').html());
          $(this).parent()
              .after(html)
              .hide()
              .show(200);

        });


});