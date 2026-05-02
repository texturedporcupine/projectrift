# California Direct-Mail Automation Map

This map separates what can be systematized from what still needs owner
judgment or a human action in California.

## Operating principle

Automate repeatable coordination work: research capture, prospect organization,
pricing math, email drafts, category locks, proof tracking, payment gates, print
checklists, and post-campaign reporting.

Keep manual anything that requires government filing, legal/tax interpretation,
route approval, creative judgment, customer trust, or physical handoff.

## What you should do manually

| Area | Manual action | Why it stays manual |
| --- | --- | --- |
| FBN / DBA | File the Fictitious Business Name statement with the county recorder | County-specific forms, identity/payment steps, and signature requirements vary |
| FBN publication | Select an adjudicated newspaper and confirm 4-week publication | Requires real-world newspaper placement and affidavit retention |
| Business license | Confirm city/county business license or tax certificate requirements | Local rules differ by where the business is based and operating |
| Tax treatment | Ask CDTFA or a California tax professional about bundled print/postage | Sales-tax treatment depends on how services and printed materials are sold |
| Legal review | Have the service agreement reviewed before paid use | Contract risk and regulated advertiser categories need professional review |
| EDDM routes | Use `eddm.usps.com` to select routes and verify household counts | USPS route data is authoritative and changes over time |
| DDU drop-off | Bundle mail pieces, complete paperwork, pay postage, and drop at USPS | Physical delivery and acceptance cannot be automated |
| Prospect qualification | Decide if a business is reputable enough to appear on the card | Quality control protects the postcard brand and other advertisers |
| Sales calls | Handle calls, negotiation, objections, and close decisions | Trust-building and category exclusivity require judgment |
| Creative approval | Review final ad claims, design quality, and proof approvals | Mistakes become printed mistakes; regulated claims need care |

## What you can automate now

| Workflow | Automate with | Output |
| --- | --- | --- |
| Campaign setup | `campaign_ops.py init` plus `campaign_ops.py checklist` | Campaign input files and a manual/automation checklist |
| Pricing math | `campaign_ops.py financials` | Revenue, postage, print estimate, total cost, net |
| Prospect intake | Spreadsheet/CSV templates | Standard fields for category, fit, status, next step, and lock state |
| Category exclusivity | `campaign_ops.py validate-prospects` and `campaign_ops.py category-locks` | Duplicate category warnings before selling competitors |
| Outreach drafts | `campaign_ops.py outreach` | Email 1, day-3 follow-up, and day-7 value-add markdown drafts |
| Payment gates | Tracker fields and validation checklist | Deposit before lock; final payment before print |
| Proof workflow | Campaign checklist | Written approvals collected before print release |
| Renewal follow-up | Campaign checklist and report template | Two-week result review, testimonial request, renewal offer |
| Campaign reporting | Tracker export plus ROI model | Advertiser count, costs, net, response notes, renewal candidates |

## Recommended lightweight system

Use files first, not a complex CRM:

1. One campaign folder per community and mail date.
2. One prospect tracker for the campaign.
3. One `category_lock_table.csv` showing which categories are open, held, or
   locked.
4. One `advertiser_pipeline.csv` showing outreach status, payment status, proof
   status, and next step.
5. Markdown email drafts generated from CSV data, then manually reviewed before
   sending.
6. A final campaign report created from actual costs, mail count, and advertiser
   feedback.

## Good future automations

- Google Sheets or Airtable sync for the prospect tracker.
- Gmail draft creation after manual review of generated markdown.
- Calendar reminders for follow-ups, proof deadlines, and post-mail check-ins.
- Simple dashboard for category availability, payment status, and print
  readiness.
- Map enrichment from a paid places/business data provider.
- E-signature integration for service agreements.
- Invoice/payment links through Stripe, Square, or QuickBooks.

## Avoid automating yet

- Scraping EDDM route data from USPS. Use the USPS tool manually and record the
  selected route counts.
- Auto-sending cold email without human review. The cost of a bad send is higher
  than the saved time.
- Auto-locking a category before deposit clears.
- Treating California tax/legal notes as final advice.
- Using unverified business lists as if they were qualified prospects.
