import { models as early } from './early.js';
import { models as printing } from './printing.js';
import { models as transport } from './transport.js';
import { models as clamps } from './clamps.js';
import { models as scanners } from './scanners.js';
import { models as optics } from './optics.js';

const records = { ...early, ...printing, ...transport, ...clamps, ...scanners, ...optics };
const startingFigures = {
  US432990A:'2', US450794A:'2', US1829332A:'2', US2227987A:'10', US2248646A:'IV',
  US2741154A:'3', US2824491A:'2', US3746444A:'2', US4145127A:'3', US4774553A:'5',
  US4835555A:'6', US5028956A:'5', US5088813A:'3', US5258807A:'7', US5406352A:'2',
  EP0660170A1:'8', US5461492A:'4', EP0588308B1:'6', US5812245A:'3', US5822045A:'4A',
  EP0935160A1:'6', US6002469A:'2', US6304315B2:'2', US6501530B2:'6A', US7210259B2:'3',
  US20240364825A1:'1',
};
const coverSources = {
  US3574460A:['1'], US3746444A:['1'], US3966320A:['2'], US4145127A:['3'], US4203658A:['1'],
  US4249821A:['1'], US4483612A:['2'], US4761675A:['1'], US4774553A:['1'], US4835555A:['8'],
  US5028956A:['5'], US5088813A:['3'], US5111241A:['1'], US5258807A:['8'], US5406352A:['2'],
  EP0660170A1:['7'], US5461492A:['1'], US5812245A:['2'], US5822045A:['1'], EP0935160A1:['2'],
  US6002469A:['2'], US6020952A:['1'], US6304315B2:['2'], US6501530B2:['11'], US7106480B2:['1','2-1'],
  US7210259B2:['3'],
};

for (const [patent, labels] of Object.entries(coverSources)) {
  const model = records[patent];
  for (const label of labels) {
    const view = model.figures.find((figure) => figure.label === label);
    if (!view) throw new Error('Unknown abstract illustration for ' + patent);
    model.figures.push({ ...view, page: 1, label: label + ' cover' });
  }
}

for (const [id, model] of Object.entries(records)) {
  const label = startingFigures[id];
  model.start = label ? model.figures.findIndex((view) => view.label === label) : 0;
  if (model.start < 0) throw new Error('Unknown starting figure for ' + id);
}

export const getModel = (id) => records[id];
export const modelIds = Object.keys(records);
