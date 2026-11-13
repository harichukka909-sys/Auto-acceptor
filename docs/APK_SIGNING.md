# Owner control and governance

## Super admin setup

The project owner must create the initial owner/admin credentials using environment variables or a secure bootstrap script. Do not hardcode them in source code.

Example:

```bash
export ADMIN_EMAIL=owner@example.com
export ADMIN_PASSWORD='replace_with_secure_password'
```

The backend checks for these values and creates the first super admin during startup.

## Owner rights

The owner can:
- add or remove drivers
- manage trip requests
- modify fare and trip filters
- send notifications
- configure feature flags
- export records and backups
- update app versions
- sign APKs with their own keystore
- deploy on their own infrastructure

## Backup process

Use PostgreSQL backups such as:

```bash
pg_dump -U postgres -d nammaride > nammaride_backup.sql
```

Store those backups in secure owner-controlled storage.

## Ownership requirement

The project owner must retain complete control of:
- GitHub repository
- backend server
- PostgreSQL database
- environment variables
- signing keystore
- APK distribution
- deployment choices

This design prevents vendor lock-in and keeps the app under the owner's full authority.
