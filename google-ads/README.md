# Google Ads Automation — MindFlow Research

Automate creation of a $100/day Search campaign to drive traffic to the donation page and track conversions.

## Prerequisites

1. **Google Ads account** — [ads.google.com](https://ads.google.com)
2. **Developer token** — [API Center](https://ads.google.com/aw/apicenter) (apply for Basic access)
3. **OAuth credentials** — [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 Client ID (Desktop app)
   - Run the [generate_refresh_token.py](https://github.com/googleads/google-ads-python/blob/main/examples/authentication/authenticate_in_desktop_application.py) example to get a refresh token

## Setup

```bash
cd google-ads
pip install -r requirements.txt
cp google-ads.yaml.example google-ads.yaml
# Edit google-ads.yaml with your credentials
```

Place `google-ads.yaml` in this directory or in your home directory (`~/google-ads.yaml`).

## Create Campaign

```bash
python create_campaign.py \
  --customer-id "123-456-7890" \
  --landing-url "https://yoursite.com/donate"
```

- **customer-id**: Your Google Ads customer ID (with or without dashes)
- **landing-url**: Your deployed donation page URL

The script creates:
- **Budget**: $100/day
- **Campaign**: Search, PAUSED (enable when ready)
- **Ad group**: ADHD research keywords
- **Responsive Search Ad**: Headlines and descriptions
- **Keywords**: ADHD screening, research, etc.

UTM parameters are appended automatically for tracking.

## Conversion Tracking

1. In Google Ads: **Tools & Settings** → **Conversions** → **New conversion action** → **Website**
2. Choose "Add a conversion action manually"
3. Name: "Donation completed"
4. Value: 1 (or leave blank)
5. Count: One
6. Get your **Conversion ID** (AW-XXXXXXXXX) and **Conversion label**

7. Add to your app's `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
   NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXX
   ```

8. Redeploy. Conversions will fire when users reach the thank-you page.

## Measuring Donations

- **Google Ads**: Conversions report shows donations attributed to ad clicks
- **Your data**: `data/submissions/` — count JSON files for total donations
- **UTM params**: Use `utm_source=google` to filter ad-driven traffic in analytics

## Troubleshooting

- **"Developer token not approved"**: Use Test account or apply for Basic access
- **"Invalid customer ID"**: Remove dashes or use 10-digit format
- **OAuth errors**: Regenerate refresh token with `authenticate_in_desktop_application.py`
