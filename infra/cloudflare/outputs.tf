output "worker_name" {
  description = "Cloudflare Worker service name."
  value       = cloudflare_worker.website.name
}

output "custom_domains" {
  description = "Custom domains attached to the Worker."
  value = sort([
    for domain in cloudflare_workers_custom_domain.website : domain.hostname
  ])
}
