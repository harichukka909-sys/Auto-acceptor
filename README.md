# Owner control and governance

## Super admin setup

The project owner must create the initial super admin using environment variables or a secure bootstrap script. Do not commit a fixed username and password into source control.

Example:

```bash
export ADMIN_EMAIL=owner@example.com
export ADMIN_PASSWORD='replace_with_a_long_secret'
```

## Owner rights

The admin can:
- create or disable driver accounts
- manage trip requests
- assign fare rules
- configure app settings
- send notifications
- export backups
- deploy app versions
- sign APKs with their own keystore

## Backup process

Use PostgreSQL logical or physical backups. Example:

```bash
pg_dump -U postgres -d nammaride > nammaride_backup.sql
```

Store backups in a secure owner-controlled environment.

## Ownership requirement

The project owner must retain full control of:
- GitHub repository
- database
- environment variables
- signing keystore
- deployment server
- APKs

This is a free software system. The owner is never locked into a single vendor.
