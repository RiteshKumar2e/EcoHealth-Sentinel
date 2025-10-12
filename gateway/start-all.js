const { spawn } = require('child_process');

const services = [
  { name: 'FastAPI', cmd: 'python', args: ['main.py'], cwd: '../backend1' },
  { name: 'Node.js', cmd: 'node', args: ['server.js'], cwd: '../backend' },
  { name: 'Gateway', cmd: 'node', args: ['gateway.js'], cwd: '.' }
];

services.forEach(s => {
  const proc = spawn(s.cmd, s.args, { cwd: s.cwd, stdio: 'inherit', shell: true });
  proc.on('error', e => console.error(`${s.name} error:`, e));
});