import { models as historical } from './historical.js';
import { models as separators } from './separators.js';
import { models as pneumatics } from './pneumatics.js';
import { models as media } from './media.js';
import { models as pickers } from './film-pickers.js';
import { models as modern } from './modern.js';

const records = { ...historical, ...separators, ...pneumatics, ...media, ...pickers, ...modern };
const startingFigures = {
  US571470A:'3', US758453A:'2', US1646681A:'3', US2423404A:'5', US3469834A:'3',
  US3650751A:'1', US3955092A:'drawing', US3966189A:'6', US4179114A:'4', US4239202A:'2',
  US4365793A:'11', US4451028A:'2B', US4627605A:'2', US4979729A:'1',
  EP0521459A1:'drawing', EP0405466B1:'7', EP0512084B1:'3', US5555042A:'6',
  EP0467203B1:'5', EP0750228A1:'8', US6556276B2:'4A', WO2004079448A1:'8',
  EP1267203B1:'5', US6932338B1:'2', WO2007019045A1:'8', EP1197450B1:'3',
  US7654522B2:'6', US7819396B2:'5', EP1721846B1:'8', US7950654B2:'1A',
  US20230202784A1:'2B',
};
for (const [id, model] of Object.entries(records)) {
  const label = startingFigures[id];
  model.start = label ? model.figures.findIndex((view) => view.label === label) : 0;
  if (model.start < 0) throw new Error('Unknown starting figure for ' + id);
}

export const getModel = (id) => records[id];
export const modelIds = Object.keys(records);
