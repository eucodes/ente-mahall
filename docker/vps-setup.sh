#!/usr/bin/env bash
# =============================================================================
# Mahalle SaaS — VPS First-Time Setup Script
# Domain: mahallapp.eucodes.tech
# =============================================================================
# Run this script ONCE on a fresh Ubuntu/Debian VPS as root or with sudo.
# Usage:
#   curl -sL <raw-url-of-this-script> | bash
#   OR: chmod +x vps-setup.sh && sudo ./vps-setup.sh
# =============================================================================
set -euo pipefail

DEPLOY_USER="mahalle"
DEPLOY_PATH="/var/www/mahalle"
REPO_URL="https://github.com/eucodes/ente-mahall.git"

echo "=== [1/7] System update ==="
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git nginx certbot python3-certbot-nginx ufw wget

echo "=== [2/7] Install Docker ==="
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | bash
fi
systemctl enable --now docker

echo "=== [3/7] Create deploy user ==="
if ! id "$DEPLOY_USER" &>/dev/null; then
  useradd -m -s /bin/bash "$DEPLOY_USER"
fi
usermod -aG docker "$DEPLOY_USER"

echo "=== [4/7] Set up deploy directory ==="
mkdir -p "$DEPLOY_PATH"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_PATH"

echo "=== [5/7] Clone / pull repo ==="
sudo -u "$DEPLOY_USER" bash -c "
  if [ -d '$DEPLOY_PATH/.git' ]; then
    cd '$DEPLOY_PATH' && git pull
  else
    git clone '$REPO_URL' '$DEPLOY_PATH'
  fi
"

echo "=== [6/7] Configure Nginx ==="
cat > /etc/nginx/sites-available/mahalle.conf << 'NGINX'
# ── API ──────────────────────────────────────────────────────────────────────
server {
    listen 80;
    server_name api.mahallapp.eucodes.tech;

    location / {
        proxy_pass         http://127.0.0.1:4007;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade            $http_upgrade;
        proxy_set_header   Connection         "upgrade";
        proxy_set_header   Host               $host;
        proxy_set_header   X-Real-IP          $remote_addr;
        proxy_set_header   X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto  $scheme;
        client_max_body_size 20M;
    }
}

# ── Web + wildcard subdomains ─────────────────────────────────────────────────
server {
    listen 80;
    server_name mahallapp.eucodes.tech
                admin.mahallapp.eucodes.tech
                control.mahallapp.eucodes.tech
                *.mahallapp.eucodes.tech;

    location / {
        proxy_pass         http://127.0.0.1:3007;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade            $http_upgrade;
        proxy_set_header   Connection         "upgrade";
        proxy_set_header   Host               $host;
        proxy_set_header   X-Real-IP          $remote_addr;
        proxy_set_header   X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto  $scheme;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/mahalle.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "=== [7/7] Firewall ==="
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

echo ""
echo "============================================================"
echo " VPS setup complete!"
echo "============================================================"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Copy the env template and fill in your secrets:"
echo "   sudo -u $DEPLOY_USER cp $DEPLOY_PATH/.env.prod.example $DEPLOY_PATH/.env.prod"
echo "   sudo -u $DEPLOY_USER nano $DEPLOY_PATH/.env.prod"
echo ""
echo "2. Issue SSL certificates (after DNS is pointed at this VPS):"
echo "   certbot --nginx -d $DOMAIN -d *.$DOMAIN"
echo "   # Note: wildcard cert requires DNS challenge, not HTTP"
echo "   # Or issue per-subdomain certs individually:"
echo "   certbot --nginx -d $DOMAIN -d admin.$DOMAIN -d control.$DOMAIN -d api.$DOMAIN"
echo ""
echo "3. Add GitHub Actions secrets in your repo (Settings → Secrets → Actions):"
echo "   VPS_HOST           = $(curl -s ifconfig.me)"
echo "   VPS_USER           = $DEPLOY_USER"
echo "   VPS_SSH_KEY        = <private key whose public half is in ~$DEPLOY_USER/.ssh/authorized_keys>"
echo "   VPS_DEPLOY_PATH    = $DEPLOY_PATH"
echo "   NEXT_PUBLIC_API_URL        = https://api.$DOMAIN/api/v1"
echo "   NEXT_PUBLIC_ROOT_DOMAIN    = $DOMAIN"
echo ""
echo "4. Push to main — CI runs, images are built and deployed automatically."
