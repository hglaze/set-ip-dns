/* eslint global-require: off, no-console: off, promise/always-return: off */
const iconv = require('iconv-lite');
const { exec } = require('node:child_process');
const console = require('node:console');

// exec(
//   'echo 你好',
//   { shell: 'powershell.exe', encoding: 'hex' },
//   (error, stdout, stderr) => {
//     console.log(stdout);
//     const buff = iconv.encode(stdout, 'hex');
//     console.log(iconv.decode(buff, '936'));
//   }
// );

// const com = `For /F Tokens^=6^ Delims^=^" %G In ('%SystemRoot%\\System32\\wbem\\WMIC.exe /NameSpace:\\\\Root\\StandardCimv2 Path MSFT_NetConnectionProfile Where "IPv4Connectivity='4'" Get Name /Format:MOF 2^>NUL') Do @Echo %G`;
// exec(com, { shell: 'cmd.exe', encoding: 'hex' }, (error, stdout, stderr) => {
//   const buff = iconv.encode(stdout, 'hex');
//   console.log(iconv.decode(buff, '936'));
// });

// exec(
//   'echo 你好',
//   { shell: 'powershell.exe', encoding: '936' },
//   (error, stdout) => {
//     console.log(iconv.decode(stdout, '936'));
//   }
// );

exec(
  'Get-NetConnectionProfile',
  { shell: 'powershell.exe', encoding: '936' },
  (error, stdout, stderr) => {
    console.log(iconv.decode(stdout, '936'));
  }
);
