"""Rank helpers shared by the API data layer and HUD."""

from __future__ import annotations

RANK_ORDER = (
    "Iron",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Emerald",
    "Diamond",
    "Master",
    "Grandmaster",
    "Challenger",
)


def calculate_rank(meetings_booked: int) -> str:
    """Return the weekly rank for a meeting count."""
    if meetings_booked < 0:
        meetings_booked = 0
    return RANK_ORDER[min(meetings_booked, len(RANK_ORDER) - 1)]


def rank_index(name: str) -> int:
    """Return a rank's display order, or -1 for unknown names."""
    try:
        return RANK_ORDER.index(name)
    except ValueError:
        return -1
