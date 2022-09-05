import iconv from 'iconv-lite';
import os from 'node:os';
import chalk from 'chalk';
import util from 'util';
import { exec } from 'child_process';

/**
 * promise 的方式获取当前连接的网络接口名（WLAN 或以太网）
 * @param {string} codePage  Windows 的活动代码
 * @returns {string[]} 返回当前连接网络的接口名数组，用来获取对应的 ip
 */
const getNetworkProfile = (codePage = '936'): Promise<string[]> =>
  util
    .promisify(exec)('Get-NetConnectionProfile', {
      shell: 'powershell.exe',
      encoding: 'hex',
    })
    .then((networkProfileAns) => {
      const buff = iconv.encode(networkProfileAns.stdout, 'hex');
      const networkProfileReg = /(?<=InterfaceAlias {1,}: )\S*/g;
      const networkProfileStr = iconv.decode(buff, codePage);
      // const RegAns = networkProfileReg.exec(networkProfileStr);
      const RegAns = networkProfileStr.match(networkProfileReg);
      return new Promise((resolve, reject) => {
        if (RegAns) {
          resolve(RegAns);
        } else {
          const errCannotGetNetworkProfile = new Error(
            chalk.whiteBright.bgRed.bold('无法获取网络接口')
          );
          reject(errCannotGetNetworkProfile);
        }
      });
    });

const getNodejsNetwork = () => {
  const str = os.networkInterfaces();
  console.log(str);
};

export { getNetworkProfile, getNodejsNetwork };
