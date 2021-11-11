# Create React Fast

Create React Fast with no build configuration.

- [Creating an App](#creating-an-app) – How to create a new app.


Create React App works on macOS, Windows, and Linux.
If something doesn’t work, please [file an issue](https://github.com/pcjser/create-react-fast/issues/new).
If you have questions or need help, please ask in [GitHub Discussions](https://github.com/pcjser/create-react-fast/discussions).

## 功能预览

```sh
npm/cnpm install create-react-fast -g

crf create

cd demo-app

npm start
```

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.
When you’re ready to deploy to production, create a minified bundle with `npm run build`.

### 立即开始使用

You **don’t** need to install or configure tools like webpack or Babel.
They are preconfigured and hidden so that you can focus on the code.

Create a project, and you’re good to go.

## 创建一个项目

**You’ll need to have Node 14.0.0 or later version on your local development machine** (but it’s not required on the server). We recommend using the latest LTS version. You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

To create a new app, you may choose one of the following methods:

### 安装

```sh
npm/cnpm install create-react-fast -g
```

### crf

```sh
crf create [options] [app-name] [destination]
```

#### app-name
项目名称，默认值为app-demo

#### options
初始化参数
- -c: 使用cnpm包管理工具安装依赖，当网络环境不好时可使用此参数

#### destination
项目初始化风格，默认值为empty
- empty: 项目内包含核心文件，无其它依赖安装
- base: 项目集成react-router-dom@5、antd、sass、moment，无需更多安装，开袋即食
- admin: 快速构建后台管理系统，开发中，暂未开放

### 其它命令

```sh
crf -V  // 查看当前版本
crf -h  // 查看帮助信息
crf create -h // 查看create命令帮助信息
```

No configuration or complicated folder structures, only the files you need to build your app.
Once the installation is done, you can open your project folder:

```sh
cd app-name
```

Inside the newly created project, you can run some built-in commands:

### `npm start`

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will automatically reload if you make changes to the code.
You will see the build errors and lint warnings in the console.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed.

## License

Create React App is open source software [licensed as MIT](https://github.com/pcjser/create-react-fast/blob/main/LICENSE). The Create React App logo is licensed under a [Creative Commons Attribution 4.0 International license](https://creativecommons.org/licenses/by/4.0/).