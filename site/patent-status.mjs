import MarkdownIt from 'markdown-it';

const escape = new MarkdownIt().utils.escapeHtml;
const evidenceLabels = {
  'recorded-event': 'Recorded legal event',
  'ordinary-term': 'Ordinary-term estimate',
  index: 'Patent index',
  unknown: 'Status unconfirmed',
};

export const statusOptions = ['Expired', 'Active', 'Pending', 'Withdrawn', 'Abandoned', 'Unknown'];

export function legalStatusLink(patent) {
  const status = patent.legalStatus;
  if (!status) return '';
  const details = [status.jurisdiction, evidenceLabels[status.basis], 'Checked ' + status.checkedOn];
  if (status.expiresOn) {
    const label = status.expiryBasis === 'recorded' ? 'Expiry' : 'Estimated expiry';
    details.push(label + ' ' + status.expiresOn);
  }
  return '<a class="legal-status" href="' + escape(status.source) + '" title="' +
    escape(details.join(' · ')) + '"><span aria-hidden="true">◷</span> ' + escape(status.status) + '</a>';
}
