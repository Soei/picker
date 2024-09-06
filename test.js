let picker = require('./index')
var data = {
    apple: 1
}

// console.log(picker(data, 'apple=>ap'))

// data = {
//     a: [{
//         b: {
//             c: "d",
//         },
//     }],
// }
// // 别名输出
// var res = picker(data,
//     "a.0.b.c=>abc"
// );
// console.log(res)

// data = [{ n: "d" }, { n: "i" }, { n: "v" }]
// // 别名输出
// var res = picker(data,
//     "n=>name,n=>value"
// );
// console.log(res)
// // console.log(arguments)
// data = arguments
// // 别名输出
// res = picker(data,
//     "2.path=>name"
// );
// console.log(res)

console.log(
    picker(
        [
            { name: '1px', age: '22px' },
            { name: '3px' },
            { name: '6px' }
        ], 'age', 'number', function(...a) {
            this[1] = 1
            console.log(...a, '000000', this);
        }
    )
)

// console.log(picker({a:1, c: null}, 'c.a=>1'))

// // console.log(picker({a:1, c: true}, '*=>A*'))

// console.log('---------------')

console.log(picker({a:1, c: {a: 1}}, 'c.a=>1'))

// console.log('---------------')

console.log(picker({a:1, c: {a: 1},b: {a: {b:2}}}, 'b.*=>c.*'))

console.log(picker([{id:10}, {id:20}], '*.id=>[]', true))
console.log(picker([{id:10}, {id:20}], '*.id=>id', true))
// console.log(picker([{id:10}, {id:20}], '*.id=>id'))

console.log(picker({a: {id:10}, b:{id:20}}, '*.id=>[]'))