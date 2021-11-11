const fs = require('fs');
const path = require('path');
const axios = require("axios");
const semver = require("semver");
// const chalk = require("chalk");
const { exec } = require('child_process');
const { program } = require('commander');
const PKGJSON = require("./package.json");

let management = 'npm';

// 检验node版本
// const checkNodeVersion = () => {
//   const requiredVersion = require("./package.json").engines.node;
//   const nodeVersion = process.version;
//   if (!semver.satisfies(nodeVersion, requiredVersion)) {
//     console.log("node.js 版本必须满足 " + requiredVersion + " 才能运行本工具");
//     return;
//   }
// }

// 工具包版本检测
// const chekPkgVersion = async () => {
//   const { data, status } = await axios.get('https://registry.npmjs.org/create-react-fast', { timeout: 1500 });
//   if (status === 200) {
//     const latest = data["dist-tags"]["latest"].split(".");
//     const current = require("./package.json").version.split(".");
//     console.log(latest, current);
//     if (latest[0] !== current[0]) { // 大版本升级
//       // console.log("该模块进行了 Mayor 升级");
//     } else if (latest[1] !== current[1] || latest[2] !== current[2]) { // 小版本升级
//       // console.log("该模块版本已更新，请升级");
//     }
//   }
// };

// checkNodeVersion()
// chekPkgVersion();

const copyFileSync = (from, to) => {
  const readable = fs.createReadStream(from);
  const writable = fs.createWriteStream(to);
  readable.pipe(writable);
}

const copyDirectorySync = (src, dst) => {
  let paths = fs.readdirSync(src);
  paths.forEach(path => {
    const _src = `${src}\\${path}`;
    const _dst = `${dst}\\${path}`;
    fs.stat(_src, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        copyFileSync(_src, _dst);
      } else if (stats.isDirectory()) {
        fs.access(_dst, fs.constants.F_OK, err => {
          if (err) {
            fs.mkdirSync(_dst);
            copyDirectorySync(_src, _dst);
          } else {
            copyDirectorySync(_src, _dst);
          }
        })
      }
    })
  })
}

const createProject = (name, destination, options) => {
  console.log(`\n在${process.cwd()}\\${name}中创建一个新项目，文件创建中，请稍后...`);

  fs.mkdirSync(name);

  if (destination === 'empty') copyDirectorySync(path.join(__dirname, 'template-empty'), `${name}`);
  if (destination === 'base') copyDirectorySync(path.join(__dirname, 'template-base'), `${name}`);
  // if (destination === 'admin') copyDirectorySync(path.join(__dirname, 'template-admin'), `${name}`);

  console.log('\n文件创建完成，初始化git仓库中...');

  exec(`cd ${name} && git init`, error => {
    if (error) return console.log("error:" + error);

    if (options.cnpm) console.log(`\ngit仓库初始化完成，使用cnpm安装依赖中，请稍后...`);
    else console.log(`\ngit仓库初始化完成，使用npm安装依赖中，请稍后...(如长时间无法安装完成，请尝试使用cnpm)`);

    exec(`cd ${name} && ${management} i`, error => {
      if (error) return console.log("error:" + error);

      console.log(`依赖安装完成，仓库初次提交中...`);

      exec(`cd ${name} && git add . && git commit -m "Initialize project using Create React Fast"`, error => {
        if (error) return console.log("error:" + error);

        console.log('项目初次提交完成');
        console.log(`\n项目${name}创建完成，项目路径：${process.cwd()}\\${name}`);
        console.log('\n进入文件夹内部，你可以执行以下命令：');
        console.log('\n  npm start');
        console.log('    启动开发服务器.');
        console.log('\n  npm run build');
        console.log('    将项目打包成生产环境的静态文件.');
        console.log('\n  npm run test');
        console.log('    启动项目测试.');
        if (destination === 'empty') {
          console.log('\n  npm run eject');
          console.log('    释放项目配置文件和所有的环境依赖，此过程不可逆，请谨慎操作！！！');
        }
        console.log('\n建议你从以下命令开始：');
        console.log(`\n  cd ${name}`);
        console.log(`  npm start`);
        console.log('\n开始你的码字之旅吧~');
      })
    })
  });
}

program
  .name("crf")
  .command('create')
  .option('-c, --cnpm', '选择包管理工具使用cnpm')
  .argument('[app-name]', '项目名称', 'demo-app')     // 增加参数
  .argument('[destination]', '选择模板模式可选值为：empty(空)，base(基本)，admin(管理)', 'empty')     // 增加参数
  .description('基于create-react-fast创建一个项目')
  .action((name, destination, options) => {

    if (!['empty', 'base'].includes(destination)) {
      console.log(`\n不支持的模板形式${destination}，请尝试使用empty或者base`);
      process.exit();
    }

    if (options.cnpm) {

      management = 'cnpm';

      exec('cnpm -v', (error, stdout) => {
        if (error) {
          console.log('\n检测到系统未装cnpm，正在帮您全局安装cnpm中...');

          exec('npm i cnpm -g --registry=https://registry.npmmirror.com', error => {
            if (error) throw error;

            console.log('\ncnpm安装完成');
            createProject(name, destination, options);
          })
        } else {
          try {
            const version = stdout.match(/cnpm(@|.\w+){3}/ig)[0].split('@')[1];
            console.log(`\n检测到系统当前cnpm版本为${version}`);

            createProject(name, destination, options);
          } catch (err) { console.log(err); }
        }
      })
    }
  });

program
  .version(`create-react-fast@${PKGJSON.version}`);

program.parse(process.argv);