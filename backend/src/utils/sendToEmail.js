import nodemailer from 'nodemailer';


export const sendToEmail = async (email, subject, text) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'doniyorbekyarkinovv@gmail.com',
          pass: 'wievsjqxyvqzawpp', 
        },
      });
  
      const mailOptions = {
        from: 'doniyorbekyarkinovv@gmail.com',
        to: email,
        subject: subject,
        text:text,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent:', info.response);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  