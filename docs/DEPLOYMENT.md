# Owner control and governance

## Super admin setup

Use environment variables or a secure setup script to create the owner account. Do not commit fixed credentials into source control.

Example:

```bash
export ADMIN_EMAIL=owner@example.com
export ADMIN_PASSWORD='replace_with_secure_password'
```

## Owner rights

The owner can:
- add/remove drivers
- manage trip settings
- adjust fare rules
- update driver access
- view trip history
- send notifications
- manage releases
- keep the source and APK under their ownership

## Backup process

Example PostgreSQL dump:

```bash
pg_dump -U postgres -d nammaride > nammaride_backup.sql
```

## Rule

The project owner retains full control of the codebase, database, deployment, backup, and release keys.
