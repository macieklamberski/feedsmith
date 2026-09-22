export const uris = [
  'http://www.livejournal.org/rss/lj/1.0/', // Official URI.
  'https://www.livejournal.org/rss/lj/1.0/',
  'http://livejournal.org/rss/lj/1.0/',
  'https://livejournal.org/rss/lj/1.0/',
  'https://www.livejournal.com', // Atom feeds
]

// LiveJournal Atom feeds declare a different URI than its RSS feeds.
export const atomUris = ['https://www.livejournal.com']

export const stopNodes = [
  '*.lj:music',
  '*.lj:mood',
  '*.lj:security',
  '*.lj:poster',
  '*.lj:posterid',
  '*.lj:posterurl',
  '*.lj:posteruserpic',
  '*.lj:journal',
  '*.lj:journalid',
  '*.lj:journaltype',
  '*.lj:replycount',
  '*.lj:reply-count',
]
