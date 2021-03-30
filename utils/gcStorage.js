const fs = require('graceful-fs');
const request = require('request');
const mime = require('mime-types');
const stream = require('stream');

const config = require('../config');
const gcsBucket = require('../firebase/firebase-storage.js');

function GCStorage() {

}

GCStorage.prototype.guid = function () {
  return `${this.s4() + this.s4()}-${this.s4()}-${this.s4()}-${
    this.s4()}-${this.s4()}${this.s4()}${this.s4()}`;
};

GCStorage.prototype.s4 = function () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

GCStorage.prototype.sendUploadToGCS = function (fileData, bucketPath) {
  return new Promise((resolve, reject) => {
    const ext = mime.extension(fileData.mimetype);
    const fileName = `${this.guid()}.${ext}`;
    const storagePath = `${bucketPath}/${fileName}`;
    const gsPath = `gs://${config.bucketStorage}/${storagePath}`;
    const resizeUrl = `https://${config.firebaseProject}.appspot.com/image_url/get?storage_location=${gsPath}`;
    const file = gcsBucket.file(storagePath);

    const writeStream = file.createWriteStream({
      metadata: {
        contentType: fileData.mimetype,
      },
    });

    writeStream.on('error', (err) => {
      console.log('>>stream_error<<', err);
      reject(err);
    });

    writeStream.on('finish', () => {
      request.get({
        url: resizeUrl,
      }, (error, response, body) => {
        console.log('>>finish_error<<', error);
        console.log('>>finish_body<<', body);
        if (!error && response.statusCode === 200) {
          const data = JSON.parse(body);
          const image = {
            image_path: gsPath,
            image_url: data.image_url,
          };
          resolve(image);
        } else {
          reject(error);
        }
      });
    });

    const readStream = fs.createReadStream(fileData.path);
    readStream.pipe(writeStream);
  });
};

GCStorage.prototype.getImageFromUrlAndUploadToGCS = function (imageUrl, bucketPath) {
  return new Promise((resolve, reject) => {
    const self = this;
    request({
      url: imageUrl,
      encoding: null,
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const mimeType = response.headers['content-type'];
        const imageData = body.toString('base64');
        const ext = mime.extension(mimeType);
        const fileName = `${self.guid()}.${ext}`;
        const storagePath = `${bucketPath}/${fileName}`;
        const gsPath = `gs://${config.bucketStorage}/${storagePath}`;
        const resizeUrl = `https://${config.firebaseProject}.appspot.com/image_url/get?storage_location=${gsPath}`;
        const file = gcsBucket.file(storagePath);

        const bufferStream = new stream.PassThrough();
        bufferStream.end(new Buffer(imageData, 'base64'));

        const writeStream = file.createWriteStream({
          metadata: {
            contentType: mimeType,
          },
        });

        writeStream.on('error', (err) => {
          console.log('>>stream_error<<', err);
          reject(err);
        });

        writeStream.on('finish', () => {
          request.get({
            url: resizeUrl,
          }, (error, response, body) => {
            console.log('>>finish_error<<', error);
            console.log('>>finish_body<<', body);
            if (!error && response.statusCode === 200) {
              const data = JSON.parse(body);
              const image = {
                image_path: gsPath,
                image_url: data.image_url,
              };
              resolve(image);
            } else {
              reject(error);
            }
          });
        });

        bufferStream.pipe(writeStream);
      } else {
        reject(error);
      }
    });
  });
};

module.exports = GCStorage;
