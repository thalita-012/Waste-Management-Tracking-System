## Environment setup

Copy `.env.example` to `.env`, then put your real database, JWT, and Bakong values in `.env`.

All application code reads environment values through `src/config/env.ts`, so if a setting name changes, update it there and in `.env.example`.

Do not put real Bakong tokens, database passwords, or JWT secrets directly inside source files.
