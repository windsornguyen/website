resource "cloudflare_worker" "website" {
  account_id = var.cloudflare_account_id
  name       = var.worker_name

  observability = {
    enabled = true
  }

  subdomain = {
    enabled          = true
    previews_enabled = true
  }
}

resource "cloudflare_workers_custom_domain" "website" {
  for_each = var.custom_domains

  account_id = var.cloudflare_account_id
  hostname   = each.value
  service    = cloudflare_worker.website.name
  zone_id    = var.cloudflare_zone_id
  zone_name  = var.zone_name
}
