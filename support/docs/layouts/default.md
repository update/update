# <%= title %>

{% body %}

<%= hasAny([related.doc, related.api, related.url, related.cli], '## Related') %>
<%= hasValue(related.doc, '**Docs**') %>
<%= links(related, 'doc') %>

<%= hasValue(related.cli, '**CLI**') %>
<%= links(related, 'cli') %>

<%= hasValue(related.api, '**API**') %>
<%= links(related, 'api') %>

<%= hasValue(related.url, '**Links**') %>
<%= links(related, 'url') %>
