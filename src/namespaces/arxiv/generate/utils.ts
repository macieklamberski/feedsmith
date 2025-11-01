import type { GenerateUtil } from '../../../common/types.js'
import {
  generateCdataString,
  generatePlainString,
  isObject,
  trimObject,
} from '../../../common/utils.js'
import type { ArxivNs } from '../common/types.js'

export const generatePrimaryCategory: GenerateUtil<ArxivNs.PrimaryCategory> = (primaryCategory) => {
  if (!isObject(primaryCategory)) {
    return
  }

  const value = {
    '@term': generatePlainString(primaryCategory.term),
    '@scheme': generatePlainString(primaryCategory.scheme),
    '@label': generatePlainString(primaryCategory.label),
  }

  return trimObject(value)
}

export const generateAuthor: GenerateUtil<ArxivNs.Author> = (author) => {
  if (!isObject(author)) {
    return
  }

  const value = {
    'arxiv:affiliation': generateCdataString(author.affiliation),
  }

  return trimObject(value)
}

export const generateEntry: GenerateUtil<ArxivNs.Entry> = (entry) => {
  if (!isObject(entry)) {
    return
  }

  const value = {
    'arxiv:comment': generateCdataString(entry.comment),
    'arxiv:journal_ref': generateCdataString(entry.journalRef),
    'arxiv:doi': generateCdataString(entry.doi),
    'arxiv:primary_category': generatePrimaryCategory(entry.primaryCategory),
  }

  return trimObject(value)
}
