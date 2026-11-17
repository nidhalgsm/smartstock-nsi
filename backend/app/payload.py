"""Pure helpers (no imports) so they can be unit-tested anywhere."""


def drop_repair_columns(data, is_repair, current=None):
    """A normal phone never writes the 'repaired phone' columns (is_repair, owner_name).
    So saving/editing an ordinary phone works even on a database where migration 005 was not run yet."""
    if not is_repair and not (current or {}).get("is_repair"):
        data.pop("is_repair", None)
        data.pop("owner_name", None)
    return data
