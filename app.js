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

function showResult() {
    var str = '';
    console.log('sad');
    $.each(numbers, function(k, v) {
        console.log(v);


        str += k+' = '+v.code + '; ';
    });
    $('.result').text(str);
}

// remove from global env
var ignore = [],
    numbers =  {},
    tree = [],
    ready1 = false,
    ready2 = false,
    treeDone = false;
function shenonFano(str) {
    console.log('fano begin, str = ', str);
    var str1 = str.slice(0, str.length/2);
    var str2 = str.slice(str.length/2);
    var str1var2 = str.slice(0, (str.length+1)/2);
    var str2var2 = str.slice((str.length+1)/2);
    console.log('сравниваем строки', str1, str1var2);
    console.log('сравниваем строки2', str2, str2var2);
    console.log([str1, str2]);
    var sum11=0,
        sum12=0,
        sum21=0,
        sum22=0;
    for (var i = 0; i <= str1.length - 1; i++) {
        sum11 += numbers[str1[i]].ver;
        //numbers[str1[i]].code += '1';
    };
    for (var i = 0; i <= str1var2.length - 1; i++) {
        sum12 += numbers[str1var2[i]].ver;
        //numbers[str1[i]].code += '1';
    };
   /* for (var i = 0; i <= str2.length - 1; i++) {
        sum21 += numbers[str2[i]].ver;
        //numbers[str2[i]].code += '0';
    };
    for (var i = 0; i <= str2var2.length - 1; i++) {
        sum22 += numbers[str2var2[i]].ver;
        //numbers[str2[i]].code += '0';
    };*/
    console.log('сравниваем строки по суммам. первая половина, вариант 1', str1, sum11);
    console.log('сравниваем строки по суммам. первая половина, вариант 2', str1var2, sum12);
    console.log('сравниваем строки по суммам. вторая половина, вариант 1', str2, sum21);
    console.log('сравниваем строки по суммам. вторая половина, вариант 2', str2var2, sum22);
console.log('сравниваем вариант 1', str1,str2, parseFloat(sum11)+parseFloat(sum21));
console.log('сравниваем вариант 2', str1var2,str2var2, parseFloat(sum12)+parseFloat(sum22));
    /*if( sum11-sum21 < 0 ? (sum11-sum21)*(-1) : (sum11-sum21)   >= sum21-sum22 < 0 ? (sum21-sum22)*(-1) : (sum21-sum22) ) {
        str1 = str1var2;
        str2 = str2var2;
    }*/
    for (var i = 0; i <= str1.length - 1; i++) {
        numbers[str1[i]].code += '1';
    };
    for (var i = 0; i <= str2.length - 1; i++) {
        numbers[str2[i]].code += '0';
    };
    if(str1.length > 1)
        shenonFano(str1);
    else{
        ready1=true;
        if(ready2)
            showResult();
    }
    if(str2.length > 1)
        shenonFano(str2)
    else{
        ready2=true;
        if(ready1)
            showResult();
    }
}

$(function(){
    $('.calc').on('click', function() {
        $('.result').slideDown('200');


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