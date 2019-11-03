import mailgun from 'mailgun-js';
import config from '../config';

class MailerService {
  constructor() {
    this.emailClient = mailgun({ apiKey: config.emails.apiKey, domain: config.emails.domain });
  }

  async sendWelcomeEmail(email) {
    const data = {
      from: config.emails.from,
      to: email,
      subject: 'Hello',
      text: 'Testing some Mailgun awesomness!',
    };
    await this.emailClient.messages().send(data);
    return { delivered: 1, status: 'ok' };
  }

  // eslint-disable-next-line class-methods-use-this
  startEmailSequence(sequence, user) {
    if (!user.email) {
      throw new Error('No email provided');
    }
    // @TODO Add example of an email sequence implementation
    // Something like
    // 1 - Send first email of the sequence
    // 2 - Save the step of the sequence in database
    // 3 - Schedule job for second email in 1-3 days or whatever
    // Every sequence can have its own behavior so maybe
    // the pattern Chain of Responsibility can help here.
    return { delivered: 1, status: 'ok' };
  }
}

export default new MailerService();
