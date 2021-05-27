//const sendgrid = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
require('dotenv').config();

class EmailService {
  // #sender = sendgrid;
  #sender = nodemailer;
  #GenerateTemplate = Mailgen;
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000';
        break;

      case 'production':
        this.link = 'http://localhost:3000';
        break;

      default:
        this.link = 'http://localhost:3000';
        break;
    }
  }
  #createTemplateVerifyEmail(verifyToken, name) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'cerberus',
      product: {
        name: 'Contacts System',
        link: this.link,
      },
    });
    const email = {
      body: {
        name,
        intro:
          "Welcome to Contacts System! We're very excited to have you on board.",
        action: {
          instructions:
            'To get started with Contacts System, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    };
    const emailBody = mailGenerator.generate(email);
    return emailBody;
  }

  async sendVerifyEmail(verifyToken, email, name) {
    //   this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    //   const msg = {
    //     to: email, // Change to your recipient
    //     from: 'prostoilona@ukr.net', // Change to your verified sender
    //     subject: 'Verify email',
    //     html: this.#createTemplateVerifyEmail(verifyToken, name),
    //   };

    //   this.#sender.send(msg);
    // }

    const config = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: 'gilona@meta.ua',
        pass: process.env.PASSWORD,
      },
    };

    const transporter = this.#sender.createTransport(config);

    const emailOptions = {
      from: 'gilona@meta.ua',
      to: email,
      subject: 'Verify email',
      html: this.#createTemplateVerifyEmail(verifyToken, name),
    };

    await transporter.sendMail(emailOptions);
  }
}

/*Start in terminal  */

// docker-compose up -d --build
module.exports = EmailService;
