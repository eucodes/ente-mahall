# VPS deployment

This deployment uses four containers: Next.js web, NestJS API, PostgreSQL, and Redis. Systemd owns the Docker Compose stack so it starts after reboots. Nginx is the only public-facing process; web and API listen on VPS loopback ports `3007` and `4007` respectively.

## DNS and firewall

Point these records to the VPS public IPv4 address before requesting a certificate:

- `A  mahallapp.eucodes.tech`
- `A  api.mahallapp.eucodes.tech`
- `A  *.mahallapp.eucodes.tech`

The wildcard record is required because tenant URLs use arbitrary subdomains. Open only SSH, HTTP, and HTTPS in the VPS firewall. Do not open 3007, 4007, 5432, or 6379.

## Add this application to an existing VPS

This server already runs other Next.js applications, so do not reinstall Docker, Nginx, Certbot, UFW, or remove Nginx's default site. Run the following as the existing deployment user that is already in the `docker` group. Replace the repository URL only.

```bash
sudo mkdir -p /var/www/mahalle
sudo chown "$USER":"$USER" /var/www/mahalle
git clone https://github.com/OWNER/REPOSITORY.git /var/www/mahalle
cp /var/www/mahalle/.env.prod.example /var/www/mahalle/.env.prod
nano /var/www/mahalle/.env.prod
```

In `.env.prod`, set `GITHUB_OWNER` to the lower-case GitHub owner. Use `openssl rand -hex 32` for the PostgreSQL password (hex is safe to embed in `DATABASE_URL`) and `openssl rand -hex 64` for all three application secrets. Keep `COOKIE_DOMAIN=.mahallapp.eucodes.tech`, `PORT=4007`, and the documented production URLs.

Install and enable the systemd service:

```bash
sudo cp /var/www/mahalle/docker/systemd/mahalle.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mahalle.service
```

Log in to GHCR once as this deployment user if images are private. Create a GitHub classic personal access token with `read:packages`, then run `echo TOKEN | docker login ghcr.io -u GITHUB_USER --password-stdin`.

## TLS and Nginx

First obtain a certificate. A wildcard certificate needs a DNS-01 challenge; the `certbot --nginx` HTTP challenge cannot issue it. Use your DNS provider's Certbot DNS plugin to create a certificate for both names. Then copy and enable the Nginx configuration:

```bash
sudo cp /var/www/mahalle/docker/nginx/mahalle.conf /etc/nginx/sites-available/mahalle.conf
sudo ln -sf /etc/nginx/sites-available/mahalle.conf /etc/nginx/sites-enabled/mahalle.conf
sudo nginx -t && sudo systemctl reload nginx
```

For a DNS provider without a Certbot plugin, issue the wildcard certificate through its DNS API/dashboard and place the resulting certificate paths in the Nginx file. Do not enable the HTTPS Nginx config before those certificate files exist.

## First application start

```bash
cd /var/www/mahalle && docker compose -f docker/docker-compose.prod.yml --env-file .env.prod pull
cd /var/www/mahalle && docker compose -f docker/docker-compose.prod.yml --env-file .env.prod run --rm --no-deps api prisma migrate deploy --schema ./prisma/schema.prisma
sudo systemctl start mahalle.service
curl --fail http://127.0.0.1:4007/health
```

## GitHub Actions CD

Pushes to `main` type-check, lint, and test the workspace, publish both images to GHCR, apply Prisma migrations, then replace only the web and API containers. Systemd starts the complete stack after a VPS reboot. Set these repository Action secrets:

- `VPS_HOST`: VPS IP address or hostname
- `VPS_USER`: the existing deployment user with Docker and Git access
- `VPS_SSH_KEY`: private key for the deploy user's authorized key

The first deployment must use a repository where the deploy user can `git fetch`. For a private repository, configure a deploy key on the VPS. The GitHub Container packages must also be public or the VPS must be logged in to GHCR as described above.

Useful operations:

```bash
systemctl status mahalle.service
cd /var/www/mahalle && docker compose -f docker/docker-compose.prod.yml --env-file .env.prod ps
cd /var/www/mahalle && docker compose -f docker/docker-compose.prod.yml --env-file .env.prod logs -f api web
```
