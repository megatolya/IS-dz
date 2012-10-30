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



// remove from global env
var ignore = [],
    numbers =  {},
    tree = [],
    treeDone = false;
function shenonFano(str) {
    console.log(str);
    var str1 = str.slice(0, str.length/2);
    var str2 = str.slice(str.length/2);
    console.log([str1, str2]);
    for (var i = 0; i <= str1.length - 1; i++) {
        var sum = numbers[str1[i]].ver;
        numbers[str1[i]].code += '1';
    };
    for (var i = 0; i <= str2.length - 1; i++) {
        var sum = numbers[str2[i]].ver;
        numbers[str2[i]].code += '0';
    };

}

$(function(){
    $('.calc').on('click', function() {
        $('.result').slideDown('200');


        var str = '';
        var a = $('form').serializeObject();
        $.each(a.val, function(k, v) {
            str += (a.var[k]);

            numbers[a['var'][k]] = {};
            numbers[a['var'][k]].ver = a['val'][k];
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