let {
    isArray,
    isNil,
    isString,
    merge,
    iSplit,
    each,
    runer: iRuner,
    isEmpty,
    iPickNumber,
    isNumber,
    isFunction,
    isSimplyType
} = require('@soei/tools');

var ALL = "*",
    r_MULTI_SEL = /(?:\,|\|{2})/,
    r_RE_KEY = /=>/,
    DOT = '.', Nil;

/**
 * 获取链式调用的末端数据
 * @param {String} line 链式 a.b.c.v
 * @param {Object} context 上下文
 * @param {Object} def 默认值
 * @param {Boolean} isArr 是否已数组输出
 */
function iGetDataByLine(line, context, def, isArr) {
    context || (context = {});
    /* 拆分 'x.x.x.name' to ['x','x','x','name'] */
    var ls = iSplit(line, DOT),
        end = ls.pop();
    end == ALL && (ls.push(end), end = Nil);
    var ret = each(ls, function (_, v, create, end) {
        /* 处理包含 * 的规则  */
        if (v == ALL) {
            var data = {};
            each(context,
                /* 处理方法 */
                isArr ? function (k, v, data, key) {
                    data.push(v[key]);
                } : function (k, v, data, key) {
                    (key && v[key] == Nil) || (data[k] = key ? v[key] : v);
                },
                /* 初始化返回类型 */
                data[end] = isArr ? [] : {},
                end
            );
            return context = data;
        }
        _ = context[v];
        if (!create && isSimplyType(_)) {
            return true;
        } else if (isSimplyType(_)) {
            context = (context[v] = {});
        } else {
            context = _;
        }
    }, def === false ? (
        def = Nil, false
    ) : true, end)
    return ret === true ?
        Nil
        :
        def == Nil ? context[end] : (context[end] || (context[end] = def));
}

/**
 * 循环
 * @Time   2019-11-07
 * @param  {Number}   _    索引
 * @param  {Object}   simply 对象
 * @param  {Array}   rule   规则
 * @param  {Array}   picker 携带筛选后的对象列表   
 */
function iPickByRule(_, simply, rule, picker, type, filter) {
    var source = iMultiOrReKeys(rule, function (v, i, name, data) {
        var iChange, isAllPick = name.match(/(?:(?:(.*).|)\*$|\*\.)/);
        // 处理 data.*=>own.* 其中*是被复制
        isAllPick && (iChange = isAllPick[1]) && (data = iGetDataByLine(iChange, data, {}));
        var isReturnArray = /\[\]/.test(name);
        i = iGetDataByLine(v, simply, false, isReturnArray);
        /* 如果是数组,则直接返回 */
        if (isReturnArray) return i;
        if (isAllPick) return merge(data, i || simply), Nil;
        // if (i === SPACE) i = Nil;
        // 按照顺序获取直到找到存在的对应key
        if (!isNil(i)) {
            var fi = iRuner(iPickNumber[type && type[name] || type], Nil, i), rData, iFiDate;
            i = isNumber(fi) ? fi : isNil(fi) ? i : Nil;
            iFiDate = isNil(rData = iRuner(filter, data, name, i, +this));
            if (!(isNil(i) && iFiDate)) data[name] = iFiDate ? i : rData;
            return true;
        }
    }, _);
    isNil(source) || picker.push(source);
}

function formatPickerRule(picker) {
    return picker.replace(/((?:^|,)(?:(?!\=\>|,).)*(\*)(?=,|$))/g, '$1=>$2');
}
function iMultiOrReKeys(rule, filter, context) {
    var rain = {};
    // 遍历规则
    var list = each(
        isArray(rule)
            ? rule
            : iSplit(formatPickerRule(rule.toString()), r_MULTI_SEL),
        iForEachUse
        , rain, filter, context);
    return isEmpty(rain) ? isEmpty(list) ? Nil : list : rain;
}
function iForEachUse(_, value, rain, filter, context) {
    // 获取输出key (key1;key2)=>key
    value = iSplit(value, r_RE_KEY);
    /* [key1,key2] */
    var keys = iSplit(value[0]);
    // 遍历keys列表
    var ret = each(
        keys,
        function (i, v, value, filter, data, length, context) {
            return iRuner(filter, context, v, i, isNil(value) ? v : value, data, i + 1 == length /* if is last element */);
        },
        value[1], filter, rain, keys.length, context
    );
    return ret === true ? Nil : ret
}

/**
 * 提取指定属性名称的值
 * @Time  2018-11-15
 * @param {Object}   source 源数据
 * @param {String}   rule   要提取的列表
 * @param {String|Boolean}   type   number|int|float  true? 遍历数组索引
 * @param {Function}   filter   过滤函数
 */
function iPicker(source, rule, type, filter) {
    if (rule == ALL) return source;
    var trigger;
    if (isFunction(type)) {
        filter = type;
        type = null;
    }
    if (isArray(rule)) {
        rule = rule.join(DOT);
        trigger = rule;
    } else if (!isString(rule) || isEmpty(source)) return {};
    var rainbox = [],
        isArr = !(type === true || filter === true) && isArray(source), data;
    isArr || (source = [source]);
    // 遍历队列
    each(source, iPickByRule, rule, rainbox, type, filter);
    data = isArr ? rainbox : rainbox.pop() || {};
    return trigger ? data[trigger] : data;
}

module.exports = iPicker;