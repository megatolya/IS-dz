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
function nothing() {

}
function findNumber(numberId, graph, str) {
    str = str || '';
    //если нет чисел
    console.log('поиск ...');
     console.log(numberId, graph, str);
    if(graph.ids.length == 0) {
        console.log('0 чисел', graph);
        $(graph.child).each(function (i, childGraph) {
            var index = childGraph.childIds.indexOf(numberId);
            if( index >= 0 ) {
                str += i;
                console.log('перед рекурсией ', numberId, childGraph, str);
                str += findNumber(numberId, childGraph, str);
                return;
            }
            index = childGraph.ids.indexOf(numberId);
            if( index >= 0 ) {
                str += i;
                console.log('перед рекурсией ', numberId, childGraph, str);
                str += findNumber(numberId, childGraph, str);
                return;
            }

        });
        return str;
    }
    //одно число
    if(graph.ids.length == 1) {
        console.log('1 число', graph);
        $(graph.child).each(function (i, childGraph) {
            var index = childGraph.childIds.indexOf(numberId);
            if( index >= 0 ) {

                str += i;
                console.log('перед рекурсией ', numberId, childGraph, str);
                str += findNumber(numberId, childGraph, str);
                return;
            }
        });
        $(graph.ids).each(function (i, id) {
            if( id == numberId ) {

                str += i;
                return;
            }

        });
        return str;
    }
    //2 числа
    if(graph.ids.length == 2) {
        $(graph.ids).each(function (i, id){
            if( id == numberId ) {

                str += i;
                return;
            }
        });
    }
    return str;

}
function findNumbers() {
    var str = '';
    $(numbers).each(function(index, number) {
        str += findNumber(index, tree[0]);
    });
    console.log('result = ', str);
}
function getLowestNumbers (obj){
    var min = obj[0].ver;
    var id = 0;
    var id2 = 0;

    $(obj).each(function(key, v) {
        if (min > v.ver) {
            min = v.ver;
            id = key;
        }
    });
    min = obj[0].ver;

    $(obj).each(function(key, v) {
        if (min > v.ver && key!=id) {
            min = v.ver;
            id2 = key;
        }
    });
    return [id,id2];
}

function Graph(ids, graph, graph2) {
    switch(arguments.length){
        case 1: this.child = null; this.childIds = [];break;
        case 2: this.child = [graph]; this.childIds = [].concat(graph.childIds, graph.ids); break;
        //TODO dont work
        case 3: this.child = [graph, graph2]; this.childIds = [].concat(graph.childIds, graph2.childIds, graph.ids, graph2.ids); break;
    }
    this.ids = ids;

    ignore = ignore.concat(ids);
}
Graph.prototype.getVer = function () {
    //todo 1 число в массиве
    if(this.ids.length == 2)
        return parseFloat(numbers[this.ids[0]].ver) + parseFloat(numbers[this.ids[1]].ver);
    else if(this.ids.length == 1){
        return parseFloat(numbers[this.ids[0]].ver) + this.child[0].getVer();
    } else {
        return this.child[0].getVer() + this.child[1].getVer();
    }
}

// remove from global env
var ignore = [],
    numbers = [],
    tree = [],
    treeDone = false;
function findMin() {
    var graphMinVer1 = 1;
    var graphMinVer2 = 1;
    var graphMinVerId1 = -1;
    var graphMinVerId2 = -1;
    if(tree.length > 1) {

        $(tree).each(function(index, graph) {
            if(graph.getVer() < graphMinVer1){
                graphMinVer1 = graph.getVer();
                graphMinVerId1 = index;
            }
        });
        $(tree).each(function(index, graph) {
            nothing('graph min2', index, graph);
            if(graph.getVer()<graphMinVer2 && index != graphMinVerId1){
                graphMinVer2 = graph.getVer();
                graphMinVerId2 = index;
            }
        });
    } else {
        graphMinVer1 = tree[0].getVer();
        graphMinVerId1 = 0;
    }
    var numberMinVer1 = 1;
    var numberMinVer2 = 1;
    var numberMinVerId1 = -1;
    var numberMinVerId2 = -1;
    $(numbers).each(function(index, number) {
        if((number.ver < numberMinVer1) && (ignore.indexOf(index)==-1)) {
            numberMinVer1 = number.ver;
            numberMinVerId1 = index;
        }
    });
    $(numbers).each(function(index, number) {
        if((number.ver < numberMinVer2) && (ignore.indexOf(index)==-1) && index != numberMinVerId1) {
            numberMinVer2 = number.ver;
            numberMinVerId2 = index;
        }
    });
    //объект содержит 2 мин от графов и 2 от чисел

    var versObj = [
                    {
                        type:'graph',
                        id: graphMinVerId1,
                        value: +graphMinVer1
                    },
                    {
                        type:( graphMinVer2 == 1 ? 'none' : 'graph' ),
                        id: graphMinVerId2,
                        value: +graphMinVer2
                    },
                    {
                        type:( numberMinVer1 == 1 ? 'none' : 'number' ),
                        id: numberMinVerId1,
                        value: +numberMinVer1
                    },
                    {
                        type:( numberMinVer2 == 1 ? 'none' : 'number' ),
                        id: numberMinVerId2,
                        value: +numberMinVer2
                    }
                ];
    nothing('versObj', versObj);
    var minVer1 = 1;
    var minVer2 = 1;
    var minVerId1 = -1;
    var minVerId2 = -1;
    var minVerType1 = '';
    var minVerType2 = '';
    $(versObj).each(function(index, obj) {
        if(obj.type != 'none' && obj.value < minVer1 ){
            minVer1 = obj.value;
            minVerId1 = obj.id;
            minVerType1 = obj.type;
        }
    });
    $(versObj).each(function(index, obj) {
        if(obj.type != 'none' && obj.value < minVer2 && obj.id!=minVerId1 ){
            minVer2 = obj.value;
            minVerId2 = obj.id;
            minVerType2 = obj.type;
        }
    });

    var finalRes = [
                    {
                        value:minVer1,
                        id:minVerId1,
                        type:minVerType1
                    },
                    {
                        value:minVer2,
                        id:minVerId2,
                        type:minVerType2
                    }
                ];
nothing('-------------------------');
nothing('finalRes', finalRes);

    //если число и граф
    if((finalRes[0].type == 'graph') && (finalRes[1].type == 'number')) {

        tree[finalRes[0].id] = new Graph([ finalRes[1].id ], tree[finalRes[0].id]);
        nothing('добавили к графу', tree[finalRes[0].id]);

    }
    if((finalRes[1].type == 'graph') && (finalRes[0].type == 'number')) {
        tree[finalRes[1].id] = new Graph([ finalRes[0].id ], tree[finalRes[1].id]);
        ignore.push(finalRes[0].id);
    }

    //два числа
    if((finalRes[1].type == 'number') && (finalRes[0].type == 'number')) {

        tree.push(new Graph([finalRes[0].id, finalRes[1].id]));
    }

    //два графа
    if((finalRes[1].type == 'graph') && (finalRes[0].type == 'graph')) {
        nothing('ДЕРЕВО ПОСТРОЕНО');
        tree.push(new Graph([], tree[finalRes[0].id], tree[finalRes[1].id]));
        //TODO проверить какой id больше, с того и отрезать!!!
        tree.splice(finalRes[0].id,1);
        tree.splice(finalRes[1].id-1,1);
        if(ignore.length == numbers.length) {

            nothing('++++++++++ все!');
            treeDone = true;
            findNumbers();
            return;
        } else {
            alert('goto 204');
        }
    }
    nothing('ignore', ignore);
    nothing('numbers', numbers);
    nothing('tree', tree);
}

$(function(){

    var a = $('form').serializeObject();

    $.each(a.val, function(k, v) {
        numbers[k] = {};
        numbers[k].ver = a['val'][k];
        numbers[k].num = a['var'][k];
    });
    tree = [ new Graph(getLowestNumbers(numbers))];
    while (!treeDone) {
        findMin();
    };





    $('button').click(function() {
        return false;
    });
});