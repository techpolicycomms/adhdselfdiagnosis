#!/usr/bin/env python3
"""
Create a Google Ads Search campaign for MindFlow Research with $100 budget.

Prerequisites:
1. Google Ads account (ads.google.com)
2. Developer token from API Center (ads.google.com/aw/apicenter)
3. OAuth credentials (google-ads.yaml or env vars)

Usage:
  python create_campaign.py --customer-id 123-456-7890 --landing-url https://yoursite.com/donate
"""

import argparse
import datetime
import sys
from pathlib import Path

try:
    from google.ads.googleads.client import GoogleAdsClient
    from google.ads.googleads.errors import GoogleAdsException
except ImportError:
    print("Install: pip install google-ads")
    sys.exit(1)


# $100/day = 100 * 1_000_000 micros
DAILY_BUDGET_MICROS = 100 * 1_000_000

KEYWORDS = [
    "ADHD screening test",
    "ADHD self assessment",
    "ADHD questionnaire adults",
    "ADHD research study",
    "contribute to ADHD research",
    "ADHD symptoms test",
]

AD_HEADLINES = [
    "Help ADHD Research",
    "5-Min Donation for Science",
    "Anonymous & Free",
    "Contribute Today",
]

AD_DESCRIPTIONS = [
    "Donate 5 min to help researchers understand ADHD better. 100% anonymous.",
    "Answer 6 questions, optionally share cookie patterns. No sign-up required.",
]


def main(
    customer_id: str,
    landing_url: str,
    config_path: str | None = None,
) -> None:
    """Create campaign, ad group, ads, and keywords."""
    # Remove dashes from customer ID (e.g. 123-456-7890 -> 1234567890)
    customer_id_clean = customer_id.replace("-", "")

    if config_path and Path(config_path).exists():
        client = GoogleAdsClient.load_from_storage(config_path, version="v23")
    else:
        client = GoogleAdsClient.load_from_storage(version="v23")

    try:
        # 1. Create budget
        budget_resource = create_budget(client, customer_id_clean)
        print(f"Created budget: {budget_resource}")

        # 2. Create campaign
        campaign_resource = create_campaign(
            client, customer_id_clean, budget_resource, landing_url
        )
        campaign_id = campaign_resource.split("/")[-1]
        print(f"Created campaign: {campaign_resource}")

        # 3. Create ad group
        ad_group_resource = create_ad_group(client, customer_id_clean, campaign_id)
        ad_group_id = ad_group_resource.split("/")[-1]
        print(f"Created ad group: {ad_group_resource}")

        # 4. Create responsive search ad
        create_responsive_search_ad(
            client, customer_id_clean, ad_group_id, landing_url
        )
        print("Created responsive search ad")

        # 5. Add keywords
        create_keywords(client, customer_id_clean, ad_group_id)
        print("Added keywords")

        print("\n✓ Campaign created successfully.")
        print("  Campaign is PAUSED. Enable it in Google Ads when ready to run.")
        print(f"  Landing URL: {landing_url}")
        print("  Add UTM params to your ad destination for tracking: ?utm_source=google&utm_medium=cpc&utm_campaign=adhd_research")

    except GoogleAdsException as ex:
        print(f"\nGoogle Ads API error (request ID: {ex.request_id}):")
        for err in ex.failure.errors:
            print(f"  - {err.message}")
            if err.location:
                for loc in err.location.field_path_elements:
                    print(f"    Field: {loc.field_name}")
        sys.exit(1)


def create_budget(client: GoogleAdsClient, customer_id: str) -> str:
    budget_op = client.get_type("CampaignBudgetOperation")
    budget = budget_op.create
    budget.name = "MindFlow Research - $100/day"
    budget.delivery_method = client.enums.BudgetDeliveryMethodEnum.STANDARD
    budget.amount_micros = DAILY_BUDGET_MICROS

    response = client.get_service("CampaignBudgetService").mutate_campaign_budgets(
        customer_id=customer_id,
        operations=[budget_op],
    )
    return response.results[0].resource_name


def create_campaign(
    client: GoogleAdsClient,
    customer_id: str,
    budget_resource: str,
    landing_url: str,
) -> str:
    campaign_op = client.get_type("CampaignOperation")
    campaign = campaign_op.create
    campaign.name = "MindFlow ADHD Research - Donate for Science"
    campaign.advertising_channel_type = client.enums.AdvertisingChannelTypeEnum.SEARCH
    campaign.status = client.enums.CampaignStatusEnum.PAUSED  # Start paused
    campaign.manual_cpc.CopyFrom(client.get_type("ManualCpc")())
    campaign.campaign_budget = budget_resource

    campaign.network_settings.target_google_search = True
    campaign.network_settings.target_search_network = True
    campaign.network_settings.target_partner_search_network = False
    campaign.network_settings.target_content_network = False

    campaign.contains_eu_political_advertising = (
        client.enums.EuPoliticalAdvertisingStatusEnum.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING
    )

    start = datetime.date.today() + datetime.timedelta(days=1)
    end = start + datetime.timedelta(days=30)
    campaign.start_date = start.strftime("%Y-%m-%d")
    campaign.end_date = end.strftime("%Y-%m-%d")

    response = client.get_service("CampaignService").mutate_campaigns(
        customer_id=customer_id,
        operations=[campaign_op],
    )
    return response.results[0].resource_name


def create_ad_group(
    client: GoogleAdsClient,
    customer_id: str,
    campaign_id: str,
) -> str:
    ad_group_op = client.get_type("AdGroupOperation")
    ad_group = ad_group_op.create
    ad_group.name = "ADHD Research - Donate"
    ad_group.status = client.enums.AdGroupStatusEnum.ENABLED
    ad_group.campaign = client.get_service("CampaignService").campaign_path(
        customer_id, campaign_id
    )
    ad_group.type_ = client.enums.AdGroupTypeEnum.SEARCH_STANDARD
    ad_group.cpc_bid_micros = 2_000_000  # $2 max CPC

    response = client.get_service("AdGroupService").mutate_ad_groups(
        customer_id=customer_id,
        operations=[ad_group_op],
    )
    return response.results[0].resource_name


def create_responsive_search_ad(
    client: GoogleAdsClient,
    customer_id: str,
    ad_group_id: str,
    landing_url: str,
) -> None:
    def ad_text_asset(text: str):
        asset = client.get_type("AdTextAsset")
        asset.text = text
        return asset

    ad_group_ad_op = client.get_type("AdGroupAdOperation")
    ad_group_ad = ad_group_ad_op.create
    ad_group_ad.ad_group = client.get_service("AdGroupService").ad_group_path(
        customer_id, ad_group_id
    )
    ad_group_ad.status = client.enums.AdGroupAdStatusEnum.ENABLED

    rsa = ad_group_ad.ad.responsive_search_ad
    rsa.headlines.extend([ad_text_asset(h) for h in AD_HEADLINES])
    rsa.descriptions.extend([ad_text_asset(d) for d in AD_DESCRIPTIONS])
    rsa.path1 = "donate"
    rsa.path2 = "research"
    ad_group_ad.ad.final_urls.append(landing_url)

    client.get_service("AdGroupAdService").mutate_ad_group_ads(
        customer_id=customer_id,
        operations=[ad_group_ad_op],
    )


def create_keywords(
    client: GoogleAdsClient,
    customer_id: str,
    ad_group_id: str,
) -> None:
    operations = []
    for keyword in KEYWORDS:
        op = client.get_type("AdGroupCriterionOperation")
        criterion = op.create
        criterion.ad_group = client.get_service("AdGroupService").ad_group_path(
            customer_id, ad_group_id
        )
        criterion.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
        criterion.keyword.text = keyword
        criterion.keyword.match_type = client.enums.KeywordMatchTypeEnum.BROAD
        criterion.cpc_bid_micros = 1_500_000  # $1.50
        operations.append(op)

    client.get_service("AdGroupCriterionService").mutate_ad_group_criteria(
        customer_id=customer_id,
        operations=operations,
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Create Google Ads campaign for MindFlow Research ($100 budget)"
    )
    parser.add_argument(
        "-c",
        "--customer-id",
        required=True,
        help="Google Ads customer ID (e.g. 123-456-7890)",
    )
    parser.add_argument(
        "-u",
        "--landing-url",
        required=True,
        help="Landing page URL (e.g. https://yoursite.com/donate)",
    )
    parser.add_argument(
        "--config",
        help="Path to google-ads.yaml (default: ~/google-ads.yaml)",
    )
    args = parser.parse_args()

    # Append UTM params to landing URL for tracking
    sep = "&" if "?" in args.landing_url else "?"
    landing_url = f"{args.landing_url}{sep}utm_source=google&utm_medium=cpc&utm_campaign=adhd_research"

    main(
        customer_id=args.customer_id,
        landing_url=landing_url,
        config_path=args.config,
    )
