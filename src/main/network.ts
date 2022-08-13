import iconv from 'iconv-lite';
import { exec } from 'child_process';

const getNetworkProfile = () => {
  exec(
    'Get-NetConnectionProfile',
    { shell: 'powershell.exe', encoding: 'hex' },
    (error, stdout, stderr) => {
      const buff = iconv.encode(stdout, 'hex');
      console.log(iconv.decode(buff, '936'));
    }
  );
};

const setNetworkProfile = () => {
  exec(
    'Get-NetConnectionProfile',
    { shell: 'powershell.exe', encoding: '936' },
    (error, stdout, stderr) => {
      console.log(iconv.decode(stdout, '936'));
    }
  );
};

export { getNetworkProfile, setNetworkProfile };
