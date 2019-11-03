import AgendaService from '../services/agenda';

export default async config => {
  return AgendaService.init(config);
};
