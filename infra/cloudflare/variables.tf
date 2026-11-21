variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the Worker."
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for windsornguyen.com."
  type        = string
}

variable "zone_name" {
  description = "Cloudflare zone name for the website."
  type        = string
  default     = "windsornguyen.com"
}

variable "worker_name" {
  description = "Cloudflare Worker service name used by Wrangler deploys."
  type        = string
  default     = "windsornguyen-com"
}

variable "custom_domains" {
  description = "Hostnames routed directly to the website Worker."
  type        = set(string)
  default = [
    "windsornguyen.com",
    "www.windsornguyen.com",
  ]
}
