"""
Promote a user to admin from the command line.

Usage (run from the backend/ directory, with the same virtualenv/deps used
to run the API):

    python scripts/set_admin.py kd8260@gmail.com
    python scripts/set_admin.py kd8260

Matches on email, username, or the local part of the email (so "kd8260"
matches "kd8260@gmail.com"). Connects to whichever database DATABASE_URL /
the MySQL_* env vars point to (same config the API server uses), falling
back to the local SQLite dev database if MySQL isn't reachable.
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.session import SessionLocal  # noqa: E402
from app.models.domain import User  # noqa: E402


def main():
    if len(sys.argv) != 2:
        print("Usage: python scripts/set_admin.py <email-or-username>")
        sys.exit(1)

    identifier = sys.argv[1].strip()
    local_part = identifier.split("@")[0]

    db = SessionLocal()
    try:
        user = (
            db.query(User)
            .filter(
                (User.email == identifier)
                | (User.username == identifier)
                | (User.email.like(f"{local_part}@%"))
                | (User.username == local_part)
            )
            .first()
        )

        if not user:
            print(f"No user found matching '{identifier}'.")
            print("They need to log in / sign up at least once before this script can find them.")
            sys.exit(1)

        user.is_admin = True
        db.commit()
        print(f"'{user.email}' (id={user.id}) is now an admin.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
