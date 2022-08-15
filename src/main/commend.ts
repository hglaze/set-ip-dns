import util from 'util';
import { exec } from 'child_process';

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

const getPageCode = async () => {
  const promiseExex = util.promisify(exec);
  const execRes = await promiseExex('chcp', { encoding: 'hex' });
  const code = hexToAscii(
    execRes.stdout.slice(execRes.stdout.indexOf('3a20') + 4)
  );
  return code;
};

export default getPageCode;
