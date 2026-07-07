# Per Mile Invoice Calculation Flow – Requirement Context

## Context

The Per Mile Invoice Calculation flow is designed to automate invoice generation for pilot escorts whose compensation is based on the actual distance travelled during an assignment. The process relies on capturing odometer readings at the beginning and end of the escort to calculate mileage accurately and eliminate manual calculations.

Since mileage directly impacts pilot payouts and customer billing, the workflow must ensure that odometer evidence is collected, calculations are system-generated, and invoice values remain transparent and auditable. This approach minimizes disputes, prevents billing inaccuracies, and provides a standardized method for per-mile compensation.

The entire experience should guide pilots through a simple, step-by-step process from escort initiation to invoice submission while maintaining data integrity.

---

## User Story

**As a Pilot,** I want the system to automatically calculate my invoice based on the actual miles travelled during an escort, so that I receive accurate compensation without manually computing mileage or invoice amounts.

---

## Objective

The Per Mile Invoice Calculation flow exists to:

- Capture verifiable odometer readings before and after an escort.
- Automatically determine the total distance travelled.
- Calculate invoice amounts using the predefined per-mile rate.
- Support the addition of approved supplementary charges.
- Automatically apply platform deductions and taxes.
- Present pilots with a transparent invoice breakdown before submission.
- Reduce manual calculations and billing errors.
- Maintain evidence for future audits and dispute resolution.

---

## Functional Requirements

### Escort Start

The system shall require pilots to provide the following before beginning an escort:

- Starting odometer reading.
- Photograph of the odometer as supporting evidence.

The escort shall not begin until both requirements are completed.

---

### Escort Tracking

Once the escort is initiated, the system shall:

- Mark the job as In Progress.
- Record the escort start time.
- Maintain the active escort state until completion.
- Preserve the captured starting odometer information.

---

### Escort Completion

The system shall require pilots to provide the following to complete the escort:

- Ending odometer reading.
- Photograph of the ending odometer.

The escort shall not be completed unless both values are provided.

---

### Mileage Calculation

The system shall automatically calculate total mileage using the captured odometer values.

Calculation Method:

```
Distance Travelled = End Odometer − Start Odometer
```

The calculated mileage shall be read-only and not editable by pilots.

---

### Invoice Generation

The system shall generate an invoice automatically after mileage calculation.

The base invoice amount shall be calculated using:

```
Invoice Amount = Distance Travelled × Rate Per Mile
```

The applicable rate per mile shall be retrieved from the job configuration.

Pilots shall not manually modify the calculated mileage amount.

---

### Additional Charges

The invoice shall support approved supplementary charges, including but not limited to:

- Waiting Charges
- Layover Charges
- Other authorized adjustments

Additional charges shall be included in the invoice summary.

---

### Deductions and Taxes

The system shall automatically calculate applicable deductions, including:

- Platform fees
- Taxes
- Other configured deductions

The deduction calculations shall be displayed transparently within the invoice breakdown.

---

### Invoice Preview

Before submission, pilots shall be able to review:

- Starting odometer reading.
- Ending odometer reading.
- Total distance travelled.
- Rate per mile.
- Base mileage amount.
- Additional charges.
- Gross invoice amount.
- Deductions and taxes.
- Final payout amount.

---

### Invoice Submission

Pilots shall be able to submit the invoice after reviewing the calculated values.

Upon submission, the invoice shall be recorded against the completed escort.

---

## Business Requirements

- Mileage calculations must be automated to prevent manual errors.
- Odometer readings must be supported by photographic evidence.
- Invoice calculations must remain transparent and traceable.
- Pilots should clearly understand how their payout is derived.
- The process should reduce invoice disputes between stakeholders.
- All supporting evidence should be retained for audit purposes.
- Platform deductions and taxes must be applied consistently according to configured rules.
- The workflow should minimize the effort required to generate and submit invoices.

---

## Success Criteria

The design will be considered successful if pilots can:

- Complete mileage capture without confusion.
- Submit invoices without performing manual calculations.
- Understand how invoice totals and payouts are derived.
- Trust the accuracy of the generated invoice.
- Resolve disputes using stored odometer evidence when required.
- Complete the end-to-end invoicing process efficiently.