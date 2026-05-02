"""Generate 10 Bay Area category-specific pitch scripts (.md)."""
from pathlib import Path
from textwrap import dedent

OUT_DIR = Path(__file__).resolve().parent.parent / "scripts"


CATEGORIES = [
    {
        "slug": "hvac",
        "title": "HVAC",
        "hook": (
            "Your spring tune-up window in the Tri-Valley is short. Inland Bay "
            "summers (Danville, San Ramon, Pleasanton) push 100°F+ and homeowners "
            "scramble in June. The companies that show up on the fridge in April "
            "win the call in June."
        ),
        "local_angle": (
            "I'm running the {{Community_Name}} ({{Community_Zip}}) shared "
            "postcard for {{Next_Drop_Month}}. Six thousand owner-occupied homes, "
            "median HHI {{Median_HHI}}+, mostly aging single-family stock with "
            "original ductwork. That's your customer."
        ),
        "ideal_offer": (
            "Spring tune-up special at $79–$99 with a free duct inspection "
            "upsell — gets you in the door, lets the tech sell the repair."
        ),
        "math": (
            "$650 ad / $0.11 per home / 1% response = 60 calls / 50% conversion "
            "= 30 jobs at $280 avg ticket = $8,400 gross. Break-even is 3 jobs."
        ),
    },
    {
        "slug": "pest-control",
        "title": "Pest Control",
        "hook": (
            "Bay Area homeowners have three pest seasons: ant invasions in "
            "spring, rodents when the rains start in October, and spiders "
            "year-round in older homes. Your timing is the whole game."
        ),
        "local_angle": (
            "{{Community_Name}} ({{Community_Zip}}) has older homes with great "
            "lots — and that means recurring rodent and ant problems. Postcard "
            "lands in mailboxes, sticks to the fridge, and surfaces the moment "
            "the homeowner sees an ant trail in the kitchen."
        ),
        "ideal_offer": (
            "$99 first-quarterly service, includes free attic + crawlspace "
            "inspection. The recurring sub-base is what you actually buy."
        ),
        "math": (
            "$650 / 6,000 homes = 11¢/home. 1% response = 60 inquiries. 30% "
            "convert to recurring at $99/quarter = ~$3,500/yr LTV per customer."
        ),
    },
    {
        "slug": "general-dentistry",
        "title": "General Dentistry",
        "hook": (
            "Most {{Community_Name}} families have a dentist on Google but "
            "haven't been in 18 months. They need a reason to switch — a "
            "specific offer, a friendly face on a fridge magnet, a phone "
            "number they don't have to look up."
        ),
        "local_angle": (
            "{{Community_Name}}'s ({{Community_Zip}}) demographic is a dental "
            "practice's dream — high homeownership, family households, dental "
            "insurance through tech employers. The hard part is getting on the "
            "consideration list."
        ),
        "ideal_offer": (
            "$129 new-patient exam, X-rays, and cleaning (call out the value: "
            "a $400 service for $129). Add a free whitening for new patients "
            "who book within 30 days."
        ),
        "math": (
            "$650 ad. 1 new patient is worth $1,200–$2,500 in first-year "
            "production. You need to acquire <1 new patient to break even."
        ),
    },
    {
        "slug": "pediatric-dentistry",
        "title": "Pediatric Dentistry",
        "hook": (
            "Parents pick a pediatric dentist by reputation and proximity, "
            "almost never by Google search. A postcard from a neighbor-friendly "
            "practice is exactly the trust signal that converts."
        ),
        "local_angle": (
            "{{Community_Name}} is a family-heavy zip. Top-rated schools mean "
            "long-tenure households — once a family picks a pediatric dentist, "
            "they stay 8–10 years."
        ),
        "ideal_offer": (
            "First-visit kid's exam + cleaning + fluoride for $69, plus a "
            "stuffed animal for the kid. Throw in a sibling discount."
        ),
        "math": (
            "$650 ad. One pediatric patient = ~$400/yr × 8 yrs = $3,200 LTV. "
            "Add 2–3 siblings and you've covered the postcard cost on a "
            "single household."
        ),
    },
    {
        "slug": "pool-service",
        "title": "Pool Service",
        "hook": (
            "Inland Bay communities — {{Community_Name}} included — have one of "
            "the highest pool-density profiles in the state. That's good news "
            "and bad news: lots of demand, but a saturated market of one-truck "
            "operators. A pro postcard separates you from the truck signs."
        ),
        "local_angle": (
            "Most {{Community_Name}} pools are 15+ years old and need more than "
            "weekly chemical service. Position around equipment health, not "
            "skim-and-go."
        ),
        "ideal_offer": (
            "Free pool equipment inspection ($150 value) for new weekly-service "
            "sign-ups. Price the recurring at $185–$225/month."
        ),
        "math": (
            "$650 ad. One new weekly customer = $2,400+ ARR. You need <1 "
            "customer per campaign to break even."
        ),
    },
    {
        "slug": "landscaping",
        "title": "Landscaping",
        "hook": (
            "The {{Community_Name}} HOAs are picky — and homeowners want a "
            "landscape company that won't get them a violation letter. "
            "Reputation matters more than price in this segment."
        ),
        "local_angle": (
            "Position around two seasons: spring cleanup + drought-tolerant "
            "redesign in March–May, and storm prep + leaf cleanup in October. "
            "The postcard hits both windows if we drop in April."
        ),
        "ideal_offer": (
            "Free landscape consultation + design sketch with any package over "
            "$2,500. Or: $499 spring clean-up bundle (haul, prune, mulch)."
        ),
        "math": (
            "$650 ad. One redesign job = $5K–$15K. Break-even is half a job."
        ),
    },
    {
        "slug": "plumbing",
        "title": "Plumbing",
        "hook": (
            "Plumbing is a rescue purchase — homeowners don't shop until "
            "something breaks. The job is to be the magnet on the fridge when "
            "it breaks at 9pm on a Tuesday."
        ),
        "local_angle": (
            "{{Community_Name}}'s housing stock has plenty of homes 25+ years "
            "old — original water heaters, original copper, aging pressure "
            "regulators. That's a recurring-failure profile."
        ),
        "ideal_offer": (
            "Free water heater + pressure regulator inspection. $49 drain "
            "clear with any service call. 24/7 emergency line bolded on the card."
        ),
        "math": (
            "$650 ad. Average plumbing service ticket: $350. Break-even is "
            "<2 service calls."
        ),
    },
    {
        "slug": "roofing",
        "title": "Roofing",
        "hook": (
            "Roof replacements happen in clusters — one neighbor sees another's "
            "new roof and the conversation starts. A postcard from the company "
            "doing two homes already on the street is the ultimate proof."
        ),
        "local_angle": (
            "{{Community_Name}} ({{Community_Zip}}) housing stock is heavy on "
            "20-year-old composition shingles — right at the end of useful life. "
            "Position around free roof health checks before the rainy season."
        ),
        "ideal_offer": (
            "Free roof inspection + drone photo report. $500 off any full "
            "replacement booked within 60 days. Mention financing option if "
            "you have one."
        ),
        "math": (
            "$650 ad. Average roof job in the Bay Area: $18K–$30K. One job "
            "covers the campaign 25× over."
        ),
    },
    {
        "slug": "house-cleaning",
        "title": "House Cleaning",
        "hook": (
            "House cleaning is a recurring-revenue business. A postcard buys "
            "trial; great service buys a 3-year customer."
        ),
        "local_angle": (
            "{{Community_Name}} is a dual-income, time-poor demographic. The "
            "objection is never 'too expensive,' it's 'I don't trust whoever "
            "comes in the house.' Lead with bonded/insured + same-team-every-time."
        ),
        "ideal_offer": (
            "First clean half off ($89 for a standard 3-bed/2-bath) when they "
            "sign up for biweekly recurring. Bonded, insured, same team."
        ),
        "math": (
            "$650 ad. One biweekly recurring customer at $180/clean = "
            "$4,680/yr. Break-even is <1 sign-up."
        ),
    },
    {
        "slug": "med-spa",
        "title": "Med Spa / Aesthetics",
        "hook": (
            "Med spa decisions in the Bay Area are referral- and trust-driven. "
            "A premium-looking postcard from a clinic 10 minutes from home, "
            "with a real photo of the practice, beats any Instagram ad."
        ),
        "local_angle": (
            "{{Community_Name}} skews high-HHI, family-formed, aesthetics-aware. "
            "Botox, filler, laser hair removal, and skin tightening are all "
            "high-margin, high-repeat services."
        ),
        "ideal_offer": (
            "$10/unit Botox special for first-time patients (or your local "
            "competitive number). Free consultation + skin analysis. "
            "Limited-time intro pricing on a signature laser package."
        ),
        "math": (
            "$650 ad. One first-time Botox patient = $400+ first visit, ~3× "
            "annual repeat = $1,200/yr. Break-even is <1 patient."
        ),
    },
]


SCRIPT_TEMPLATE = dedent("""
# Pitch Script — {title} ({community_default})

> Use this for cold-call follow-ups after Email 2, in-person walk-ins, and
> qualifying conversations. Always read the universal objection handler
> alongside it: `_universal_objection_handler.md`.

**Default community placeholders** — replace with your actual target:

- `{{{{Community_Name}}}}`: Danville (or your target community)
- `{{{{Community_Zip}}}}`: 94526
- `{{{{Median_HHI}}}}`: $185K
- `{{{{Next_Drop_Month}}}}`: October 2026
- `{{{{Lock_Deadline}}}}`: 2 weeks before drop date
- `{{{{Category}}}}`: {title}
- `{{{{Business_Name}}}}`, `{{{{Owner_FirstName}}}}`: from your prospect tracker

---

## 1. Opening (30 seconds)

> "Hi, is this {{{{Owner_FirstName}}}}? My name's {{{{Your_Name}}}} — I run a small
> direct-mail co-op for {{{{Community_Name}}}}. I sent you a quick email earlier
> this week. Got 90 seconds for the short version?"

If they say yes:

> "Twice a year I mail one professionally-designed postcard to about
> {{{{Household_Count}}}} owner-occupied homes in {{{{Community_Name}}}}. Only one
> business per category goes on the card — one HVAC, one dentist, one
> pool service, and so on. The {title} slot for the {{{{Next_Drop_Month}}}} drop
> is open and I wanted to give {{{{Business_Name}}}} first crack at it."

## 2. The Hook ({title}-specific)

{hook}

## 3. Why {{{{Community_Name}}}} for {title}

{local_angle}

## 4. The Offer We'd Recommend

{ideal_offer}

## 5. The Math (memorize this)

{math}

## 6. The Ask

> "If it makes sense, the next step is a 15-minute creative call where we
> talk through your offer and what your slot would look like. I lock the
> {title} category for {{{{Community_Name}}}} when we finish the call and
> you put down the 50% deposit. Want me to text you my calendar link?"

## 7. If They Want to Think About It

> "Totally. Two things to know: one, I'm holding the {title} slot for you
> until {{{{Lock_Deadline}}}}. Two, the only people I usually lose are the
> ones who say 'next campaign' — there's always a competitor of yours
> waiting. Want me to send the deck and the route map so you can think
> through it with all the info?"

## 8. Close

> "Great — sending the deck right now to {{{{Owner_Email}}}}. I'll check
> back Friday. If you want to lock the slot before then, my cell is
> {{{{Your_Phone}}}}."

---

### Source material
- Universal objection handler: `_universal_objection_handler.md`
- Email sequence: `../emails/`
- Pitch deck: `../deck/pitch-deck_bay-area_*.pptx`
- Community guide: `../docs/Bay_Area_Communities_Direct_Mail_Guide.docx`
""").strip() + "\n"


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for c in CATEGORIES:
        out = OUT_DIR / f"pitch_{c['slug']}.md"
        community_default = "Danville 94526"
        out.write_text(SCRIPT_TEMPLATE.format(
            title=c["title"],
            community_default=community_default,
            hook=c["hook"],
            local_angle=c["local_angle"],
            ideal_offer=c["ideal_offer"],
            math=c["math"],
        ))
        print(f"Wrote {out}")


if __name__ == "__main__":
    main()
