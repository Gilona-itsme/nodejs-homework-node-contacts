const jwt = require('jsonwebtoken');
const jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
require('dotenv').config();
const User = require('../model/users');
const { HttpCode } = require('../helper/constants');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadToCloud = promisify(cloudinary.uploader.upload);

const signup = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findByEmail(email);
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: '409 Conflict',
      code: HttpCode.CONFLICT,
      message: 'Email in use',
    });
  }
  try {
    const newUser = await User.addUser(req.body);
    return res.status(HttpCode.CREATED).json({
      status: '201 Created',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  const isValidPassword = await user?.validPassword(password);
  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: '401 Unauthorized',
      code: HttpCode.CONFLICT,
      message: 'Email or password is wrong',
    });
  }
  const payload = { id: user.id };
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
  await User.updateToken(user.id, token);
  return res.status(HttpCode.OK).json({
    status: '200 OK',
    code: HttpCode.OK,
    data: {
      token,
      id: user.id,
      email: user.email,
      subscription: user.subscription,
      avatarUrl: user.avatar,
    },
  });
};

const logout = async (req, res, next) => {
  const id = req.user.id;
  try {
    await User.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user) {
      return res.status(HttpCode.OK).json({
        status: '200 OK',
        code: HttpCode.OK,
        data: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: `Not found any contact with id: ${id}`,
        data: 'Not Found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateSubscriptionUser = async (req, res, next) => {
  try {
    const { subscription, id } = req.body;

    const user = await User.updateSubscription(subscription, id);

    if (user) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          user: {
            email: user.email,
            subscription: user.subscription,
          },
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { id, email, subscription } = req.user;
  // const avatarUrl = await saveAvatarUser(req);
  const { idCloudAvatar, avatarUrl } = await saveAvatarUserCloud(req);
  await User.updateAvatar(id, avatarUrl, idCloudAvatar);
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { id, email, subscription, avatarUrl },
  });
};

// const saveAvatarUser = async req => {
//   const FOLDER_AVATARS = process.env.FOLDER_AVATARS;
//   const pathFile = req.file.path;
//   const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`;
//   const img = await jimp.read(pathFile);
//   await img
//     .autocrop()
//     .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
//     .writeAsync(pathFile);
//   try {
//     await fs.rename(
//       pathFile,
//       path.join(process.cwd(), 'public', FOLDER_AVATARS, newNameAvatar),
//     );
//   } catch (e) {
//     console.log(e.message);
//   }
//   const oldAvatar = req.user.avatar;
//   if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
//     fs.unlink(path.join(process.cwd(), 'public', oldAvatar));
//   }
//   return path.join(FOLDER_AVATARS, newNameAvatar).replace('\\', '/');
// };

const saveAvatarUserCloud = async req => {
  const pathFile = req.file.path;

  const { public_id: idCloudAvatar, secure_url: avatarUrl } =
    await uploadToCloud(pathFile, {
      public_id: req.user.idCloudAvatar?.replace('Avatars/', ''),
      folder: 'Avatars',
      transformation: { width: 250, height: 250, crop: 'pad' },
    });
  await fs.unlink(pathFile);
  return { idCloudAvatar, avatarUrl };
};
module.exports = {
  signup,
  login,
  logout,
  getCurrent,
  updateSubscriptionUser,
  updateAvatar,
};
