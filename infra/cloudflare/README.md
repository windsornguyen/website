# Cloudflare Terraform

This stack owns durable Cloudflare resources for `windsornguyen.com`.
Wrangler still owns bundling and deploying the React Router Worker.

## State backend

Create the R2 state bucket once before first init:

```sh
pnpm exec wrangler r2 bucket create windsornguyen-com-bucket
```

Then initialize Terraform with scoped R2 credentials in the environment:

```sh
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
terraform -chdir=infra/cloudflare init -backend-config=prod.backend.hcl
```

Do not commit state files, local backend files, API tokens, or R2 secrets.

## Local checks

```sh
pnpm infra:check
```

Plan production changes with the checked-in, non-secret IDs:

```sh
terraform -chdir=infra/cloudflare plan -var-file=prod.tfvars
```
