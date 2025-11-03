const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');

const attrs = [{ name: 'commonName', value: 'localhost' }];
const opts = {
  algorithm: 'sha256',
  days: 3650,
  keySize: 2048,
  extensions: [
    {
      name: 'basicConstraints',
      cA: true,
    },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true,
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
    },
    {
      name: 'subjectAltName',
      altNames: [
        { type: 2, value: 'localhost' }, // DNS
        { type: 7, ip: '127.0.0.1' },
        { type: 7, ip: '0.0.0.0' },
      ],
    },
  ],
};

const p = path.join(__dirname, '..', '.cert');
if (!fs.existsSync(p)) fs.mkdirSync(p);

const { private: key, cert } = selfsigned.generate(attrs, opts);

fs.writeFileSync(path.join(p, 'key.pem'), key);
fs.writeFileSync(path.join(p, 'cert.pem'), cert);

console.log('Generated dev cert at .cert/cert.pem and key at .cert/key.pem');
