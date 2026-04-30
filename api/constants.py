"""Shared API constants."""

from __future__ import annotations

from typing import Final

ALLOWED_EVENT_TYPES: Final[tuple[str, ...]] = (
    "call_dial",
    "call_connect",
    "meeting_booked",
    "meeting_attended",
    "email_sent",
)

ALLOWED_SOURCES: Final[tuple[str, ...]] = (
    "outreach",
    "nooks",
    "manual",
    "zapier",
)
