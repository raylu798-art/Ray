# Ray / 鹿雷 · AI 产品作品与个人履历

个人作品与简历展示网站，包含 Helms、HelmsKB、ZhiHui 知会的产品介绍、产品思考、落地成果、职业经历与完整简历下载。

当前版本采用悬浮产品卡片首屏：随滚动展开，支持悬停反馈、点击与键盘切换，并适配手机及减少动态效果的系统偏好。

## 目录

- `dist/index.html`：网站内容
- `dist/styles.css`：整站样式与响应式布局
- `dist/app.js`：案例弹窗、场景切换及导航交互
- `dist/hero-stage.css`、`dist/hero-stage.js`：悬浮产品卡片样式与动效
- `dist/assets/`：品牌图标、照片、网站图标和简历 PDF
- `Caddyfile`、`start.command`、`部署说明.txt`：Mac mini 静态站部署文件

HTML、CSS、JavaScript 就是源码，无需构建，也没有 npm 依赖或服务端数据库。

## 本地预览

在仓库根目录运行：

```sh
python3 -m http.server 4175 --bind 127.0.0.1 --directory dist
```

浏览器打开 <http://127.0.0.1:4175>。也可直接打开 `dist/index.html`。

安装了 Node.js 时，可用 `npm start` 启动同一预览；`npm run check` 检查 JavaScript 语法，无需安装依赖。

## Mac mini 部署

目标服务器安装 Caddy 2 后，在仓库根目录运行：

```sh
bash start.command
```

默认监听 8080 端口。详细步骤见 [部署说明](部署说明.txt)。也可以将整个 `dist/` 配置为现有 Web 服务器的静态根目录。

## 产品演示

- [Helms](https://www.helms.wiki)
- [HelmsKB](https://www.kb.helms.wiki)
- [ZhiHui 知会](https://www.zhihui.helms.wiki)

## 维护

修改页面内容与资源后，直接提交对应文件即可。`dist/` 内资源全部使用相对路径，可部署在根目录或子目录。

完整性校验：

```sh
shasum -a 256 -c SHA256SUMS.txt
```

更新文件后，应重新生成校验清单。
