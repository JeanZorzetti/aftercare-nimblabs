// Rich editorial content for each procedure page. Kept separate from
// procedures.ts so the generator config stays lean while pages carry the
// depth Google needs to treat them as genuine resources.

export interface TimelinePhase {
  phase: string
  window: string
  description: string
}

export interface ProcedureContent {
  slug: string
  /** 2-3 paragraphs introducing why aftercare matters for this procedure. */
  overview: string[]
  timeline: TimelinePhase[]
  dos: string[]
  donts: string[]
  /** Symptoms that mean the patient should contact the clinic. */
  redFlags: string[]
  /** Practical guidance aimed at the clinic/practitioner. */
  clinicNotes: string[]
  /** Extra FAQ merged with the base FAQ from procedures.ts. */
  extraFaq: { q: string; a: string }[]
  /** Slugs of related procedure pages for cross-linking. */
  related: string[]
}

export const PROCEDURE_CONTENT: ProcedureContent[] = [
  {
    slug: 'botox',
    overview: [
      'Botox (botulinum toxin type A) works by temporarily relaxing the muscles responsible for dynamic wrinkles. The product needs time to bind at the neuromuscular junction, and what patients do in the first 24-48 hours directly affects how evenly results settle. Clear, written aftercare instructions reduce the two complications injectors see most: bruising at injection sites and product migration into unintended muscles, such as ptosis (eyelid droop) from frontalis or glabella treatments.',
      'For clinics, consistent Botox aftercare is also a retention tool. Patients who know exactly what to expect — when results appear, what sensations are normal, when to book their next appointment — return on schedule and refer more. A branded aftercare sheet handed to every patient at checkout standardizes that experience across every injector in your practice.',
    ],
    timeline: [
      { phase: 'First 4 hours', window: '0-4 hours', description: 'Stay upright. Small injection-site bumps (like mosquito bites) are normal and resolve within 20-30 minutes. No rubbing, no headwear that presses on treated areas, no facials.' },
      { phase: 'First day', window: '4-24 hours', description: 'Avoid exercise, alcohol, saunas, and lying face-down. Gentle facial expressions (frowning, raising brows) can help the product bind — heavy massage cannot, and risks migration.' },
      { phase: 'Onset', window: 'Days 3-5', description: 'Patients begin to notice reduced movement in treated muscles. Mild headache or tightness is common and resolves on its own.' },
      { phase: 'Full result', window: 'Day 14', description: 'Results are complete. This is the correct time to assess symmetry and book a touch-up if needed — never earlier.' },
      { phase: 'Duration', window: '3-4 months', description: 'Movement gradually returns as nerve terminals regenerate. Booking the next appointment around month 3 keeps results continuous.' },
    ],
    dos: [
      'Remain upright for at least 4 hours after treatment',
      'Make gentle facial expressions in the first hour to help product uptake',
      'Apply a cold compress (cloth barrier, never ice directly) for bruising-prone patients',
      'Use arnica gel on any bruise from day 1',
      'Wait the full 14 days before judging results or requesting a touch-up',
      'Keep skincare gentle for 24 hours — no actives on injection sites',
    ],
    donts: [
      'Do not rub, massage, or apply pressure to treated areas for 24 hours',
      'No strenuous exercise for 24 hours — raised blood pressure increases bruising and migration risk',
      'No alcohol for 24 hours (vasodilation worsens bruising)',
      'No saunas, hot yoga, sunbeds, or prolonged heat for 48 hours',
      'No facials, microdermabrasion, or face-down massage for 1-2 weeks',
      'Do not lie down flat for 4 hours post-treatment',
    ],
    redFlags: [
      'Drooping eyelid or eyebrow (ptosis) — usually appears days 3-14, the clinic should assess and may prescribe apraclonidine drops',
      'Difficulty swallowing, speaking, or breathing — seek urgent medical care',
      'Rash, hives, or swelling spreading beyond injection sites (possible allergic reaction)',
      'Severe headache unresponsive to over-the-counter analgesia',
      'Asymmetry persisting after day 14 — book a review for a possible balancing dose',
    ],
    clinicNotes: [
      'Hand the aftercare sheet over at checkout and walk through the first-24-hours section verbally — verbal-plus-written instructions measurably reduce follow-up calls.',
      'Photograph baseline and day-14 results with consistent lighting; it protects you on asymmetry complaints and powers before/after marketing consent conversations.',
      'Schedule the 2-week review before the patient leaves. It converts a complaint channel into a touch-up appointment.',
    ],
    extraFaq: [
      { q: 'Can patients sleep on their side after Botox?', a: 'After the first 4 hours upright, normal sleeping positions are fine. Only face-down pressure on freshly treated areas during the first night is worth avoiding.' },
      { q: 'When can patients fly after Botox?', a: 'Most practitioners recommend waiting 24-48 hours before flying. Cabin pressure changes are unlikely to affect results, but the buffer keeps the patient near the clinic if an early concern develops.' },
      { q: 'Does Botox aftercare differ between forehead and glabella treatment?', a: 'The principles are identical, but ptosis risk is highest with glabella and frontalis treatments, so the no-rubbing and stay-upright rules matter most for these areas.' },
      { q: 'Can patients take painkillers after Botox?', a: 'Paracetamol (acetaminophen) is fine. Ibuprofen, aspirin, and other blood thinners increase bruising and are best avoided for 24 hours unless medically required.' },
    ],
    related: ['dermal-fillers', 'lip-filler', 'microneedling'],
  },
  {
    slug: 'lip-filler',
    overview: [
      'Lip filler aftercare exists to manage two things: the normal inflammatory response (swelling, tenderness, occasional bruising) and the rare-but-serious complication of vascular occlusion. Hyaluronic acid filler attracts water, so lips routinely look 20-30% larger than the final result for the first 48 hours — patients who were not warned about this call the clinic in a panic on day 2.',
      'A written, branded aftercare sheet sets expectations before the swelling peaks, lists the warning signs of vascular compromise that need same-day review, and tells the client exactly when their true result will be visible (about 2 weeks, once swelling resolves and the filler integrates).',
    ],
    timeline: [
      { phase: 'First hours', window: '0-6 hours', description: 'Lips feel swollen, tender, and may show small injection-point marks. Cold compresses in 10-minute intervals help. No makeup on the lips.' },
      { phase: 'Swelling peak', window: '24-48 hours', description: 'This is the maximum-swelling window — lips can look uneven or overfilled. This is normal and not the final result.' },
      { phase: 'Settling', window: 'Days 3-7', description: 'Swelling subsides noticeably. Small firm areas or lumps often soften on their own as the filler integrates with tissue.' },
      { phase: 'Final result', window: 'Week 2', description: 'Filler has fully integrated and absorbed water to its stable volume. Assess the result and any need for additional volume now.' },
      { phase: 'Longevity', window: '6-12 months', description: 'Hyaluronic acid lip filler typically lasts 6-12 months depending on product, metabolism, and lifestyle.' },
    ],
    dos: [
      'Apply a cold compress (cloth-wrapped) for 10 minutes at a time during the first day',
      'Keep lips hydrated with a bland balm (no actives, no fragrance)',
      'Sleep slightly elevated the first night to limit overnight swelling',
      'Drink plenty of water — hyaluronic acid filler performs best well-hydrated',
      'Wait 2 weeks before judging the final result',
      'Take arnica orally or topically if prone to bruising',
    ],
    donts: [
      'No strenuous exercise for 24-48 hours',
      'No alcohol for 24 hours',
      'No kissing, straws, or pressure on the lips for 24 hours',
      'No lipstick or lip products over open injection points for 24 hours',
      'No saunas, steam rooms, or hot yoga for 48 hours',
      'No dental work or prolonged mouth-open procedures for 2 weeks',
    ],
    redFlags: [
      'Blanching (white patches), dusky or mottled purple skin on or around the lips — possible vascular occlusion, contact the clinic immediately',
      'Severe, increasing pain hours after the appointment rather than gradual improvement',
      'Skin breakdown, blistering, or ulceration in the days after treatment',
      'Signs of infection: spreading redness, heat, pus, or fever',
      'Cold sore outbreak — patients with HSV history may need antiviral cover before future appointments',
    ],
    clinicNotes: [
      'Send clients home with the vascular-occlusion warning signs in writing — early recognition is the difference between an easy hyaluronidase reversal and tissue damage.',
      'Photograph immediately post-treatment so day-2 "it looks uneven" calls can be triaged against the swelling-peak baseline.',
      'Screen for upcoming events: clients should book lip filler at least 2 weeks before weddings or photoshoots so swelling has fully resolved.',
    ],
    extraFaq: [
      { q: 'How long does lip filler swelling take to go down?', a: 'Swelling peaks at 24-48 hours and reduces substantially within the first week. The true final result is visible at around 2 weeks.' },
      { q: 'Can clients smoke after lip filler?', a: 'Smoking should be avoided for at least 24-48 hours: the pursing motion stresses injection sites and nicotine impairs healing.' },
      { q: 'Are lumps normal after lip filler?', a: 'Small, soft lumps in the first 1-2 weeks usually integrate on their own. Firm, painful, or growing lumps should be reviewed by the injector.' },
      { q: 'When can clients exercise after lip filler?', a: 'Light walking is fine the same day; strenuous exercise that raises heart rate should wait 24-48 hours to limit swelling and bruising.' },
    ],
    related: ['dermal-fillers', 'botox', 'lip-blush'],
  },
  {
    slug: 'microneedling',
    overview: [
      'Microneedling creates thousands of controlled micro-channels in the skin to trigger collagen production. Those channels stay open for roughly 24 hours — which makes the first day the highest-stakes window in all of aesthetic aftercare. Anything applied to the skin can penetrate far deeper than normal, so the wrong product (actives, makeup, unclean hands) can cause irritation, granulomas, or infection.',
      'Good microneedling aftercare is therefore mostly about restraint: bland hydration, strict sun protection, and a clear schedule for reintroducing actives. Clinics that hand out a written day-by-day protocol see fewer reactive-skin callbacks and better series compliance, because clients understand the redness is part of the process.',
    ],
    timeline: [
      { phase: 'Immediately after', window: '0-24 hours', description: 'Skin looks and feels like a moderate sunburn — red, warm, tight. Use only the post-procedure serum your provider supplies. No makeup, no actives, no touching with unwashed hands.' },
      { phase: 'Day 2-3', window: '24-72 hours', description: 'Redness fades to pink; light flaking or roughness ("sandpaper skin") is common. Gentle cleanser and bland moisturizer only. Mineral SPF from day 2.' },
      { phase: 'Recovery', window: 'Days 4-7', description: 'Skin returns to normal appearance. Reintroduce actives (vitamin C, then retinoids) gradually from day 5-7 if irritation has fully settled.' },
      { phase: 'Collagen response', window: 'Weeks 2-6', description: 'Visible improvements in texture and tone develop as new collagen forms. Results compound over a series of 3-6 sessions spaced 4-6 weeks apart.' },
    ],
    dos: [
      'Use only the post-procedure serum (typically hyaluronic acid) for the first 24 hours',
      'Wash with lukewarm water and a gentle, fragrance-free cleanser from day 2',
      'Apply broad-spectrum mineral SPF 30+ daily — skin is photosensitive for at least a week',
      'Sleep on a clean pillowcase the first two nights',
      'Keep skin continuously moisturized during the flaking phase',
      'Complete the full treatment series for cumulative collagen results',
    ],
    donts: [
      'No makeup for 24 hours (48 if skin is still visibly inflamed)',
      'No retinoids, AHAs/BHAs, vitamin C, or exfoliants for 5-7 days',
      'No direct sun exposure, sunbeds, or self-tanner for 1 week',
      'No gym, saunas, or heavy sweating for 48-72 hours — sweat stings and raises infection risk',
      'No swimming pools or hot tubs for 72 hours',
      'Do not pick or peel flaking skin',
    ],
    redFlags: [
      'Redness that worsens after day 3 instead of improving',
      'Pustules, crusting, or honey-colored scabbing (possible infection)',
      'Severe itching, hives, or rash (possible product reaction through open channels)',
      'Cold sore outbreak in clients with HSV history — treat promptly and add antiviral prophylaxis to future sessions',
      'Streaky hyperpigmentation developing in the weeks after treatment — review sun-protection compliance',
    ],
    clinicNotes: [
      'List the exact products the client may use by name for the first 72 hours — "gentle cleanser" is interpreted very loosely without examples.',
      'Sell or supply the post-procedure kit (cleanser, HA serum, mineral SPF) at checkout; it removes guesswork and adds revenue per treatment.',
      'Confirm clients stopped retinoids 3-5 days pre-treatment at booking time, not in the chair — it saves cancelled appointments.',
    ],
    extraFaq: [
      { q: 'Can clients shower after microneedling?', a: 'Yes — a lukewarm shower the same evening is fine, but keep the face out of hot water and skip cleansers with actives for the first 24 hours.' },
      { q: 'Why does skin flake after microneedling?', a: 'Micro-channels accelerate cell turnover, so the outer layer sheds lightly around days 3-5. Moisturize and let it shed naturally — picking risks pigmentation.' },
      { q: 'How many microneedling sessions do clients need?', a: 'Most concerns (texture, mild scarring, tone) respond best to a series of 3-6 sessions spaced 4-6 weeks apart, then maintenance 1-2 times per year.' },
      { q: 'Is microneedling aftercare different with deeper needle depths?', a: 'The protocol is the same but every window extends: deeper treatments (1.5mm+) may show redness for 48-72 hours and need 7+ days before actives return.' },
    ],
    related: ['prp-microneedling', 'chemical-peel', 'dermaplaning'],
  },
  {
    slug: 'chemical-peel',
    overview: [
      'A chemical peel deliberately injures the outer skin layers so they shed and regenerate. That means aftercare is not optional comfort advice — it is the second half of the treatment. The two errors that cause almost every peel complication are manual peeling (picking at shedding skin, which causes scarring and post-inflammatory hyperpigmentation) and inadequate sun protection while the new, thinner skin is exposed.',
      'Patients also need honest expectations: light peels may produce only mild flaking, while medium-depth peels produce dramatic sheeting around days 3-5. A written timeline keeps clients calm through the ugly-duckling phase and protects your clinic from "is this normal?" call volume.',
    ],
    timeline: [
      { phase: 'Day of treatment', window: '0-24 hours', description: 'Skin feels tight and looks flushed, similar to sunburn. Use only the recommended bland cleanser and moisturizer. No actives, no makeup.' },
      { phase: 'Darkening', window: 'Days 1-2', description: 'Treated skin may darken or feel leathery before peeling begins — this is expected, especially with medium-depth peels.' },
      { phase: 'Peeling', window: 'Days 3-7', description: 'Shedding typically starts around the mouth and spreads outward. Moisturize generously; let skin detach on its own.' },
      { phase: 'Fresh skin', window: 'Days 7-14', description: 'New skin is pink and sensitive. Strict SPF. Actives can usually return at day 10-14 depending on peel depth.' },
      { phase: 'Full result', window: 'Weeks 2-4', description: 'Tone and texture improvements are fully visible. Series peels are spaced 4-6 weeks apart.' },
    ],
    dos: [
      'Moisturize generously and frequently throughout the peeling phase',
      'Use a gentle, non-foaming cleanser with lukewarm water',
      'Apply broad-spectrum SPF 30+ every morning and reapply at midday',
      'Trim (never pull) large flakes of detaching skin with clean scissors if they catch',
      'Sleep on your back if possible during the heaviest peeling days',
      'Keep follow-up appointments so the provider can assess healing',
    ],
    donts: [
      'Do not pick, peel, or pull shedding skin — this is the number one cause of scarring and pigmentation',
      'No retinoids, AHAs/BHAs, benzoyl peroxide, or scrubs until skin fully heals',
      'No direct sun exposure for at least 2 weeks; no sunbeds for a month',
      'No saunas, hot showers on the face, or strenuous sweating for 48-72 hours',
      'No waxing, threading, or laser on treated skin for 2-4 weeks',
      'No makeup until peeling completes (typically day 7-10)',
    ],
    redFlags: [
      'Blistering, weeping, or crusting beyond light flaking',
      'Spreading redness, swelling, heat, or pus (infection signs)',
      'Severe pain rather than tightness or mild stinging',
      'Cold sore eruption — common trigger in HSV-positive patients without antiviral cover',
      'New dark patches forming after healing (post-inflammatory hyperpigmentation) — needs early review',
    ],
    clinicNotes: [
      'Match the aftercare sheet to the peel depth — handing a superficial-peel client a medium-depth timeline (or vice versa) destroys trust in the instructions.',
      'For Fitzpatrick IV-VI clients, emphasize pigmentation risk from picking and sun exposure twice — verbally and in writing.',
      'Pre-book the next peel in the series at checkout; 4-6 week spacing is easiest to maintain when it is already on the calendar.',
    ],
    extraFaq: [
      { q: 'What if the skin barely peels?', a: 'Visible peeling is not required for results — superficial peels often produce only micro-exfoliation. The acid has worked regardless of how much visible shedding occurs.' },
      { q: 'Can clients wash their face after a chemical peel?', a: 'Yes, gently — lukewarm water and a bland, non-foaming cleanser from the first evening, patting (not rubbing) dry.' },
      { q: 'How soon after a peel can clients exercise?', a: 'Wait 48-72 hours. Sweat on freshly treated skin stings, raises irritation, and can drive uneven shedding.' },
      { q: 'When is it safe to do another peel?', a: 'Superficial peels can be repeated every 4 weeks; medium-depth peels typically every 3-6 months. Skin must be fully healed and active-free before the next session.' },
    ],
    related: ['tca-peel', 'microneedling', 'dermaplaning'],
  },
  {
    slug: 'laser-hair-removal',
    overview: [
      'Laser hair removal works by heating melanin in the hair follicle — which means treated skin has absorbed real thermal energy and behaves like mildly sunburned skin for a day or two. Aftercare focuses on cooling, friction avoidance, and the single most important rule of the entire treatment course: strict sun avoidance, because UV exposure on lasered skin dramatically raises the risk of burns and pigmentation at the next session.',
      'Clients also need to understand the shedding cycle. Treated hairs fall out over 1-3 weeks and can look like regrowth, prompting "it didn\'t work" messages. A written aftercare sheet that explains shedding, the 4-6 week session rhythm, and the no-plucking rule keeps clients compliant across the 6-8 sessions a full course requires.',
    ],
    timeline: [
      { phase: 'First 24 hours', window: '0-24 hours', description: 'Redness and perifollicular edema (goosebump-like swelling around follicles) are normal. Cool compresses and aloe vera soothe the area. Loose clothing over treated zones.' },
      { phase: 'Settling', window: 'Days 1-3', description: 'Redness resolves. Skin may feel mildly sensitive or itchy — moisturize and do not scratch.' },
      { phase: 'Shedding', window: 'Weeks 1-3', description: 'Treated hairs push out and fall away. This looks like regrowth but is dead hair exiting the follicle. Gentle exfoliation from week 2 helps.' },
      { phase: 'Regrowth window', window: 'Weeks 4-6', description: 'Surviving follicles enter a new growth cycle — this timing is exactly when the next session should land for maximum efficacy.' },
    ],
    dos: [
      'Apply cool compresses or pure aloe vera gel to soothe treated areas',
      'Moisturize daily with a bland, fragrance-free lotion',
      'Use SPF 30+ on any treated area exposed to daylight — every day, between every session',
      'Wear loose, breathable clothing over treated zones for 48 hours',
      'Shave (never wax or pluck) between sessions if needed',
      'Gently exfoliate from week 2 to help shedding hairs release',
    ],
    donts: [
      'No sun exposure or sunbeds on treated areas for 2 weeks before and after each session',
      'No hot baths, saunas, or steam rooms for 24-48 hours',
      'No waxing, plucking, or epilating between sessions — it removes the follicle the laser needs to target',
      'No exercise or heavy sweating for 24 hours',
      'No fragranced products, deodorant (if underarms treated), or actives on the area for 24-48 hours',
      'No scratching itchy treated skin — use moisturizer or a cool compress instead',
    ],
    redFlags: [
      'Blistering, crusting, or skin breakdown (possible burn) — photograph and contact the clinic',
      'Strong pain persisting beyond the first day',
      'Signs of infection: spreading redness, heat, pus',
      'Hyper- or hypopigmentation appearing in the weeks after treatment',
      'Hives or widespread itching beyond the treated zone',
    ],
    clinicNotes: [
      'Make the sun-avoidance rule impossible to miss: it is the leading cause of burns and the main reason sessions get postponed.',
      'Explain the shedding-vs-regrowth distinction at session one — it pre-empts the most common "it isn\'t working" complaint in the entire treatment course.',
      'Record device settings per session per area; consistent escalation across the course depends on it, especially with multiple practitioners.',
    ],
    extraFaq: [
      { q: 'Can clients shave after laser hair removal?', a: 'Yes — shaving is safe between sessions once any redness has settled (usually 24-48 hours). Waxing and plucking are the methods to avoid.' },
      { q: 'Why do hairs appear to grow after a session?', a: 'Treated hairs are pushed out of the follicle over 1-3 weeks. It resembles growth but is shedding — gentle exfoliation helps it along.' },
      { q: 'How many laser hair removal sessions are needed?', a: 'Most areas need 6-8 sessions spaced 4-6 weeks apart, because the laser only destroys follicles in the active growth phase — about 20% of hairs at any one time.' },
      { q: 'Is laser hair removal aftercare different for darker skin tones?', a: 'The steps are the same but pigmentation vigilance is higher: strict SPF, no heat exposure for 48 hours, and report any darkening or lightening of treated skin early.' },
    ],
    related: ['dermaplaning', 'coolsculpting', 'hydrafacial'],
  },
  {
    slug: 'dermaplaning',
    overview: [
      'Dermaplaning removes the outermost layer of dead skin cells and vellus hair with a surgical blade — leaving skin smoother and more product-receptive, but also temporarily stripped of part of its protective barrier. Aftercare is short and simple compared with deeper treatments, but the 48-hour window matters: freshly planed skin absorbs actives far more aggressively and burns in the sun far more easily.',
      'Because dermaplaning is often a recurring monthly treatment, a clear aftercare routine also protects the long-term relationship: clients who get irritation from applying retinol the same evening tend to blame the treatment, not their skincare timing.',
    ],
    timeline: [
      { phase: 'Same day', window: '0-24 hours', description: 'Skin may look slightly pink and feel unusually smooth and tight. Hydrating serum and moisturizer only — no actives, ideally no makeup until the next morning.' },
      { phase: 'Day 1-2', window: '24-48 hours', description: 'Sensitivity settles. Continue gentle products and strict SPF. Makeup is fine from day 1 if skin is calm.' },
      { phase: 'Back to normal', window: 'Days 3-7', description: 'Reintroduce retinoids and exfoliating acids from around day 3 if there is no lingering irritation. Glow typically lasts 3-4 weeks until the cycle repeats.' },
    ],
    dos: [
      'Apply hydrating serum and a bland moisturizer immediately after treatment',
      'Use broad-spectrum SPF 30+ daily — freshly exfoliated skin burns fast',
      'Keep skincare minimal for 48 hours: cleanser, hydrator, SPF',
      'Sleep on a clean pillowcase the first night',
      'Book the next session at 3-4 weeks to maintain results',
    ],
    donts: [
      'No retinoids, AHAs/BHAs, or scrubs for 48-72 hours',
      'No direct sun exposure or sunbeds for at least 48 hours',
      'No swimming pools, saunas, or hot yoga for 24-48 hours',
      'No waxing or threading on treated skin for 1 week',
      'Avoid heavy makeup for the first 24 hours where possible',
      'Do not touch the face with unwashed hands while the barrier recovers',
    ],
    redFlags: [
      'Persistent redness or stinging beyond 48 hours',
      'Breakout of whiteheads or pustules in the days after (can indicate product occlusion or contamination)',
      'Any nick or graze that shows signs of infection',
      'Burning reaction after applying a product — stop the product and contact the clinic',
    ],
    clinicNotes: [
      'Tell clients exactly which night they can resume retinol — vague "when skin feels normal" instructions produce same-evening retinol burns.',
      'Dermaplaning pairs well immediately before peels or facials; if combined, hand out the aftercare sheet of the deeper treatment instead.',
      'Reassure clients in writing that vellus hair does not grow back thicker — it remains the single most common dermaplaning question.',
    ],
    extraFaq: [
      { q: 'Does facial hair grow back thicker after dermaplaning?', a: 'No. Vellus ("peach fuzz") hair regrows at the same thickness and color — the blunt-tip feel of regrowth is temporary texture, not a structural change.' },
      { q: 'How often can clients get dermaplaning?', a: 'Every 3-4 weeks, matching the skin\'s natural cell-turnover cycle. More frequent sessions add irritation without added benefit.' },
      { q: 'Can clients wear makeup after dermaplaning?', a: 'It is best to wait until the next morning. If makeup is unavoidable, use clean brushes and mineral formulas after at least a few hours.' },
      { q: 'Why does skincare sting slightly after dermaplaning?', a: 'With the dead outer layer removed, products penetrate more effectively — mild tingling from hydrators is normal, but actual burning means the product is too strong for freshly planed skin.' },
    ],
    related: ['hydrafacial', 'chemical-peel', 'microneedling'],
  },
  {
    slug: 'hydrafacial',
    overview: [
      'HydraFacial is one of the gentlest treatments in aesthetics — a vortex of cleansing, light acid exfoliation, extraction, and serum infusion with essentially zero downtime. Aftercare is therefore less about managing injury and more about protecting the investment: the serums infused during treatment keep working for hours, and the wrong follow-up (heavy makeup, actives, heat) blunts the result the client just paid for.',
      'A short, branded aftercare card also reinforces the maintenance rhythm. HydraFacial results visibly fade after about a week; clinics that pair the aftercare sheet with a 4-6 week rebooking prompt convert a one-off glow into a recurring membership habit.',
    ],
    timeline: [
      { phase: 'First hours', window: '0-6 hours', description: 'Skin looks luminous, occasionally very slightly flushed. Let the infused serums absorb — no additional skincare and ideally no makeup until the next day.' },
      { phase: 'Same evening', window: '6-24 hours', description: 'A gentle cleanse and bland moisturizer are fine before bed. Mild tightness or light flaking in dry areas can occur and is brief.' },
      { phase: 'Peak glow', window: 'Days 1-7', description: 'Hydration and radiance peak. Resume actives from around 48 hours. SPF daily.' },
      { phase: 'Maintenance', window: 'Weeks 4-6', description: 'Results taper; this is the ideal rebooking window for sustained skin health.' },
    ],
    dos: [
      'Let the infused serums work — skip extra skincare on treatment day',
      'Stay well hydrated to extend the plumping effect',
      'Use broad-spectrum SPF 30+ daily',
      'Resume your normal routine (including actives) after about 48 hours',
      'Book the next session at 4-6 weeks for cumulative results',
    ],
    donts: [
      'No makeup for the rest of the treatment day where possible',
      'No retinoids or exfoliating acids for 48 hours',
      'No intense heat — saunas, steam, hot yoga — for 24-48 hours',
      'No waxing or laser on the face for 48-72 hours',
      'No at-home exfoliation for 72 hours — the treatment already resurfaced the skin',
    ],
    redFlags: [
      'Redness or irritation persisting beyond 24-48 hours',
      'Breakout beyond 1-2 small purging spots after extraction',
      'Hives, itching, or rash (possible serum sensitivity)',
      'Any blistering or skin breakdown — not expected from this treatment, review promptly',
    ],
    clinicNotes: [
      'HydraFacial aftercare is short — use the space on your sheet to include the rebooking offer and membership pitch while the glow is at its peak.',
      'Note which booster serums were used on each visit; sensitivities are easier to trace and upsells easier to personalize.',
      'Advise clients to schedule HydraFacials 2-3 days before events, when the glow peaks and any rare flushing has settled.',
    ],
    extraFaq: [
      { q: 'Is there any downtime after a HydraFacial?', a: 'Practically none — most clients return to normal activities immediately. Mild flushing, if it occurs, settles within a few hours.' },
      { q: 'Why do some clients break out after a HydraFacial?', a: 'Extractions can bring forming congestion to the surface — one or two small spots within a few days is purging, not a reaction, and clears quickly.' },
      { q: 'How often should clients get a HydraFacial?', a: 'Every 4-6 weeks aligns with the skin cycle. Monthly memberships are the most common cadence for maintaining results.' },
      { q: 'Can a HydraFacial be combined with other treatments?', a: 'Yes — it pairs well before injectables (same day, treatment first) but should be spaced at least 48-72 hours from peels, microneedling, or laser.' },
    ],
    related: ['dermaplaning', 'chemical-peel', 'microneedling'],
  },
  {
    slug: 'microblading',
    overview: [
      'Microblading deposits pigment into the upper dermis through fine manual strokes — it is a cosmetic tattoo, and the healed result depends as much on the 14-day aftercare as on the artist\'s work. The healing brow goes through dramatic visible phases: too dark in week one, patchy and "missing" during scabbing, then softly returning as the skin finishes regenerating. Clients who have not been briefed in writing panic at exactly the wrong moments.',
      'Pigment retention is the other stake. Moisture, sweat, sun, and picking are the four enemies of retention; a clear daily-routine sheet (how to clean, when to apply balm, what to avoid) is the difference between a crisp healed result at the 6-week touch-up and a patchy one needing heavy rework.',
    ],
    timeline: [
      { phase: 'Days 1-2', window: '0-48 hours', description: 'Brows look 30-50% darker and bolder than the final result. Gently blot lymph fluid as instructed. Keep them dry.' },
      { phase: 'Days 3-5', window: 'Days 3-5', description: 'Light scabbing forms over the strokes. Itching begins — do not scratch or pick. Apply the provided balm sparingly if instructed.' },
      { phase: 'Days 5-10', window: 'Days 5-10', description: 'Scabs flake off, often taking visible pigment with them — brows can look patchy or too light. This is the "ghosting" phase and it is temporary.' },
      { phase: 'Weeks 2-4', window: 'Days 10-28', description: 'Pigment re-emerges from deeper layers as skin finishes regenerating. True healed color settles.' },
      { phase: 'Touch-up', window: 'Weeks 6-8', description: 'The perfecting session fills any areas with lighter retention and finalizes the shape. Healing aftercare repeats.' },
    ],
    dos: [
      'Follow the exact cleaning routine your artist specifies (typically gentle blotting day 1-2, then light cleansing)',
      'Apply the supplied healing balm in a rice-grain amount only when instructed',
      'Sleep on your back to keep brows off the pillow during the first week',
      'Keep hair, hats, and fringes off the brow area',
      'Attend the 6-8 week touch-up — it is part of the treatment, not an optional extra',
    ],
    donts: [
      'No water on the brows beyond the prescribed cleaning for 7-10 days — no soaking, swimming, or steamy showers',
      'Do not pick, scratch, or rub scabbing brows — pulled scabs take pigment with them and can scar',
      'No makeup, brow products, or skincare actives on the area for 2 weeks',
      'No heavy sweating, gym sessions, or saunas for 7-10 days',
      'No sun exposure or sunbeds for 2 weeks; SPF on healed brows long-term',
      'No retinoids or exfoliants near the brows during healing (and they fade pigment long-term)',
    ],
    redFlags: [
      'Spreading redness, swelling, heat, or yellow discharge (infection — rare but needs prompt review)',
      'Excessive oozing beyond light lymph in the first 48 hours',
      'Severe itching with rash extending beyond the brow area (possible pigment allergy)',
      'Fever or feeling unwell in the days after the procedure',
    ],
    clinicNotes: [
      'Hand over the day-by-day timeline in print — the dark phase and ghosting phase generate panicked messages on a predictable schedule without it.',
      'Photograph immediately post-procedure and at the touch-up; retention comparisons guide pigment and depth choices for the perfecting pass.',
      'Confirm contraindications (pregnancy, retinoid use, keloid history, recent Botox in the area) at booking, not in the chair.',
    ],
    extraFaq: [
      { q: 'Why do microbladed brows look so dark at first?', a: 'Fresh pigment sits in the epidermis and oxidizes on contact with air, reading 30-50% darker than the healed result. The color softens substantially as skin heals over it.' },
      { q: 'What if pigment seems to disappear during healing?', a: 'During the scabbing phase, healed skin temporarily veils the pigment — the "ghosting" phase. Color re-emerges over weeks 2-4 as the skin clarifies.' },
      { q: 'When can clients wash their eyebrows normally?', a: 'After 7-10 days, once all scabbing has naturally shed, normal gentle washing can resume.' },
      { q: 'How long does microblading last?', a: 'Typically 12-24 months depending on skin type (oily skin fades faster), sun exposure, and skincare habits. Annual color-boost sessions maintain the result.' },
    ],
    related: ['lip-blush', 'dermaplaning', 'botox'],
  },
  {
    slug: 'lip-blush',
    overview: [
      'Lip blush is a cosmetic tattoo on one of the most vascular, high-movement areas of the face — which makes its aftercare both more intensive and more important than brow work. Lips crack, flake, and re-form within days; pigment retention depends on keeping them continuously moisturized while the surface regenerates, and on the client resisting the urge to pick the inevitable flaking.',
      'There is also a medical wrinkle unique to lips: herpes simplex. Any history of cold sores means the trauma of the procedure can trigger an outbreak that damages the healing result — antiviral prophylaxis and written warning signs belong in every lip blush aftercare protocol.',
    ],
    timeline: [
      { phase: 'Days 1-2', window: '0-48 hours', description: 'Lips are swollen and the color looks intensely dark and saturated — often alarming. Blot lymph gently, apply the provided balm, drink through a straw.' },
      { phase: 'Days 3-5', window: 'Days 3-5', description: 'Swelling resolves; lips feel dry and tight as flaking starts. Keep them constantly coated in healing balm. Do not pick.' },
      { phase: 'Days 5-10', window: 'Days 5-10', description: 'Flaking completes and the color suddenly looks very light or "gone" — the ghosting phase. Pigment is settling under fresh skin.' },
      { phase: 'Weeks 3-6', window: 'Days 14-42', description: 'True color blooms back to its settled shade — typically 30-50% softer than day one. Touch-up at 6-8 weeks completes the result.' },
    ],
    dos: [
      'Keep lips continuously moisturized with the provided healing balm for the first 10 days',
      'Drink through a straw for the first 2-3 days',
      'Cut food into small bites and dab the mouth clean after eating',
      'Take prescribed antivirals if you have any cold sore history',
      'Sleep slightly elevated the first two nights to limit swelling',
      'Use SPF lip balm long-term once healed — sun is the main cause of premature fading',
    ],
    donts: [
      'Do not pick or bite flaking skin — it pulls pigment and creates patchy healed results',
      'No spicy, acidic, or very hot foods for the first week',
      'No lipstick or lip products other than the healing balm for 10-14 days',
      'No kissing, oral contact, or touching with unwashed hands during healing',
      'No swimming, saunas, or heavy sweating for 7-10 days',
      'No whitening toothpaste or mouthwash with alcohol during the first week',
    ],
    redFlags: [
      'Tingling, burning, or clustered blisters (cold sore outbreak) — start antivirals and inform the artist',
      'Spreading redness, heat, swelling, or pus after day 3 (infection signs)',
      'Severe swelling that worsens instead of improving after 48 hours',
      'Rash or itching spreading beyond the lip line (possible pigment sensitivity)',
    ],
    clinicNotes: [
      'Screen for HSV history at booking and prescribe or recommend prophylaxis starting 1-2 days pre-procedure — an outbreak mid-healing can permanently scar the result.',
      'Warn clients in writing about the ghosting phase around day 7; it is the single biggest source of "my color fell out" messages.',
      'Photograph at the appointment and the touch-up under identical lighting — lip color is exceptionally light-sensitive in photos.',
    ],
    extraFaq: [
      { q: 'How dark will lips be right after lip blush?', a: 'Expect the color to look 30-50% darker and more saturated than the final result for the first few days. It softens dramatically as the lips heal and flake.' },
      { q: 'Can clients brush their teeth after lip blush?', a: 'Yes, carefully — use a small amount of non-whitening toothpaste, keep the brush off the lips, and dab the mouth dry afterward.' },
      { q: 'How long does lip blush last?', a: 'Typically 2-4 years, fading gradually. Sun exposure, smoking, and exfoliating lip products shorten the lifespan; annual refreshes keep color crisp.' },
      { q: 'What happens at the lip blush touch-up?', a: 'At 6-8 weeks the artist evaluates healed retention and evens out any light or patchy areas. The same aftercare routine applies for the second healing round.' },
    ],
    related: ['microblading', 'lip-filler', 'botox'],
  },
  {
    slug: 'dermal-fillers',
    overview: [
      'Dermal filler aftercare manages a predictable inflammatory arc — swelling and possible bruising that peak within 48 hours and resolve over a week — while watching for the one complication that cannot wait: vascular occlusion. Hyaluronic acid fillers in the cheeks, jawline, chin, and nasolabial folds settle over roughly two weeks, and patient behavior in the first 48 hours (heat, pressure, exercise, alcohol) measurably affects bruising and early migration risk.',
      'Written aftercare matters most for expectation-setting: filler areas can look asymmetric while swelling resolves unevenly, and firm spots commonly soften on their own. A branded sheet with a clear timeline and explicit emergency signs reduces anxious follow-up calls and gets genuine emergencies through the door faster.',
    ],
    timeline: [
      { phase: 'First 24 hours', window: '0-24 hours', description: 'Swelling, tenderness, and possible pinpoint bruising at injection sites. Cold compresses in short intervals. Avoid pressure on the area — including glasses on a treated nose bridge.' },
      { phase: 'Swelling peak', window: '24-48 hours', description: 'The treated area may look fuller or slightly uneven. Normal. Continue avoiding heat, alcohol, and exercise.' },
      { phase: 'Settling', window: 'Days 3-14', description: 'Swelling resolves and the filler integrates with tissue. Mild firmness or small nodules typically soften without intervention.' },
      { phase: 'Final result', window: 'Week 2-4', description: 'Result is stable and assessable. Any persistent asymmetry or firm nodules should be reviewed now.' },
      { phase: 'Longevity', window: '6-24 months', description: 'Duration varies by product and area: lips 6-12 months, cheeks and jawline 12-24 months.' },
    ],
    dos: [
      'Apply cloth-wrapped cold compresses for 10-minute intervals on day one',
      'Sleep on your back, slightly elevated, for the first two nights',
      'Stay well hydrated — HA filler binds water for its final effect',
      'Use arnica for bruising-prone areas',
      'Wait 2 weeks before judging symmetry and volume',
      'Keep the 2-week review appointment if your clinic offers one',
    ],
    donts: [
      'No strenuous exercise for 24-48 hours',
      'No alcohol for 24 hours',
      'No saunas, steam, sunbeds, or prolonged heat for 1 week',
      'No massaging or pressing the treated area unless specifically instructed',
      'No facials, face-down massage, or facial waxing for 2 weeks',
      'No dental procedures for 2 weeks after perioral or cheek filler where possible',
    ],
    redFlags: [
      'Blanching, dusky/mottled discoloration, or severe escalating pain — possible vascular occlusion, contact the clinic immediately (time-critical)',
      'Vision changes, eye pain, or sudden headache after treatment — emergency, seek immediate care',
      'Skin breakdown or ulceration in the days after treatment',
      'Signs of infection: spreading redness, warmth, pus, fever',
      'Firm, painful, or growing lumps weeks after treatment (possible delayed nodule) — book a review',
    ],
    clinicNotes: [
      'Print the occlusion warning signs and your emergency contact line on every filler aftercare sheet — minutes matter with vascular events.',
      'Document product, batch, and volumes per area; delayed nodules and corrections are far easier to manage with complete records.',
      'Advise clients to schedule filler at least 2 weeks before major events so swelling fully resolves and any touch-up fits in.',
    ],
    extraFaq: [
      { q: 'How long does swelling last after dermal fillers?', a: 'Swelling peaks at 24-48 hours and largely resolves within a week. The final, settled result is visible at around 2 weeks.' },
      { q: 'Can clients fly after dermal fillers?', a: 'Most practitioners suggest waiting 24-48 hours, primarily to stay near the clinic during the highest-risk window for early complications.' },
      { q: 'Are lumps after filler normal?', a: 'Soft, small irregularities in the first 2 weeks usually settle as the filler integrates. Firm, painful, or enlarging lumps need an injector review.' },
      { q: 'When can makeup be applied after filler?', a: 'After 24 hours, once injection points have closed — using clean brushes and gentle pressure.' },
    ],
    related: ['lip-filler', 'botox', 'prp-microneedling'],
  },
  {
    slug: 'prp-microneedling',
    overview: [
      'PRP microneedling — the "vampire facial" — combines standard microneedling channels with the patient\'s own platelet-rich plasma applied into open skin. Aftercare carries one rule that overrides everything else: the PRP must stay on. Washing the face too early rinses away the growth factors the treatment exists to deliver, so the first 12-24 hours follow a strict no-wash, no-product, no-touch protocol.',
      'Beyond that window, care mirrors standard microneedling — sun protection, bland products, staged reintroduction of actives — but with slightly longer redness (the plasma intensifies the inflammatory response that drives collagen). Clients who understand this in writing tolerate the 48-72 hour red phase without alarm.',
    ],
    timeline: [
      { phase: 'PRP absorption', window: '0-12/24 hours', description: 'Do not wash the face or apply anything — the plasma continues absorbing through open channels. Skin looks red and feels tight, like a strong sunburn.' },
      { phase: 'First wash', window: 'Hours 12-24', description: 'Rinse with lukewarm water only, or a bland cleanser if your provider approves. Apply the supplied HA serum. Still no makeup or actives.' },
      { phase: 'Red phase', window: 'Days 1-3', description: 'Redness fades to pink; flaking and dryness common. Gentle products and mineral SPF only.' },
      { phase: 'Recovery', window: 'Days 4-7', description: 'Skin normalizes. Actives can return from day 5-7. Glow improves progressively.' },
      { phase: 'Collagen response', window: 'Weeks 2-8', description: 'Texture, tone, and scar improvements develop as growth factors stimulate collagen remodeling. Series of 3 sessions spaced 4-6 weeks is standard.' },
    ],
    dos: [
      'Leave the PRP undisturbed on the skin for the full window your provider specifies (typically 12-24 hours)',
      'Sleep on a clean pillowcase, on your back, the first night',
      'Use only provider-approved bland products for the first 72 hours',
      'Apply mineral SPF 30+ daily from day 2',
      'Stay hydrated and skip alcohol for 24-48 hours',
      'Complete the full series for cumulative collagen results',
    ],
    donts: [
      'Do not wash the face or apply any product during the initial absorption window',
      'No makeup for 48-72 hours',
      'No retinoids, acids, or vitamin C for 5-7 days',
      'No gym, saunas, swimming, or heavy sweating for 72 hours',
      'No direct sun exposure for 1 week',
      'No anti-inflammatory medication (ibuprofen) for 48 hours unless medically required — inflammation is part of the mechanism',
    ],
    redFlags: [
      'Redness worsening after day 3 instead of improving',
      'Pustules, crusting, or honey-colored scabs (infection through open channels)',
      'Severe swelling, hives, or itching',
      'Cold sore eruption in HSV-positive clients',
      'Fever or feeling systemically unwell after treatment',
    ],
    clinicNotes: [
      'State the exact no-wash duration on the sheet — "overnight" vs "24 hours" varies by protocol, and clients will ask the moment they get home.',
      'Flag the ibuprofen caveat: many clients reflexively take anti-inflammatories for the redness, which works against the PRP mechanism.',
      'Schedule sessions at least a week before social events; PRP redness outlasts standard microneedling by a day or more.',
    ],
    extraFaq: [
      { q: 'When can clients wash their face after PRP microneedling?', a: 'Only after the absorption window set by the provider — typically 12-24 hours. Earlier washing rinses away the platelet growth factors that drive the result.' },
      { q: 'Is PRP microneedling downtime longer than regular microneedling?', a: 'Slightly — expect 48-72 hours of visible redness versus 24-48 for standard microneedling, because the plasma amplifies the regenerative inflammatory response.' },
      { q: 'How many PRP microneedling sessions are needed?', a: 'A series of 3 sessions spaced 4-6 weeks apart is the standard protocol, with maintenance once or twice a year.' },
      { q: 'Why avoid ibuprofen after PRP?', a: 'The treatment works through a controlled inflammatory cascade. NSAIDs blunt that cascade and may reduce the collagen-stimulating effect — use paracetamol if pain relief is needed.' },
    ],
    related: ['microneedling', 'chemical-peel', 'dermal-fillers'],
  },
  {
    slug: 'coolsculpting',
    overview: [
      'CoolSculpting (cryolipolysis) freezes fat cells, which the body then clears through the lymphatic system over one to three months — making it unique among aesthetic treatments: the "result" happens almost entirely during the aftercare period. Patients leave the appointment looking unchanged (often swollen) and need a written roadmap of what the next twelve weeks actually look like, or they conclude the treatment failed at week two.',
      'Aftercare itself is forgiving — there is no wound to protect — but the sensory journey is strange: numbness lasting weeks, tingling, itching as nerves wake up, and occasional late-onset soreness. The sheet should also name the rare complication worth knowing: paradoxical adipose hyperplasia (PAH), where the treated area enlarges instead of shrinking and needs clinical review.',
    ],
    timeline: [
      { phase: 'Right after', window: '0-24 hours', description: 'The treated area is red, swollen, firm, and may show temporary dimpling from the applicator. Massage performed in-clinic improves results. Numbness begins.' },
      { phase: 'First week', window: 'Days 1-7', description: 'Soreness like a deep bruise, tingling, and itching as sensation returns. Loose clothing and gentle movement help. Normal activity is fine from day one.' },
      { phase: 'Numb phase', window: 'Weeks 1-4', description: 'Numbness or altered sensation in the treated area is normal and resolves gradually. Some patients get brief late-onset soreness around week 2.' },
      { phase: 'Visible change', window: 'Weeks 4-8', description: 'The earliest visible fat reduction appears as the lymphatic system clears treated cells.' },
      { phase: 'Final result', window: 'Weeks 8-12+', description: 'Full result — typically a 20-25% fat reduction in the treated area. Assessment photos and any second-round planning happen now.' },
    ],
    dos: [
      'Resume normal activity immediately — movement supports lymphatic clearance',
      'Wear loose, comfortable clothing over the area for a few days',
      'Stay well hydrated throughout the clearing period',
      'Massage the area gently if your provider recommends it',
      'Take paracetamol for soreness if needed',
      'Photograph progress monthly — change is too gradual to perceive day-to-day',
    ],
    donts: [
      'Do not expect visible change before week 4 — the mechanism takes weeks by design',
      'No anti-inflammatories (ibuprofen) in the first days unless advised — some providers prefer not to blunt the inflammatory clearing response',
      'Avoid very hot baths or heat packs on a numb area (burn risk while sensation is reduced)',
      'Do not treat unexplained new hardness or growth in the area as normal — have it reviewed',
      'Avoid significant weight gain during the result period — remaining fat cells can still expand',
    ],
    redFlags: [
      'The treated area becoming progressively larger, firmer, and more defined months after treatment (possible paradoxical adipose hyperplasia — needs clinical assessment)',
      'Severe pain unresponsive to simple analgesia',
      'Blistering or skin damage over the treated zone',
      'Numbness persisting beyond 4-6 weeks without improvement',
    ],
    clinicNotes: [
      'Set the 12-week expectation at consult, in writing, with the aftercare sheet — premature "it didn\'t work" refund requests are almost always an expectations failure.',
      'Standardize photo conditions (lighting, distance, posture) at baseline, week 6, and week 12; the result is invisible without controlled comparison.',
      'Mention PAH honestly with its approximate rarity — patients who learn about it from the internet instead of from you trust you less.',
    ],
    extraFaq: [
      { q: 'How long does numbness last after CoolSculpting?', a: 'Numbness or altered sensation typically lasts 1-4 weeks as nerves recover from the cold exposure. It resolves on its own.' },
      { q: 'Can clients exercise after CoolSculpting?', a: 'Yes — same day if comfortable. There is no wound to protect, and movement supports the lymphatic clearance that delivers the result.' },
      { q: 'Why does the area look swollen instead of smaller?', a: 'Inflammation is the first stage of the clearing process. Swelling settles over the first week; fat reduction only becomes visible from week 4 onward.' },
      { q: 'How many CoolSculpting sessions are needed?', a: 'Each session reduces fat in the treated area by roughly 20-25%. Many patients do a second round after the 12-week assessment to deepen the result.' },
    ],
    related: ['laser-hair-removal', 'dermal-fillers', 'hydrafacial'],
  },
  {
    slug: 'tca-peel',
    overview: [
      'TCA (trichloroacetic acid) peels are medium-depth — meaningfully deeper than the superficial glycolic or lactic peels most clients have experienced — and the aftercare expectations need to match. Skin frosts during treatment, darkens and tightens over the first two days, then sheets off dramatically between days 3 and 7. The recovery is a genuine commitment, and the payoff (texture, pigmentation, fine lines, acne scarring) depends on the client following the protocol exactly.',
      'The two non-negotiables are the same as any peel, amplified: zero picking (medium-depth peels can scar where skin is pulled prematurely) and aggressive sun protection for a minimum of four to six weeks, because the fresh skin underneath is exceptionally vulnerable to post-inflammatory hyperpigmentation.',
    ],
    timeline: [
      { phase: 'Day 0-1', window: '0-24 hours', description: 'Skin feels tight, hot, and looks red to bronze. Apply only the prescribed occlusive ointment. No water on the face beyond gentle rinsing per protocol.' },
      { phase: 'Darkening', window: 'Days 1-3', description: 'Treated skin darkens to brown and feels leathery — this is the old skin preparing to detach. Continue ointment; do not pull at edges.' },
      { phase: 'Peeling', window: 'Days 3-7', description: 'Skin sheets off in large sections, starting around the mouth. Moisturize heavily, trim hanging edges with clean scissors only, never pull.' },
      { phase: 'Fresh skin', window: 'Days 7-14', description: 'New skin is pink, smooth, and fragile. Bland products and strict SPF. Pinkness can persist for 2-4 weeks.' },
      { phase: 'Final result', window: 'Weeks 4-8', description: 'Pigment correction and texture improvements fully visible. Subsequent TCA peels, if needed, are spaced 3-6 months apart.' },
    ],
    dos: [
      'Apply the prescribed healing ointment exactly on schedule for the first days',
      'Moisturize generously and constantly through the peeling phase',
      'Trim (never pull) hanging skin with clean scissors if it catches',
      'Use broad-spectrum SPF 50 daily for at least 4-6 weeks, reapplied at midday',
      'Sleep on your back with a clean pillowcase during the peeling week',
      'Take any prescribed antivirals exactly as directed if you have cold sore history',
    ],
    donts: [
      'Do not pick or pull peeling skin under any circumstance — premature removal of medium-depth peel can scar permanently',
      'No retinoids, acids, scrubs, or actives until your provider clears them (typically 2+ weeks)',
      'No direct sun exposure for 4-6 weeks; no sunbeds for 3 months',
      'No exercise, saunas, or heavy sweating until peeling completes (sweat stings and macerates detaching skin)',
      'No makeup until peeling is fully complete and skin is closed',
      'No waxing, threading, or laser on treated skin for at least a month',
    ],
    redFlags: [
      'Weeping, oozing, or honey-colored crusting (infection on de-epithelialized skin needs prompt treatment)',
      'Cold sore outbreak — can spread across healing skin without fast antiviral treatment',
      'Severe pain rather than tightness and stinging',
      'Areas healing with raised, firm, or rope-like texture (early scarring signs — review urgently)',
      'New dark patches forming on healed skin (post-inflammatory hyperpigmentation — early intervention helps)',
    ],
    clinicNotes: [
      'TCA aftercare deserves a day-by-day printed protocol with your emergency line — this is the treatment in your menu where aftercare failures have permanent consequences.',
      'Prescribe antiviral prophylaxis for any HSV history before peeling — an outbreak across a medium-depth peel is a genuine emergency.',
      'Book the day-3 or day-4 check (even by photo message) into the protocol; it catches infections and picking early, inside the intervention window.',
    ],
    extraFaq: [
      { q: 'How long does TCA peel recovery take?', a: 'Active peeling lasts about a week. Pinkness persists 2-4 weeks, and strict sun protection is needed for 4-6 weeks while the new skin matures.' },
      { q: 'Can clients work during TCA peel recovery?', a: 'Remote work, yes. Client-facing work is realistic from around day 7-10, once sheeting completes. Most clients plan the peel around a quiet week.' },
      { q: 'How is TCA aftercare different from a light peel?', a: 'Every element is amplified: occlusive ointment instead of simple moisturizer, a strict no-water window, longer activity restrictions, and 4-6 weeks of sun protection instead of two.' },
      { q: 'How often can TCA peels be repeated?', a: 'Medium-depth TCA peels are typically spaced 3-6 months apart, with skin fully healed and pre-conditioned before each round.' },
    ],
    related: ['chemical-peel', 'microneedling', 'dermaplaning'],
  },
]

export function getProcedureContent(slug: string): ProcedureContent | undefined {
  return PROCEDURE_CONTENT.find((c) => c.slug === slug)
}
