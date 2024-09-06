[线上示例](https://alwbg.github.io)

## 工具类
### 1.0.3

- #### 多key异常输出修复 'a,b,c' 只输出 a 的问题

### 1.0.2

- #### 新增 用法

```javascript
/* '*.id=>[]' 检出数组中某个属性列表 */
picker([{ id: 10 }, { id: 20 }], "*.id=>[]", true);
// [ 10, 20 ]

picker({ a: { id: 10 }, b: { id: 20 } }, "*.id=>[]");
// [ 10, 20 ]
```

# **picker**

```javascript
const picker = require("@soei/picker");

// 或

import picker from "@soei/picker";

let data;
```

```javascript
/* :: 用法一 */

// 别名输出
picker(
  {
    a: {
      b: {
        c: "d",
      },
    },
  },
  "a.b.c=>abc,e"
);

// 输出 {abc: 'd'} data.e = undefined 不包含e
```

```javascript
/* :: 用法二 */

// 模糊输出 *=>*
picker(
  {
    a: {
      b: {
        c: "d",
        e: "e",
      },
    },
  },
  "a.b.*=>*"
);

// 输出 {c: 'd', e: 'e'}
```

```javascript
/* :: 用法三 */

// 多查询"|", 优先级和顺序相关[1|2|3]
picker(
  {
    a: {
      b: {
        c: "d",
        e: "e",
      },
    },
    c: 3,
  },
  "a.b.c|c=>c"
);
// 输出 {c: 'd'}
```

```javascript
/* :: 用法四 */

data = [{ n: "d" }, { n: "i" }, { n: "v" }];

picker(data, "n=>name,n=>value");

/* 
输出 
[
  { name: 'd', value: 'd' },
  { name: 'i', value: 'i' },
  { name: 'v', value: 'v' }
]
*/
```

```javascript
/* :: 用法五 */

// node上下文, arguments 对应 node运行时的传参
data = arguments;

// 获取第三个元素的path属性赋值给name输出 获取到当前目录
picker(data, "2.path=>name");

// 输出 { name: '/Users/soei/Storage/npm/@soei/picker' }
```
