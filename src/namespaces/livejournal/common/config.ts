// TODO: LiveJournal Atom feeds declare https://www.livejournal.com and use attributes instead:
// <lj:journal userid username type/> on the feed, <lj:poster user userid/> on entries. Wiring Atom
// needs that URI plus Atom-specific generate functions writing this form, not the RSS elements.
export const uris = [
  'http://www.livejournal.org/rss/lj/1.0/', // Official URI.
  'https://www.livejournal.org/rss/lj/1.0/',
  'http://livejournal.org/rss/lj/1.0/',
  'https://livejournal.org/rss/lj/1.0/',
]

export const stopNodes = [
  '*.lj:music',
  '*.lj:mood',
  '*.lj:security',
  '*.lj:poster',
  '*.lj:posterid',
  '*.lj:journal',
  '*.lj:journalid',
  '*.lj:journaltype',
  '*.lj:replycount',
  '*.lj:reply-count',
]
