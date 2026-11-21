# Static assets (self-hosted web fonts, images) served from cdn.windsornguyen.com.
# Kept separate from the Terraform state bucket so public reads never touch state.
resource "cloudflare_r2_bucket" "cdn" {
  account_id    = var.cloudflare_account_id
  name          = "windsornguyen-com-cdn"
  location      = "WNAM"
  storage_class = "Standard"
}

resource "cloudflare_r2_custom_domain" "cdn" {
  account_id  = var.cloudflare_account_id
  bucket_name = cloudflare_r2_bucket.cdn.name
  domain      = "cdn.${var.zone_name}"
  zone_id     = var.cloudflare_zone_id
  enabled     = true
  min_tls     = "1.2"
}
