const cloudinary = require('../cloudinary/cloudinary.config').v2

class Cloudinary {
  uploadPhoto(fileBuffer, folder = '') {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'auto', folder: folder },
          async (error, result) => {
            if (error || !result) {
              reject(new Error('Error while uploading photo'))
            }
            resolve(result)
          }).end(fileBuffer)
    })
  }

  async deletePhoto(name) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(name, async (error, result) => {
        if (error || !result) {
          reject(new Error('Error while deleting photo'))
        }
        resolve(result)
      })
    })
  }
}

module.exports = new Cloudinary()
