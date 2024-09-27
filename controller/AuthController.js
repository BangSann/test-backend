import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import { transporter } from "../config/EmailSender.js";
import { env } from "process";
import CryptoJS from "crypto-js";

export const register = async (req, res) => {
  const { nama, username, email, password } = req.body;
  console.log(req.body);
  let result = {
    email: {
      value: email,
      message: null,
    },
  };

  try {
    const uniqueEmail = await User.findOne({
      where: {
        email: email,
      },
    });
    if (uniqueEmail) {
      result.email.message = "Email sudah terdaftar!";
      return res.status(200).json(result);
    }

    const hashPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    const refreshToken = jwt.sign(nama, "8G6qA4ELVy4sBPnt24JK");

    await User.create({
      nama,
      username,
      email,
      password: hashPassword,
      refreshToken,
    });

    const user = await User.findOne({ where: { nama, email } });
    const payload = {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    };
    const token = jwt.sign(payload, "8G6qA4ELVy4sBPnt24JK");
    const link = `${"http://localhost:5173"}/verify?token=${token}`;

    let mailOptions = {
      from: "yosanokta12@gmail.com",
      to: email,
      subject: "Verifikasi Email",
      text: "Verifikasi Email!",
      html: `
            <!DOCTYPE html>
                <html lang="id">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verifikasi Akun</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                margin: 0;
                                padding: 20px;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 20px;
                                border-radius: 10px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                text-align: center;
                                border-bottom: 1px solid #eeeeee;
                                padding-bottom: 20px;
                                margin-bottom: 20px;
                            }
                            .header h1 {
                                font-size: 24px;
                                margin: 0;
                                color: #4CAF50;
                            }
                            .content {
                                line-height: 1.6;
                            }
                            .content p {
                                margin-bottom: 20px;
                            }
                            .button {
                                text-align: center;
                                margin-top: 30px;
                            }
                            .button a {
                                background-color: #4CAF50;
                                color: #ffffff;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                font-weight: bold;
                            }
                            .button a:hover {
                                background-color: #45a049;
                            }
                            .footer {
                                margin-top: 30px;
                                text-align: center;
                                font-size: 12px;
                                color: #777777;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Verifikasi Alamat Email</h1>
                            </div>
                            <div class="content">
                                <p>Halo <strong>${email}</strong>,</p>
                                <p>Terima kasih telah mendaftar di <strong>[Nama Perusahaan/Organisasi]</strong>. Untuk mengaktifkan akun Anda, kami perlu memverifikasi alamat email Anda.</p>
                                <p>Silakan klik tautan di bawah ini untuk memverifikasi email Anda:</p>
                                <div class="button">
                                    <a href="${link}">Verifikasi Email</a>
                                </div>
                                <p>Jika Anda tidak melakukan pendaftaran ini, Anda dapat mengabaikan email ini.</p>
                                <p>Tautan ini akan berlaku selama 24 jam.</p>
                                <p>Jika Anda mengalami kesulitan atau memiliki pertanyaan, jangan ragu untuk menghubungi tim dukungan kami.</p>
                            </div>
                            <div class="footer">
                                <p>Terima kasih,</p>
                                <p><strong>[Nama Perusahaan/Organisasi]</strong></p>
                                <p>[Kontak Dukungan]</p>
                            </div>
                        </div>
                    </body>
                </html>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email terkirim: " + info.response);
        res.status(200).json(randomCode);
      }
    });

    res.status(200).json(result);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

export const verify = async (req, res) => {
  const { token } = req.query;
  const decoded = jwt.verify(token, "8G6qA4ELVy4sBPnt24JK");
  const dateNow = new Date().getTime() / 1000;
  if (dateNow >= decoded.exp)
    return res.status(410).json({ message: "verify is expired" });
  try {
    await User.update({ isActive: 1 }, { where: { id: decoded.id } });
    return res.status(200).json({ message: "berhasil mengaktivasi akun!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  var { credential, password } = req.body;
  credential = credential?.toLowerCase();
  let payload = {};
  try {
    const email = await User.findOne({ where: { email: credential } });
    const username = await User.findOne({ where: { username: credential } });

    if (email) {
      if (email.isActive != 1) {
        return res
          .status(401)
          .json({ message: "Email atau password salah!", status: false });
      }

      const passwordValidateEmail = (password, emailPassword) => {
        const hashedPassword = CryptoJS.SHA256(password).toString(); // Hash the password using SHA256
        return hashedPassword === emailPassword; // Compare the hashed password with the stored hash
      };

      if (!passwordValidateEmail(password, email.password)) {
        return res
          .status(401)
          .json({ message: "Email atau password salah!pass", status: false });
      }
      payload = {
        id: email.id,
        role: email.role,
        refreshToken: email.refreshToken,
      };
    } else if (username) {
      // const passwordValidateUsername = await (
      //   password,
      //   username.password
      // );

      if (username.isActive != 1) {
        return res
          .status(401)
          .json({ message: "Email atau password salah!", status: false });
      }

      if (!passwordValidateEmail(password, username.password)) {
        return res
          .status(401)
          .json({ message: "Email atau password salah!pass", status: false });
      }
      payload = {
        id: username.id,
        role: username.role,
        refreshToken: username.refreshToken,
      };
    } else {
      return res.status(401).json({
        message: "Email atau password salah! Username/pass",
        status: false,
      });
    }

    return res.status(200).json({
      data: {
        id: payload.id,
        status: true,
      },
      token: {
        accessToken: getAccessToken(payload),
        refreshToken: payload.refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
function getAccessToken(user) {
  return jwt.sign({ id: user.id }, "8G6qA4ELVy4sBPnt24JK", {
    expiresIn: "1m",
  });
}

export const isAvailableUsername = async (req, res) => {
  try {
    const result = await User.findAll({
      where: {
        username: req.query.search,
      },
    });
    return res
      .status(200)
      .json({ isAvailable: result.length > 0 ? false : true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const isAvailableEmail = async (req, res) => {
  try {
    const result = await User.findAll({
      where: {
        email: req.query.search,
      },
    });
    return res
      .status(200)
      .json({ isAvailable: result.length > 0 ? false : true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const checkEmail = async (req, res) => {
  try {
    const result = await User.findAll({
      where: {
        email: req.query.search,
      },
    });
    console.log(result);
    return res
      .status(200)
      .json({ checkEmailExists: result.length > 0 ? true : false });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const forgotPasswordForm = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;
  const { id } = jwt.verify(token, "8G6qA4ELVy4sBPnt24JK");

  console.log(id);
  try {
    const hashPassword = CryptoJS.SHA256(newPassword).toString(
      CryptoJS.enc.Hex
    );
    await User.update({ password: hashPassword }, { where: { id } });
    return res.status(200).json({ message: "Berhasil mengganti password" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const forgotPasswordSend = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "Email tidak ditemukan" });
  }

  const payload = {
    id: user.id,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
  };
  const token = jwt.sign(payload, "8G6qA4ELVy4sBPnt24JK");
  const link = `${"http://localhost:5173"}/forgot-password?token=${token}`;

  let mailOptions = {
    from: "yosanokta12@gmail.com",
    to: email,
    subject: "Forgot Password",
    text: "Forgot Password!",
    html: `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    border-bottom: 1px solid #eeeeee;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }
                .header h1 {
                    font-size: 24px;
                    margin: 0;
                    color: #4CAF50;
                }
                .content {
                    line-height: 1.6;
                }
                .content p {
                    margin-bottom: 20px;
                }
                .button {
                    text-align: center;
                    margin-top: 30px;
                }
                .button a {
                    background-color: #4CAF50;
                    color: #ffffff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                }
                .button a:hover {
                    background-color: #45a049;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #777777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Permintaan Reset Password</h1>
                </div>
                <div class="content">
                    <p>Halo <strong>${email}</strong>,</p>
                    <p>Kami menerima permintaan untuk mengatur ulang password akun Anda. Jika Anda tidak melakukan permintaan ini, silakan abaikan email ini.</p>
                    <p>Untuk mengatur ulang password Anda, silakan klik tautan di bawah ini:</p>
                    <div class="button">
                        <a href="${link}">Reset Password</a>
                    </div>
                    <p>Tautan ini akan berlaku selama 24 jam. Setelah itu, Anda perlu mengajukan permintaan reset password lagi.</p>
                    <p>Jika Anda mengalami kesulitan atau memiliki pertanyaan, jangan ragu untuk menghubungi tim dukungan kami.</p>
                </div>
                <div class="footer">
                    <p>Terima kasih,</p>
                    <p><strong>[Nama Perusahaan/Organisasi]</strong></p>
                    <p>[Kontak Dukungan]</p>
                </div>
            </div>
        </body>
        </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email terkirim: " + info.response);
      res.status(200).json({ message: "Email terkirim" });
    }
  });
};

export const refreshNewToken = (req, res) => {
  const refreshToken_user = req.body.refreshToken;
  if (!refreshToken_user) {
    return res.sendStatus(401);
  } else {
    jwt.verify(refreshToken_user, "9IoPkakk89JIKLadsDFT", (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = getAccessToken({ id: user.id });
      return res.status(200).json({ accessToken: accessToken });
    });
  }
};

export const validJWT = (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, "8G6qA4ELVy4sBPnt24JK");
    const dateNow = new Date().getTime() / 1000;
    if (dateNow >= decoded.exp) return res.status(410).json({ status: false });
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({ status: true, message: "Logout success" });
};
