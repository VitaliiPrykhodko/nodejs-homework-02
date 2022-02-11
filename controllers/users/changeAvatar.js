const fs = require("fs").promises;
const path = require("path");
const Jimp = require("jimp");

const avatarDir = path.join(__dirname, "../../", "public", "avatars");
const { User } = require("../../models/users");

const changeAvatar = async (req, res, next) => {
  const { path: tempUpload, filename } = req.file;
  const { _id } = req.user;
    
  await Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(250, 250).write(tempUpload);
    })
    .catch((err) => console.error(err));

  try {
    const [extention] = filename.split(".").reverse();
    const newFileName = `${_id}.${extention}`;
    const resultUpload = path.join(avatarDir, newFileName);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", newFileName);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = changeAvatar;
