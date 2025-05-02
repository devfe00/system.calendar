const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'seu-email@gmail.com',
      pass: 'sua-senha-ou-aplicativo-senha',
    },
  });

  const mailOptions = {
    from: 'seu-email@gmail.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
};

module.exports = sendEmail;
