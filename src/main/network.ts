import iconv from 'iconv-lite';
import { exec } from 'child_process';

const defaultCodePage = '936';

const getNetworkProfile = (codePage: string | undefined) => {
  exec(
    'Get-NetConnectionProfile',
    { shell: 'powershell.exe', encoding: 'hex' },
    (error, stdout, stderr) => {
      const buff = iconv.encode(stdout, 'hex');
      console.log(iconv.decode(buff, codePage || defaultCodePage));
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
