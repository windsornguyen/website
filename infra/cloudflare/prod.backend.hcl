bucket                      = "windsornguyen-com-terraform-state"
key                         = "cloudflare/prod/terraform.tfstate"
region                      = "auto"
skip_credentials_validation = true
skip_metadata_api_check     = true
skip_region_validation      = true
skip_requesting_account_id  = true
skip_s3_checksum            = true
use_path_style              = true
endpoints = {
  s3 = "https://461c3e3410e2e50b0fdd218f9ae04957.r2.cloudflarestorage.com"
}
