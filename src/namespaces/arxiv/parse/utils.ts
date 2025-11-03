import type { ParsePartialUtil } from '../../../common/types.js'
import {
  isObject,
  parseSingularOf,
  parseString,
  retrieveText,
  trimObject,
} from '../../../common/utils.js'
import type { ArxivNs } from '../common/types.js'

export const parsePrimaryCategory: ParsePartialUtil<ArxivNs.PrimaryCategory> = (value) => {
  if (!isObject(value)) {
    return
  }

  const primaryCategory = {
    term: parseString(value['@term']),
    scheme: parseString(value['@scheme']),
    label: parseString(value['@label']),
  }

  return trimObject(primaryCategory)
}

export const retrieveAuthor: ParsePartialUtil<ArxivNs.Author> = (value) => {
  if (!isObject(value)) {
    return
  }

  const author = {
    affiliation: parseSingularOf(value['arxiv:affiliation'], (value) =>
      parseString(retrieveText(value)),
    ),
  }

  return trimObject(author)
}

export const retrieveEntry: ParsePartialUtil<ArxivNs.Entry> = (value) => {
  if (!isObject(value)) {
    return
  }

  const entry = {
    comment: parseSingularOf(value['arxiv:comment'], (value) => parseString(retrieveText(value))),
    journalRef: parseSingularOf(value['arxiv:journal_ref'], (value) =>
      parseString(retrieveText(value)),
    ),
    doi: parseSingularOf(value['arxiv:doi'], (value) => parseString(retrieveText(value))),
    primaryCategory: parseSingularOf(value['arxiv:primary_category'], parsePrimaryCategory),
  }

  return trimObject(entry)
}
