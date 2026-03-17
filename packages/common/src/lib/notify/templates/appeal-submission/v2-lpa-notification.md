{%- if applicationDecision %}
We have received {{appealType}} appeal against {{applicationDecision}} {{referenceType}} {{lpaReference}}.
{%- elseif isEnforcement %}
We have received {{appealType}} appeal against {{referenceType}} {{lpaReference}}.
{%- else %}
We have received {{appealType}} appeal against {{referenceType}} {{lpaReference}}.
{%- endif %}

# Appeal details
^ Appeal reference number: {{appealReferenceNumber}}
Address: {{appealSiteAddress}} 
{{referenceType | capitalize }}: {{lpaReference}}
Submitted date: {{submissionDate}}

When we start the appeal, you can [view the appeal in the manage your appeals service]({{loginUrl}}). We will contact you when we start the appeal.

Planning Inspectorate
{{contactEmailLPA}}