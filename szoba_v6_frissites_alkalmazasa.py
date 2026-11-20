#!/usr/bin/env python3
"""Apply the verified v6 patch to index.html in the current directory."""
from pathlib import Path
import gzip
import json

base = Path(__file__).resolve().parent
target = base / "index.html"
patch_file = base / "szoba_v6_frissites.json.gz"
patch = json.loads(gzip.decompress(patch_file.read_bytes()))
lines = target.read_text(encoding="utf-8").splitlines(keepends=True)
line = lines[patch["line"]]
if len(line) != patch["old_length"]:
    raise SystemExit("Az eredeti index.html nem egyezik; a frissites leallt.")
for start, end, replacement in reversed(patch["edits"]):
    line = line[:start] + replacement + line[end:]
if len(line) != patch["new_length"]:
    raise SystemExit("Az ellenorzes sikertelen; a fajl valtozatlan.")
lines[patch["line"]] = line
target.write_text("".join(lines), encoding="utf-8")
print("A hatodik szobavaltozat eloallitva.")
