---
prev: Parsing › Namespaces
next: Parsing › Detecting
---

# Handling Dates

Dates in feeds do not always follow a format defined in the specifications, or even any consistent format. Instead of attempting to parse all of them and risking errors, Feedsmith returns dates in their original string form. This method allows for the use of a preferred date parsing library, custom function, or the `Date` object directly.

### Common Issues

- **RSS**: Should use RFC 2822 format, but many feeds use incorrect formats
- **Atom**: ISO 8601/RFC 3339 format, generally more consistent but still varies
- **Real-world problems**:
  - Missing timezone information
  - Invalid day/month combinations
  - Inconsistent formatting within the same feed
  - Localized date strings
  - Custom date formats

> [!NOTE]
> Automatic date parsing may be implemented in a future version of Feedsmith, with an option to preserve string behavior for backward compatibility.
