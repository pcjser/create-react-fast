#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const semver = require("semver");
const chalk = require("chalk");
const { exec } = require("child_process");
const { program } = require("commander");
const PKGJSON = require("./package.json");
const { exit } = require("process");

chalk.enabled = true;
chalk.level = 1;

// 检验node版本
const checkNodeVersion = () => {
  const requiredVersion = require("./package.json").engines.node;
  const nodeVersion = process.version;
  if (!semver.satisfies(nodeVersion, requiredVersion)) {
    console.log(
      chalk.red("node.js 版本必须满足 " + requiredVersion + " 才能运行本工具")
    );
    exit();
  }
};

// 工具包版本检测
const chekPkgVersion = async () => {
  try {
    const { data, status } = await axios.get(
      "https://registry.npmjs.org/create-react-fast",
      { timeout: 10000 }
    );
    if (status === 200) {
      const latest = data["dist-tags"]["latest"].split(".");
      const current = require("./package.json").version.split(".");
      if (latest[0] !== current[0]) {
        console.log(chalk.cyan("该模块进行了Mayor升级，建议升级后使用"));
      } else if (latest[1] !== current[1] || latest[2] !== current[2]) {
        console.log(chalk.cyan("该模块进行了版本更新，请关注最新版本功能"));
      }
    }
  } catch (e) {}
};

const copyFileSync = (from, to) => {
  const readable = fs.createReadStream(from);
  const writable = fs.createWriteStream(to);
  readable.pipe(writable);
};

const copyDirectorySync = (src, dst) => {
  let paths = fs.readdirSync(src);
  paths.forEach((path) => {
    const _src = `${src}\\${path}`;
    const _dst = `${dst}\\${path}`;
    fs.stat(_src, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        copyFileSync(_src, _dst);
      } else if (stats.isDirectory()) {
        fs.access(_dst, fs.constants.F_OK, (err) => {
          if (err) {
            fs.mkdirSync(_dst);
            copyDirectorySync(_src, _dst);
          } else {
            copyDirectorySync(_src, _dst);
          }
        });
      }
    });
  });
};

const createDirectory = (name, destination, options) => {
  console.log(
    `\n在${process.cwd()}\\${name}中创建一个新项目，文件创建中，请稍后...`
  );

  try {
    fs.mkdirSync(name);
    fs.writeFileSync(
      `${name}/.gitignore`,
      `# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
  
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
  `,
      "utf8"
    );

    if (destination === "empty")
      copyDirectorySync(path.join(__dirname, "/bin/template-empty"), `${name}`);
    if (destination === "base")
      copyDirectorySync(path.join(__dirname, "/bin/template-base"), `${name}`);
    // if (destination === 'admin') copyDirectorySync(path.join(__dirname, 'template-admin'), `${name}`);

    console.log("\n文件创建完成，初始化git仓库中...");

    coreCommand(name, destination, options);
  } catch (e) {
    if (e.code === "EEXIST")
      console.log(
        chalk.red(
          `\n本目录下${name}文件夹已存在，请更改项目名称或者删除文件夹后重试`
        )
      );
    else
      console.log(chalk.red(`\n文件夹系统异常，请稍后再试或联系QQ：201688080`));
    exit();
  }
};

const coreCommand = (name, destination, options) => {
  exec(`cd ${name} && git init`, (error) => {
    if (error) return console.log(chalk.red(error));

    if (options.cnpm)
      console.log(`\ngit仓库初始化完成，使用cnpm安装依赖中，请稍后...\n`);
    else
      console.log(
        `\ngit仓库初始化完成，使用npm安装依赖中，请稍后...(如长时间无法安装完成，请尝试使用-c参数指定cnpm进行包安装)`
      );

    exec(`cd ${name} && ${options.cnpm ? "cnpm" : "npm"} i`, (error, stdout) => {
      if (error) return console.log(chalk.red(error));

      console.log(stdout);

      console.log(`依赖安装完成，仓库初次提交中...`);

      exec(
        `cd ${name} && git add . && git commit -m "Initialize project using Create React Fast"`,
        (error) => {
          if (error) return console.log(chalk.red(error));

          console.log("\n项目初次提交完成");
          console.log(
            `\n项目${name}创建完成，项目路径：${process.cwd()}\\${name}`
          );
          console.log("\n进入文件夹内部，你可以执行以下命令：");
          console.log("\n  npm start");
          console.log("    启动开发服务器.");
          console.log("\n  npm run build");
          console.log("    将项目打包成生产环境的静态文件.");
          console.log("\n  npm run test");
          console.log("    启动项目测试.");
          if (destination === "empty") {
            console.log("\n  npm run eject");
            console.log(
              "    释放项目配置文件和所有的环境依赖，此过程不可逆，请谨慎操作！！！"
            );
          }
          console.log("\n建议你从以下命令开始：");
          console.log(`\n  cd ${name}`);
          console.log(`  npm start`);
          console.log("\n开始你的码字之旅吧~");
        }
      );
    });
  });
};

const startProcess = () => {
  program
    .name("crf")
    .command("create")
    .option("-c, --cnpm", "选择包管理工具使用cnpm")
    .argument("[app-name]", "项目名称", "demo-app") // 增加参数
    .argument(
      "[destination]",
      "选择模板模式可选值为：empty(空)，base(基本)，admin(管理)",
      "empty"
    ) // 增加参数
    .description("基于create-react-fast创建一个项目")
    .action((name, destination, options) => {
      if (!["empty", "base"].includes(destination)) {
        console.log(
          chalk.yellow(
            `\n不支持的模板形式${destination}，请尝试使用empty或者base`
          )
        );
        exit();
      }

      if (options.cnpm) {
        exec("cnpm -v", (error, stdout) => {
          if (error) {
            console.log(
              chalk.yellow("\n检测到系统未装cnpm，正在帮您全局安装cnpm中...")
            );

            exec(
              "npm i cnpm -g --registry=https://registry.npmmirror.com",
              (error) => {
                if (error) throw error;

                console.log("\ncnpm安装完成");
                createDirectory(name, destination, options);
              }
            );
          } else {
            try {
              const version = stdout
                .match(/cnpm(@|.\w+){3}/gi)[0]
                .split("@")[1];
              console.log(chalk.yellow(`\n检测到系统当前cnpm版本为${version}`));

              createDirectory(name, destination, options);
            } catch (err) {
              console.log(chalk.red(err));
            }
          }
        });
      } else {
        createDirectory(name, destination, options);
      }
    });

  program.version(`create-react-fast@${PKGJSON.version}`);

  program.parse(process.argv);
};

checkNodeVersion();
chekPkgVersion();
startProcess();
