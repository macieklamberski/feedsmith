---
title: "Reference: Activity Streams Namespace"
---

# Activity Streams Namespace Reference

The Activity Streams namespace describes an entry as an activity, with the verb that names the action, the type of the object it acted on and, in Atom, the object and target of the activity.

<table>
  <tbody>
    <tr>
      <th>Namespace URI</th>
      <td><code>http://activitystrea.ms/spec/1.0/</code></td>
    </tr>
    <tr>
      <th>Specification</th>
      <td><a href="http://activitystrea.ms/specs/atom/1.0/" target="_blank">Atom Activity Streams 1.0</a>, partly inferred from live feeds</td>
    </tr>
    <tr>
      <th>Prefix</th>
      <td><code>&lt;activity:*&gt;</code></td>
    </tr>
    <tr>
      <th>Available in</th>
      <td><a href="/reference/feeds/rss">RSS</a>, <a href="/reference/feeds/atom">Atom</a>, <a href="/reference/feeds/rdf">RDF</a></td>
    </tr>
    <tr>
      <th>Property</th>
      <td><code>activity</code></td>
    </tr>
  </tbody>
</table>

The specification defines `activity:verb` and `activity:object-type` on an RSS item, read from RSS 2.0 and RSS 1.0 items alike, and `activity:verb`, `activity:object-type`, `activity:object` and `activity:target` on an Atom entry. On `atom:author` it defines `activity:object-type`, parsed into `activity` on the person.

Inferred from live feeds, not read from the specification:

- `activity:object` and `activity:target` are parsed as full Atom entries. The specification lists only `atom:id`, `atom:title`, `atom:summary`, `atom:link` and `activity:object-type` inside them. Feeds also carry `atom:content`, `atom:published`, `atom:author` and `atom:source` there.
- An object can hold its own `activity:verb` and `activity:object`, which feeds use to share another activity. These are parsed into the `activity` property of the object.

## Types

<<< @/../src/namespaces/activity/common/types.ts#reference

## Related

- **[Atom Feed](/reference/feeds/atom)** - The Atom entry type reused for objects and targets
- **[Parsing Namespaces](/parsing/namespaces)** - How namespace parsing works
