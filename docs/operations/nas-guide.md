# Synology NAS — Brugsguide

DS225+ på 192.168.0.205 (HomeServer). Projekt: `/home/malik/making-art-diy/`.

## 1. Hverdagsbrug

Manuel backup nu:

```
backup-nas
```

Tjek backup-log:

```
tail -10 ~/backup-nas.log
```

Tjek at NAS er mountet:

```
ls /mnt/nas/
```

Skal vise: `#recycle`, `Webshop`, `Webshop-claude-memory`.

## 2. Automatisk backup

Cron-job kører hvert 15. minut og synkroniserer:

- `/home/malik/making-art-diy/` → `/mnt/nas/Webshop/`
- Claude Code memory → `/mnt/nas/Webshop-claude-memory/`
- Meta-filer (script, crontab, fstab, configs) → `/mnt/nas/Webshop/.backup-meta/`

Ekskluderer: `node_modules/`.

## 3. Hvis NAS-mounten forsvinder

Auto-mount fra fstab:

```
sudo mount -a
```

Mount manuelt:

```
sudo mount -t drvfs '\\HomeServer\MakingArtDiy' /mnt/nas
```

Test forbindelse:

```
ping 192.168.0.205
```

## 4. Snapshots — rul tilbage i tiden

Hver time tager NAS et snapshot. Retention: 24 hourly, 7 daily, 2 weekly, 1 monthly.

Sådan finder du gamle versioner:

1. Åbn DSM: `http://192.168.0.205:5000`
2. Åbn **Snapshot Replication**
3. Klik **Recovery** i venstre menu
4. Vælg **MakingArtDiy**
5. Vælg snapshot (timestamp)
6. Klik **Browse** for at se filer
7. Højreklik fil/mappe → **Copy to**

## 5. Secrets-mappen (krypteret)

Indeholder GitHub PAT. Krypteringsnøgle (32 tegn) i NordPass.

### Trin 1: Lås op i DSM

Control Panel → Shared Folder → Secrets → Encryption → Mount.
Indsæt 32-tegns nøglen fra NordPass.

### Trin 2: Mount i WSL

```
sudo mkdir -p /mnt/secrets
sudo mount -t drvfs '\\HomeServer\Secrets' /mnt/secrets
```

### Trin 3: Brug filen

```
# Læs PAT-backup
cat /mnt/secrets/git-credentials.backup

# Eller restore til lokal fil
cp /mnt/secrets/git-credentials.backup ~/.git-credentials
chmod 600 ~/.git-credentials
```

### Trin 4: Unmount når du er færdig

```
sudo umount /mnt/secrets
```

### Tilføj nye hemmeligheder

```
sudo mount -t drvfs '\\HomeServer\Secrets' /mnt/secrets
cp ~/min-fil.txt /mnt/secrets/
sudo umount /mnt/secrets
```

**VIGTIGT:** Læg ALDRIG hemmeligheder i den almindelige projekt-mappe. De ender ukrypteret på NAS. Brug altid Secrets-mappen.

## 6. Helbredstjek

Kører cron?

```
sudo service cron status
```

Vis cron-jobs:

```
crontab -l
```

Er NAS mountet?

```
mountpoint /mnt/nas
```

Hvornår kørte backup sidst?

```
tail -5 ~/backup-nas.log
```

## 7. Disaster recovery (hvis WSL dør)

### Trin 1: Forbered ny WSL Ubuntu, opret bruger 'malik'

```
sudo apt update && sudo apt upgrade -y
sudo apt install -y rsync cron
```

### Trin 2: Mount NAS

```
sudo mkdir -p /mnt/nas
sudo mount -t drvfs '\\HomeServer\MakingArtDiy' /mnt/nas
```

### Trin 3: Genskab projektet

```
mkdir -p /home/malik/making-art-diy
rsync -rD --no-perms --no-owner --no-group --no-times \
    /mnt/nas/Webshop/ /home/malik/making-art-diy/
```

### Trin 4: Genskab Claude Code memory

```
mkdir -p /home/malik/.claude/projects/-home-malik-making-art-diy
rsync -rD --no-perms --no-owner --no-group --no-times \
    /mnt/nas/Webshop-claude-memory/ \
    /home/malik/.claude/projects/-home-malik-making-art-diy/
```

### Trin 5: Genskab backup-systemet

```
cp /mnt/nas/Webshop/.backup-meta/backup-nas.sh.copy ~/backup-nas.sh
chmod +x ~/backup-nas.sh

sudo cat /mnt/nas/Webshop/.backup-meta/fstab.txt >> /etc/fstab

crontab /mnt/nas/Webshop/.backup-meta/crontab.txt

cp /mnt/nas/Webshop/.backup-meta/gitconfig.copy ~/.gitconfig
cp /mnt/nas/Webshop/.backup-meta/bashrc.copy ~/.bashrc
source ~/.bashrc
```

### Trin 6: Restore GitHub PAT (lås Secrets op i DSM først)

```
sudo mkdir -p /mnt/secrets
sudo mount -t drvfs '\\HomeServer\Secrets' /mnt/secrets
cp /mnt/secrets/git-credentials.backup ~/.git-credentials
chmod 600 ~/.git-credentials
sudo umount /mnt/secrets
```

**Estimeret tid:** 1–2 timer (eksklusiv Ubuntu re-install).

## 8. Hurtig kommando-reference

| Hvad | Kommando |
|---|---|
| Manuel backup nu | `backup-nas` |
| Tjek backup-log | `tail -10 ~/backup-nas.log` |
| Tjek om NAS er mountet | `mountpoint /mnt/nas` |
| Mount NAS via fstab | `sudo mount -a` |
| Mount NAS manuelt | `sudo mount -t drvfs '\\HomeServer\MakingArtDiy' /mnt/nas` |
| Tjek cron-status | `sudo service cron status` |
| Vis cron-jobs | `crontab -l` |
| Rediger cron | `crontab -e` |
| Mount Secrets | `sudo mount -t drvfs '\\HomeServer\Secrets' /mnt/secrets` |
| Unmount Secrets | `sudo umount /mnt/secrets` |
| Læs PAT-backup | `cat /mnt/secrets/git-credentials.backup` |
| Test forbindelse | `ping 192.168.0.205` |
| Åbn DSM | Browser: `http://192.168.0.205:5000` |
| Se Webshop på NAS | `ls /mnt/nas/Webshop/` |
| Se memory-backup | `ls /mnt/nas/Webshop-claude-memory/` |
| Se backup-meta | `ls /mnt/nas/Webshop/.backup-meta/` |

## 9. Vedligeholdelse

- **Hver uge:** Tjek backup-log + se snapshots i DSM
- **Hver måned:** Storage Manager (disk-helbred), e-mail-notifikationer, DSM-opdateringer
- **Hvert halvår:** Test recovery, verificer Secrets, tjek NordPass-nøgle
- **Hvert år:** Test fuld disaster recovery, S.M.A.R.T.-test af disk

### Vigtige datoer

- **GitHub PAT udløber:** 23. juli 2026 (rotation senest 16. juli)
- **Tilføj disk 2:** ca. 5 måneder fra opsætning (~september 2026) for at få SHR-redundans
