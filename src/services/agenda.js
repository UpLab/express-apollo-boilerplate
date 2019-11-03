import Agenda from 'agenda';
import config from '../config';

class AgendaService {
  init({ mongoConnection }) {
    this.agenda = new Agenda({
      mongo: mongoConnection,
      db: { collection: config.agenda.dbCollection },
      processEvery: config.agenda.pooltime,
      maxConcurrency: config.agenda.concurrency,
    });
  }

  get initialized() {
    return !!this.agenda;
  }

  get instance() {
    if (!this.initialized) {
      throw new Error('Agenda is not initialized. Call init first');
    }
    return this.agenda;
  }
}

export default new AgendaService();
