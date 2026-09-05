#!/usr/bin/env python3
"""Validate the repository-level contract for the ITT TOLD'EM Shopify theme."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FAILURES: list[str] = []


def require(condition: bool, message: str) -> None:
    if not condition:
        FAILURES.append(message)


def load_shopify_json(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"^\s*/\*.*?\*/\s*", "", text, flags=re.DOTALL)
    try:
        return json.loads(text)
    except json.JSONDecodeError as error:
        FAILURES.append(f"Invalid JSON in {path.relative_to(ROOT)}: {error}")
        return {}


def validate_structure() -> None:
    required_dirs = (
        "assets",
        "blocks",
        "config",
        "layout",
        "locales",
        "sections",
        "snippets",
        "templates",
    )
    for directory in required_dirs:
        require((ROOT / directory).is_dir(), f"Missing required theme directory: {directory}")

    json_paths = [
        *(ROOT / "config").glob("*.json"),
        *(ROOT / "sections").glob("*.json"),
        *(ROOT / "templates").glob("*.json"),
    ]
    for path in sorted(json_paths):
        load_shopify_json(path)

    schema_pattern = re.compile(r"{%\s*schema\s*%}(.*?){%\s*endschema\s*%}", re.DOTALL)
    for directory in ("blocks", "sections"):
        for path in sorted((ROOT / directory).glob("*.liquid")):
            for schema in schema_pattern.findall(path.read_text(encoding="utf-8")):
                try:
                    json.loads(schema)
                except json.JSONDecodeError as error:
                    FAILURES.append(f"Invalid schema in {path.relative_to(ROOT)}: {error}")


def validate_homepage() -> None:
    homepage = load_shopify_json(ROOT / "templates/index.json")
    sections = homepage.get("sections", {})
    house = next(
        (section for section in sections.values() if section.get("type") == "ittoldem-house"),
        None,
    )
    require(house is not None, "ITT TOLD'EM homepage section is not active in templates/index.json")
    if house is None:
        return

    settings = house.get("settings", {})
    image_settings = (
        "hero_image",
        "apparel_image",
        "flagline_image",
        "lab_image",
        "denim_image",
        "wehair_image",
    )
    for setting in image_settings:
        image = settings.get(setting, "")
        require(
            isinstance(image, str) and image.startswith("shopify://shop_images/"),
            f"Homepage setting {setting} must reference a Shopify-hosted image",
        )

    required_destinations = (
        "hero_link",
        "category_link_1",
        "gvo_link",
        "category_link_3",
        "category_link_4",
        "wehair_link",
        "lab_link",
        "story_link",
        "editorial_link_2",
    )
    for setting in required_destinations:
        require(bool(settings.get(setting)), f"Homepage destination {setting} is blank")
    require(bool(settings.get("featured_collection")), "Homepage current-release collection is blank")

    section_text = (ROOT / "sections/ittoldem-house.liquid").read_text(encoding="utf-8")
    schemas = re.findall(r"{%\s*schema\s*%}(.*?){%\s*endschema\s*%}", section_text, re.DOTALL)
    require(len(schemas) == 1, "ITT homepage section must contain exactly one schema")
    if len(schemas) == 1:
        schema = json.loads(schemas[0])
        require(schema.get("name") == "ITT TOLD'EM House", "ITT homepage schema name changed")
        setting_ids = {setting.get("id") for setting in schema.get("settings", [])}
        for setting in image_settings:
            require(setting in setting_ids, f"ITT homepage schema is missing {setting}")

    css = (ROOT / "assets/ittoldem-house.css").read_text(encoding="utf-8")
    require(len(css) > 1000, "ITT design stylesheet is unexpectedly empty")


def validate_destinations() -> None:
    views = ("about", "custom", "flagline", "gvo", "lab", "wehair")
    for view in views:
        require(
            (ROOT / f"templates/search.{view}.json").is_file(),
            f"Missing search destination template: {view}",
        )


def validate_hygiene() -> None:
    source_suffixes = {".css", ".js", ".json", ".liquid", ".md", ".yml", ".yaml"}
    source_paths = [path for path in ROOT.rglob("*") if path.is_file() and path.suffix in source_suffixes]
    conflict_marker = re.compile(r"^(?:<{7}|={7}|>{7})(?:\s|$)", re.MULTILINE)
    stale_asset_reference = re.compile(r"itt-(?:final|new)-[^\"')\s]+\.webp")

    for path in source_paths:
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8")
        require(
            conflict_marker.search(text) is None,
            f"Merge conflict marker in {path.relative_to(ROOT)}",
        )
        require(
            stale_asset_reference.search(text) is None,
            f"Stale campaign asset reference in {path.relative_to(ROOT)}",
        )

    for pattern in ("itt-final-*.webp", "itt-new-*.webp"):
        for path in (ROOT / "assets").glob(pattern):
            FAILURES.append(f"Corrupt legacy campaign asset still present: {path.relative_to(ROOT)}")

    for workflow in (ROOT / ".github/workflows").glob("*.yml"):
        text = workflow.read_text(encoding="utf-8")
        require("contents: write" not in text, f"Self-mutating workflow permission in {workflow.relative_to(ROOT)}")
        require("git push" not in text, f"Self-mutating workflow command in {workflow.relative_to(ROOT)}")


def main() -> None:
    validate_structure()
    validate_homepage()
    validate_destinations()
    validate_hygiene()
    if FAILURES:
        details = "\n".join(f"- {failure}" for failure in FAILURES)
        raise SystemExit(f"ITT storefront validation failed:\n{details}")
    print("ITT TOLD'EM storefront validation passed.")


if __name__ == "__main__":
    main()
