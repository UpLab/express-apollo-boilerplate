import basicAuth from 'express-basic-auth';
import agendash from 'agendash';
import config from '../../config';
import AgendaService from '../../services/agenda';

export default ({ app }) => {
  app.use(
    '/dash',
    basicAuth({
      users: {
        [config.agendash.user]: config.agendash.password,
      },
      challenge: true,
    }),
    agendash(AgendaService.instance),
  );
};
