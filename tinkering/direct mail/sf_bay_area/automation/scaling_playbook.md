# Scaling Playbook for California Direct Mail

This is the operator view of what to automate, what to keep manual, and how to
scale from one Bay Area postcard campaign to repeatable California operations.

## The scalable operating model

Treat each campaign as a folder with structured inputs and generated outputs.

```text
campaigns/
  danville_94526.json          # route count, pricing, campaign assumptions
  danville_prospects.csv       # researched advertiser pipeline
generated/
  danville/
    checklist.md               # phase gates and manual/automation split
    prospect_issues.md         # duplicate/missing-field/category warnings
    category_locks.csv         # which categories are open, held, or locked
    financials.csv             # conservative/target/full-fill economics
    emails/                    # personalized drafts, reviewed before sending
    agreements/                # agreement drafts, reviewed before signature
```

The repeatable data inputs are:

- Campaign JSON: community, zip codes, household count, tier, ad prices, target
  advertiser count.
- Prospect CSV: business name, category, contact, email, average customer
  value, price, exclusivity status, outreach status, and notes.
- Manual route evidence: EDDM screenshots, route IDs, DDU info, and USPS
  receipts.

## What to automate first

1. **Campaign setup**
   - Generate a campaign JSON and prospect CSV shell.
   - Keep route IDs and household counts manually entered from USPS EDDM.
2. **Prospect validation**
   - Detect missing emails, missing first names, duplicate emails, and category
     conflicts.
   - Flag categories with more than one held or locked advertiser.
3. **Economics**
   - Calculate postage, print estimate, total cost, deposit due, final payment
     due, and estimated net.
   - Recalculate whenever household count, price, or advertiser count changes.
4. **Outreach drafting**
   - Generate email 1, day-3 follow-up, and day-7 value-add drafts from the CSV.
   - Review every email manually before sending.
5. **Agreement drafting**
   - Generate per-advertiser agreement drafts from the campaign and prospect
     data.
   - Review final legal language and send through the chosen signature workflow.
6. **Readiness checklist**
   - Generate the phase checklist and use it as a print-release gate.

## What you still need to do manually in California

| Step | Manual action | Automation support |
| --- | --- | --- |
| FBN / DBA | File with the county recorder if using a fictitious name | Track filing date, publication deadline, renewal date |
| FBN publication | Publish in an adjudicated newspaper for 4 consecutive weeks | Store publication dates and affidavit status |
| Business license | Confirm city/county requirements | Store license number and renewal reminder |
| Sales tax | Confirm CDTFA treatment for your exact offer | Store decision memo and tax-contact notes |
| EDDM route selection | Use `eddm.usps.com` and select live carrier routes | Enter counts into campaign JSON and calculate economics |
| Prospect qualification | Decide whether the business belongs on the card | Track fit rating and notes |
| Sales calls | Negotiate, answer objections, and close | Use scripts and follow-up tasks |
| Category lock | Confirm deposit has cleared | `category_locks.csv` shows status, but you decide when to lock |
| Proof approval | Review layout, claims, disclaimers, and written approvals | Checklist and tracker status fields |
| Final payment | Confirm final 50% payment clears | Print-release checklist gate |
| Mailing | Bundle cards, submit/pay EDDM, drop at DDU | Postage math and packing checklist |

## Good next integrations

Start file-based, then add integrations only when the process is proven.

1. **Google Sheets or Airtable**
   - Sync prospect CSVs into a shared pipeline.
   - Keep category exclusivity visible.
2. **Gmail drafts**
   - Convert generated markdown emails into drafts.
   - Keep sending manual until deliverability and compliance are understood.
3. **Calendar reminders**
   - Follow-up after email 1, proof deadlines, final-payment deadlines, and
     two-week renewal checks.
4. **E-signature**
   - Push generated agreement drafts into DocuSign, Dropbox Sign, or similar.
5. **Payments**
   - Create Stripe, Square, or QuickBooks invoice links for deposit and final
     payment.
6. **Reporting**
   - Generate a campaign report from actual spend, advertiser count, results
     notes, testimonials, and renewal candidates.

## What not to automate yet

- Do not scrape USPS EDDM route data. Enter verified counts manually.
- Do not auto-send cold email until you have reviewed copy and deliverability.
- Do not auto-lock categories before deposit clears.
- Do not treat the legal/tax checklist as legal advice.
- Do not use unverified business lists as qualified prospects.

