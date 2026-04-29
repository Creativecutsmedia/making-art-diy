# Making Art DIY — Project Context

## Backup System (auto-configured)

This project is automatically backed up to a Synology DS225+ NAS on the local network.

### Backup paths
- **Source (working dir):** `/home/malik/making-art-diy/`
- **NAS mount in WSL:** `/mnt/nas/Webshop/`
- **Memory backup:** `/mnt/nas/Webshop-claude-memory/` (Claude Code memory mirror)
- **Meta files:** `/mnt/nas/Webshop/.backup-meta/` (script, crontab, fstab, gitconfig, bashrc, claude.json, wsl.conf)
- **NAS shared folder:** `MakingArtDiy/Webshop/` on HomeServer (192.168.0.205)

### Automatic backup
- **Cron runs every 15 min** via `/home/malik/backup-nas.sh`
- Backs up: project + Claude Code memory + meta-files
- Excludes `node_modules/`
- Uses `--delete` flag (NAS mirrors local state)
- Logs to `/home/malik/backup-nas.log`

### Manual backup
Run `backup-nas` in WSL terminal to sync immediately.

### NAS snapshots (recovery)
- Hourly snapshots of MakingArtDiy folder on NAS
- Retention: 24 hourly + 7 daily + 2 weekly + 1 monthly
- Recover via DSM: Snapshot Replication → Recovery
- File browse: DSM → File Station → MakingArtDiy → right-click → Browse Snapshot

### rsync flags (do not change)
NAS is mounted via SMB (drvfs), which doesn't support Linux permissions/ownership.
Backup script uses: `-rD --no-perms --no-owner --no-group --no-times`
DO NOT use `-a` flag — it will fail on this mount.

### If NAS mount missing after reboot
Run: `sudo mount -a`
fstab entry: `\\HomeServer\MakingArtDiy /mnt/nas drvfs defaults,user,uid=1000,gid=1000 0 0`

## Secrets Management

Sensitive credentials (GitHub PAT, future API keys) are stored in an
**encrypted shared folder** on the NAS, separated from the regular backup.

### Secrets folder
- **NAS shared folder:** `Secrets` (encrypted with 32-char key, key stored in NordPass)
- **Mount in WSL (when needed):** `/mnt/secrets/`
- **NOT auto-mounted** — must be unlocked in DSM and mounted manually

### Currently stored in Secrets
- `git-credentials.backup` — GitHub PAT (expiry 2026-07-23, rotation 2026-07-16)

### How to access secrets
1. In DSM, ensure Secrets folder is unlocked (Control Panel → Shared Folder → Encryption → Mount)
2. Mount in WSL: `sudo mount -t drvfs '\\HomeServer\Secrets' /mnt/secrets`
3. Use the file (e.g., copy back to `~/.git-credentials` if needed)
4. Unmount when done: `sudo umount /mnt/secrets`

### How to add new secrets
1. Mount Secrets folder (see above)
2. Copy file: `cp <secret-file> /mnt/secrets/`
3. Unmount: `sudo umount /mnt/secrets`

### DO NOT
- Put secrets in regular project folder (they will end up on NAS unencrypted)
- Commit secrets to git
- Add Secrets mount to fstab (defeats the manual-unlock security)

## Critical project files
- `netlify/functions/admin-products-create.js`
- `netlify/functions/lib/admin-product-validate.js`
- `netlify/functions/admin-products-write.js`
- `update-products.py`
- `docs/4.2-create-product-contract.md`
- `admin-v2/src/page_product_edit.jsx`
- `admin-v2/src/hooks.jsx`
- `admin-v2/src/i18n.jsx`
- `admin-v2/src/widgets.jsx`

## Environment
- WSL2 Ubuntu 24 on Windows 11
- Project lives in WSL filesystem, not Windows mount
- Git repo is at `.git/` (backed up to NAS)
- NAS: Synology DS225+ at 192.168.0.205 (HomeServer)
