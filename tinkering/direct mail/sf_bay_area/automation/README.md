# Direct Mail Automation Toolkit

This folder separates what can be automated from what must stay manual for a
California shared-postcard direct-mail business.

## Files

| File | Purpose |
| --- | --- |
| `california_automation_map.md` | Manual vs automated responsibility map for California operations |
| `campaign_workflow.json` | Machine-readable campaign workflow and stage gates |
| `campaign_ops.py` | Local CLI for prospect CSV validation, economics, task generation, and email drafts |

## Quick start

```bash
python3 "tinkering/direct mail/sf_bay_area/automation/campaign_ops.py" init
```

This creates:

- `campaigns/danville_94526.json`
- `campaigns/danville_prospects.csv`

Create a campaign checklist:

```bash
python3 "tinkering/direct mail/sf_bay_area/automation/campaign_ops.py" checklist \
  --campaign "tinkering/direct mail/sf_bay_area/campaigns/danville_94526.json" \
  --output "tinkering/direct mail/sf_bay_area/generated/danville/checklist.md"
```

Create starter email drafts from a CSV:

```bash
python3 "tinkering/direct mail/sf_bay_area/automation/campaign_ops.py" outreach \
  --campaign "tinkering/direct mail/sf_bay_area/campaigns/danville_94526.json" \
  --prospects "tinkering/direct mail/sf_bay_area/campaigns/danville_prospects.csv" \
  --output-dir "tinkering/direct mail/sf_bay_area/generated/danville/emails" \
  --sender-name "Your Name"
```

Expected CSV columns:

```csv
business_name,category,first_name,email,average_value,price,premium_price,notes
```

Run checks against a prospect CSV:

```bash
python3 "tinkering/direct mail/sf_bay_area/automation/campaign_ops.py" validate-prospects \
  --prospects "tinkering/direct mail/sf_bay_area/campaigns/danville_prospects.csv" \
  --output "tinkering/direct mail/sf_bay_area/generated/danville/prospect_issues.md"
```

Estimate campaign economics:

```bash
python3 "tinkering/direct mail/sf_bay_area/automation/campaign_ops.py" financials \
  --campaign "tinkering/direct mail/sf_bay_area/campaigns/danville_94526.json" \
  --output "tinkering/direct mail/sf_bay_area/generated/danville/financials.csv"
```

Create category-lock status from a prospect CSV:

```bash
python3 "tinkering/direct mail/sf_bay_area/automation/campaign_ops.py" category-locks \
  --prospects "tinkering/direct mail/sf_bay_area/campaigns/danville_prospects.csv" \
  --output "tinkering/direct mail/sf_bay_area/generated/danville/category_locks.csv"
```

## Manual California gates

Keep these out of automation until you have professional/legal confirmation:

- FBN/DBA filing and publication.
- City or county business-license submission.
- CDTFA/sales-tax interpretation and registration decisions.
- Final EDDM route selection inside USPS tools.
- Final advertiser proof approval.
- Deposit/final payment confirmation.
- DDU drop-off and USPS receipt retention.
