const fs = require('fs');
const path = require('path');
const axios = require("axios");
const semver = require("semver");
const { exec } = require('child_process');
const { program } = require('commander');
// 彩色输出
// const chalk = require("chalk");
// const log = console.log;

// 检验node版本
const checkNodeVersion = () => {
  const requiredVersion = require("./package.json").engines.node;
  const nodeVersion = process.version;
  if (!semver.satisfies(nodeVersion, requiredVersion)) {
    console.log("node.js 版本必须满足 " + requiredVersion + " 才能运行本工具");
    return;
  }
}

// 工具包版本检测
const chekPkgVersion = async () => {
  const { data, status } = await axios.get('https://registry.npmjs.org/create-react-fast', { timeout: 1500 });
  if (status === 200) {
    const latest = data["dist-tags"]["latest"].split(".");
    const current = require("./package.json").version.split(".");
    console.log(latest, current);
    if (latest[0] !== current[0]) { // 大版本升级
      // console.log("该模块进行了 Mayor 升级");
    } else if (latest[1] !== current[1] || latest[2] !== current[2]) { // 小版本升级
      // console.log("该模块版本已更新，请升级");
    }
  }
};

// checkNodeVersion()
// chekPkgVersion();

const copyFileSync = (from, to) => {
  from = path.join(__dirname, 'template', from);
  fs.writeFileSync(to, fs.readFileSync(from, 'utf-8'));
}

// 参数配对
program
  .name("crf")
  // .option('-p, --pizza-type <type>', 'flavour of pizza')
  .version(`create-react-fast v${require("./package.json").version}`)
  .command('create <app-name>')
  // .command('create <app-name> [destination]')
  // .argument('[password]', 'password for user, if required', 'no password given')     // 增加参数
  .description('create a new project powered by create-react-fast')
  .action((name, destination) => {
    // console.log(name);
    // console.log(destination);  // 参数

    console.log(`Creating a new React app in ${process.cwd()}\\${name}.`);
    console.log('\nInstalling packages. This might take a couple of minutes.');
    console.log('\nInstalling react, react-dom, and react-scripts with crf-template...');

    const PATH = `./${name}`;

    fs.mkdir(name, () => {
      copyFileSync("package.json", PATH + '/package.json');
      copyFileSync(".gitignore", PATH + '/.gitignore');
      copyFileSync("README.md", PATH + '/README.md');

      fs.mkdir(PATH + '/public', () => {
        copyFileSync("/public/favicon.ico", PATH + '/public/favicon.ico');
        copyFileSync("/public/index.html", PATH + '/public/index.html');
        copyFileSync("/public/logo192.png", PATH + '/public/logo192.png');
        copyFileSync("/public/logo512.png", PATH + '/public/logo512.png');
        copyFileSync("/public/manifest.json", PATH + '/public/manifest.json');
        copyFileSync("/public/robots.txt", PATH + '/public/robots.txt');
      });

      fs.mkdir(PATH + '/src', () => {
        copyFileSync("/src/App.js", PATH + '/src/App.js');
        copyFileSync("/src/App.css", PATH + '/src/App.css');
        copyFileSync("/src/App.test.js", PATH + '/src/App.test.js');
        copyFileSync("/src/index.css", PATH + '/src/index.css');
        copyFileSync("/src/index.js", PATH + '/src/index.js');
        copyFileSync("/src/logo.svg", PATH + '/src/logo.svg');
        copyFileSync("/src/reportWebVitals.js", PATH + '/src/reportWebVitals.js');
        copyFileSync("/src/setupTests.js", PATH + '/src/setupTests.js');
      });

      // 执行命令行
      exec(`cd ${name} && npm i`, (error, stdout, stderr) => {
        if (error) return console.log("error:" + error);
        // console.log("stdout:" + stdout);
        console.log(stderr); // 命令行执行信息

        console.log(`Success! Created ${name} at ${process.cwd()}\\${name}`);
        console.log('Inside that directory, you can run several commands:');
        console.log('\n  npm start');
        console.log('    Starts the development server.');
        console.log('\n  npm run build');
        console.log('    Bundles the app into static files for production.');
        console.log('\n  npm run test');
        console.log('    Starts the test runner.');
        console.log('\n  npm run eject');
        console.log('     Removes this tool and copies build dependencies, configuration files');
        console.log('     and scripts into the app directory. If you do this, you can’t go back!');
        console.log('\nWe suggest that you begin by typing');
        console.log(`\n  cd ${name}`);
        console.log(`  npm start`);
        console.log('\nHappy hacking!');
        console.log('\n');
      });
    });
  });

program.parse(process.argv);