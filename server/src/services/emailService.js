const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saferiskx@gmail.com',
    pass: 'swdj cvki mdjq wtqi'
  }
});

async function sendActivationEmail(to, activationToken) {
  const activationLink = `http://localhost:3000/activate?token=${activationToken}`;
  return transporter.sendMail({
    from: '"SafeRiskX" <saferiskx@gmail.com>',
    to,
    subject: 'Activează-ți contul SafeRiskX',
    html: `
      <h3>Bun venit pe SafeRiskX!</h3>
      <p>Apasă pe linkul de mai jos pentru a-ți activa contul:</p>
      <a href="${activationLink}">${activationLink}</a>
      <p>Dacă nu ai cerut acest cont, ignoră acest email.</p>
    `
  });
}

module.exports = { sendActivationEmail };
