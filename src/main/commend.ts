import util from 'util';
import { exec } from 'child_process';
import chalk from 'chalk';

const hexToAscii = (hex: string) => {
  let ascii = '';
  for (let i = 0; i < hex.length; i += 2)
    ascii += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  return ascii;
};

// row bbeeb6afb4fac2ebd2b33a203933360d0a
// 截取3a20 后的字符
// 根据 windows 使用 chcp 查询 code page 返回的内容，先是本地语言的 active code page
// 然后是: 最后是 code page 的 code

/**
 * 获取 Windows 的 CodePage 代码来协助后续命令行结果的解码
 * @returns {string} 编码代码
 */
const getPageCode = async () => {
  console.log(chalk.bgWhite('获取当前系统的 CodePage 参数'));
  const promiseExex = util.promisify(exec);
  const execRes = await promiseExex('chcp', { encoding: 'hex' });
  const code = hexToAscii(
    execRes.stdout.slice(execRes.stdout.indexOf('3a20') + 4)
  );
  return code;
};

export default getPageCode;
