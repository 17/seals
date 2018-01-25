# 已失效，API 已被关闭 
# Seals

![Seals](http://i.imgur.com/bJZzxwF.jpg)
一个 electron/vue 小练手，它能帮你备份在 QQ 云端的聊天记录。

**使用前你要需要**
* QQ 会员
* 漫游全部好友
* 下载最新的 [releases](https://github.com/17/seals/releases)

**怎么使用**
* 打开 [electron](https://github.com/electron/electron#downloads) 后，将 `seals.asar` 拖进窗口
* `npm install electron-prebuilt -g` > `electron seals.asar`

## 保存细节
数据使用 sqlite 保存，图片保存在 media 文件夹下

**表结构**
```
CREATE TABLE message ("time" DATETIME, "from" INT, "to" INT, "content" TEXT, " media" TEXT)
```

* `time` unix 时间戳
* `from` 发送人
* `to` 接受人
* `content` 消息内容，JSON 数组
* `media` JSON 对象，保存原始 media 数据（一般无需读取）

**消息类型**
* `0` 文字
* `1` QQ 自带表情（URL）
* `2` URL 图片 / 自定义表情（失效图片）
* `3` UUID 图片 / 自定义表情（默认会下载到 media 目录）

**解析伪代码**
``` javascript
let text = []
for (const slice of content) {
  switch (slice.type) {
    case 0:
      text.push(slice.value)
      break
    case 1:
      text.push(`<img src="${slice.value}">`)
      break
    case 2:
      text.push('[失效图片]')
      break
    case 3:
      // 已保存的图片
      text.push('<img src="./media/${slice.value}">')
      break
    default:
      break
  }
}
```

## TODO
- [ ] 偷懒的动画 or 图标补上
- [ ] 用 vuex 重构 ~~妈的没看到~~
- [ ] webpack 热重载莫名工作不能...
- [ ] 自动化 release

## License
MIT
