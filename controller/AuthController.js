import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import { transporter } from "../config/EmailSender.js";
import { env } from "process";
import CryptoJS from "crypto-js"

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