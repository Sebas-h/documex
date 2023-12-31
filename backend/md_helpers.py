from collections import OrderedDict
import os
from pathlib import Path
from typing import Literal, Sequence, TypedDict
from typing_extensions import Self
import re

from bs4 import BeautifulSoup
import cmarkgfm
from cmarkgfm.cmark import Options
import markdown
import pymdownx.emoji

# Directories to ignore
IGNORE_DIRS = [
    ".git",
    "node_modules",
    ".venv",
    "venv",
]


class FileTreeNodeFile(TypedDict):
    type: Literal["file"]
    name: str
    path: str
    id: str


class FileTreeNodeDir(TypedDict):
    type: Literal["directory"]
    name: str
    path: str
    id: str
    subtree: Sequence[FileTreeNodeFile | Self]


FileTree = Sequence[FileTreeNodeFile | FileTreeNodeDir]


def sort_dir_dict(d: dict):
    if all(map(lambda val: val is None, d.values())):
        # return sorted files
        return OrderedDict(sorted(d.items(), key=lambda p: p[0]))
    # iterate over directories
    dirs = OrderedDict(filter(lambda p: p[1] is not None, d.items()))
    ordered_dirs = OrderedDict(sorted(dirs.items(), key=lambda p: p[0]))
    for k in ordered_dirs.keys():
        ordered_dirs[k] = sort_dir_dict(d[k])
    files = OrderedDict(filter(lambda p: p[1] is None, d.items()))
    ordered_files = OrderedDict(sorted(files.items(), key=lambda p: p[0]))
    return OrderedDict(**ordered_dirs, **ordered_files)


def multi_replace(s: str, replacements: dict[str, str]) -> str:
    # Define a regex pattern to match inline code blocks, code blocks, links, and HTML tags
    pattern = r"(`.*?`|```.*?```|\[.*?\]\(.*?\)|<[^>]+>)"
    # Split the content by the pattern, capturing both matched and unmatched segments
    parts = re.split(pattern, s, flags=re.DOTALL)
    # Iterate through the parts
    for idx, part in enumerate(parts):
        # If the part doesn't match any of our patterns (i.e., it's not a code block, inline code, link, or HTML tag)
        # then perform the replacements
        if not (
            part.startswith("`")
            or part.startswith("```")
            or part.startswith("[")
            or part.startswith("<")
        ):
            for key, value in replacements.items():
                part = part.replace(key, value)
            parts[idx] = part
    # Join the parts back together
    return "".join(parts)


def add_markdown_attribute(md_string):
    return re.sub(r"<(\w+)(.*?)>", r'<\1\2 markdown="1">', md_string)


def markdown_to_html(md_content: str) -> str:
    options = (
        Options.CMARK_OPT_UNSAFE
        | Options.CMARK_OPT_GITHUB_PRE_LANG
        | Options.CMARK_OPT_SMART
        # | Options.CMARK_OPT_NORMALIZE
        # | Options.CMARK_OPT_NOBREAKS
        # | Options.CMARK_OPT_HARDBREAKS
    )
    html = cmarkgfm.github_flavored_markdown_to_html(md_content, options)
    # html = cmarkgfm.github_flavored_markdown_to_html(
    #     add_markdown_attribute(md_content), options
    # )
    # html = cmarkgfm.markdown_to_html(md_content, options)
    return html


def markdown_to_html_v2(md: str) -> str:
    extension_configs = {
        "pymdownx.emoji": {
            "emoji_generator": pymdownx.emoji.to_alt,
        }
    }
    # See: https://python-markdown.github.io/extensions/#officially-supported-extensions
    html = markdown.markdown(
        add_markdown_attribute(md),
        extensions=["extra", "sane_lists", "pymdownx.emoji"],
        extension_configs=extension_configs,
    )
    return html


def add_ids_to_headers(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    header_ids_count = {}
    for header in soup.find_all(["h1", "h2", "h3"]):
        # Generate ID
        header_id = header.get_text()
        header_id = header_id.strip().lower()
        header_id = header_id.replace(" ", "-")
        # Replace other non-URL-safe characters with dashes
        header_id = "".join(
            ch if ch.isalnum() or ch == "-" else "-" for ch in header_id
        )
        # Add leading `_` because CSS selectors cannot start with a number but
        # a header's text might
        header_id = f"_{header_id}"

        # Update header IDs count
        key = header_id
        header_ids_count[key] = (
            0 if key not in header_ids_count else header_ids_count[key] + 1
        )
        # If count for header_id > 0 prefix the count number to the ID to make it unique
        if header_ids_count[key] > 0:
            header_id += f"_{header_ids_count[key]}"

        # Set header id
        header["id"] = header_id
    return str(soup)


def extract_headers_on_page_nav(html_content):
    soup = BeautifulSoup(html_content, "html.parser")

    # Remove content inside <details> tags
    for details in soup.find_all("details"):
        details.extract()

    navigation_items = []
    current_h1 = None
    current_h2 = None

    for header in soup.find_all(["h1", "h2", "h3"]):
        # Ensure each header has an ID
        if not header.get("id"):
            header_id = header.get_text().strip().lower().replace(" ", "-")
            header["id"] = header_id

        item = {"name": header.get_text(), "id": header["id"], "children": []}

        # Check header level and structure the navigation accordingly
        if header.name == "h1":
            navigation_items.append(item)
            current_h1 = item
            current_h2 = None
        elif header.name == "h2":
            if current_h1:
                current_h1["children"].append(item)
                current_h2 = item
            else:
                navigation_items.append(item)
        elif header.name == "h3":
            if current_h2:
                current_h2["children"].append(item)
            elif current_h1:
                current_h1["children"].append(item)
            else:
                navigation_items.append(item)

    return navigation_items


def prepend_subdir(path: Path, subdir_name: Path) -> str:
    relative_path_str = Path(str(path)[1:]) if path.is_absolute() else path
    return str(subdir_name / relative_path_str)


def modify_image_paths(html_content: str, prepend_path: Path) -> str:
    soup = BeautifulSoup(html_content, "html.parser")
    for img_tag in soup.find_all("img"):
        src: str = img_tag["src"]
        if "://" not in src:
            new_src = prepend_subdir(Path(src), prepend_path)
            img_tag["src"] = "/" + new_src
    return str(soup)


def list_markdown_files_fn(path: str) -> FileTree:
    return _list_markdown_files_fn(path, path)


def _list_markdown_files_fn(base_dir: str, path: str) -> FileTree:
    """Recursively list markdown files and directories containing them."""
    structure: FileTree = []

    # List all files and directories in the current path
    for entry in os.listdir(path):
        full_path = os.path.join(path, entry)
        # If it's a markdown file, add it to the structure
        if os.path.isfile(full_path) and entry.endswith((".md", ".markdown")):
            rel_path = os.path.relpath(full_path, start=base_dir)
            md_file: FileTreeNodeFile = {
                "type": "file",
                "name": entry,
                "path": rel_path,
                "id": rel_path,
            }
            structure.append(md_file)
        # If it's a directory, process it recursively
        elif os.path.isdir(full_path) and entry not in IGNORE_DIRS:
            subdir_structure = _list_markdown_files_fn(base_dir, full_path)
            if subdir_structure:  # Only add non-empty subdirectories
                rel_path = os.path.relpath(full_path, start=base_dir)
                ft_dir: FileTreeNodeDir = {
                    "type": "directory",
                    "name": entry,
                    "path": rel_path,
                    "id": rel_path,
                    "subtree": subdir_structure,
                }
                structure.append(ft_dir)

    return structure


def fix_p_in_li_with_checkbox(html: str) -> str:
    """
    ```
    - [x] one
    - [ ] two

    - three
    - four
    ```
    Surrounds `three` and `four` in `<p>` which forces newline which we do
    not want. So here we remove <p> in side li
    """
    soup = BeautifulSoup(html, "html.parser")
    # Find all <li> elements containing an <input type="checkbox">
    for li in soup.find_all("li"):
        checkbox = li.find("input", {"type": "checkbox"})
        if checkbox:
            # Find all <p> tags inside the <li>
            for p in li.find_all("p"):
                p.replace_with(p.get_text())  # Replace <p> with its text content
    # print(soup.prettify())
    return str(soup)


# Src: https://fontawesome.com/icons/clipboard?f=classic&s=regular
CLIPBOARD_SVG = """
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 384 512"
  class="w-4 h-4"
  fill="currentColor"
  stroke="currentColor"
>
  <path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
</svg>
"""


def add_wrapper_and_copy_buttons_to_pre(html_content):
    soup = BeautifulSoup(html_content, "html.parser")

    # Find all <pre> elements
    for pre in soup.find_all("pre"):
        # Create a new button element
        button = soup.new_tag("button")
        # button.string = "Copy"
        button.append(BeautifulSoup(CLIPBOARD_SVG, "html.parser"))
        button["class"] = "copy-btn"

        # Create a wrapper div
        wrapper = soup.new_tag("div")
        wrapper["class"] = "pre-code-wrapper"

        # Replace pre with the wrapper and then append pre to the wrapper
        pre.replace_with(wrapper)
        wrapper.append(pre)

        # Append the button to the wrapper
        wrapper.append(button)

    return str(soup)


def sort_file_tree(ft: FileTree) -> FileTree:
    """Sort file tree. Firstly by directory first and secondly alphabetically

    Args:
        ft (FileTree): file tree to sort

    Returns:
        FileTree: sorted file tree
    """
    sorted_ft: FileTree = []
    sorted_level = sorted(ft, key=lambda elem: (elem["type"], elem["name"]))
    for node in sorted_level:
        if node["type"] == "directory":
            sorted_subtree = sort_file_tree(node["subtree"])
            sd: FileTreeNodeDir = {**node, "subtree": sorted_subtree}
            sorted_ft.append(sd)
        else:
            sorted_ft.append(node)
    return sorted_ft
