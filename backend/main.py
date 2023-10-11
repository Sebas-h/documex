import os
from pathlib import Path
from urllib.parse import unquote

from flask import (
    Flask,
    abort,
    jsonify,
    send_from_directory,
    request,
)
from github_emojis import GITHUB_EMOJIS_MARKUP_TO_UNICODE
from md_helpers import (
    add_ids_to_headers,
    extract_headers_on_page_nav,
    fix_p_in_li_with_checkbox,
    list_markdown_files_fn,
    markdown_to_html,
    modify_image_paths,
    multi_replace,
    add_copy_buttons_inside_pre,
    sort_file_tree,
)

app = Flask(__name__, static_folder=".", static_url_path="")

# Directory containing markdown files
# MARKDOWN_DIR = "./"  # You can change this to the desired directory path
MARKDOWN_DIR = os.getenv("DOC_DIR", "../example_dir")

# Used as unique route to serve local assets (i.e. images) from
# (I'm this isn't the best solution but it works for now at least, should be
# looked at again in the future though)
MAGIC_ASSET_URL_PREFIX = "asset0d685bb"


@app.route(f"/asset/<path:filename>", methods=["GET"])
def serve_file(filename: str):
    # Remove url encoded characters like spaces
    # Necessary as the content of the body is taken from a URL at the client
    filename = unquote(filename)

    if not filename:
        return "Filename not provided", 400

    if ".." in filename or filename.startswith("/"):
        # Prevent directory traversal
        return "Invalid filename", 400

    try:
        # Use safe join to ensure it's within the directory and not navigating out
        return send_from_directory(MARKDOWN_DIR, filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)


@app.route("/list")
def list_markdown_files():
    """List all markdown files in the specified directory."""
    # NOTE: Not using Flask's `jsonify` bc it doesn't respect the key ordering
    # of a `OrderedDict`
    # js = json.dumps(sort_dir_dict(list_markdown_files_fn(MARKDOWN_DIR)))
    # TODO: fix the sort_dir_dict for this `list_..._v2()` fn return value
    md_files = sort_file_tree(list_markdown_files_fn(MARKDOWN_DIR))
    response = app.json.response(md_files)
    return response


# @app.route("/file/<filename>")
# def serve_markdown_as_html(filename):
#     """Serve the markdown file as HTML."""
#     if ".." in filename or filename.startswith("/"):
#         # Prevent directory traversal
#         return "Invalid filename", 400
#     file_path = os.path.join(MARKDOWN_DIR, filename)
#     if not os.path.exists(file_path):
#         return "File not found", 404
#     with open(file_path, "r") as file:
#         md_content = file.read()
#         html_content = markdown.markdown(md_content)
#         return render_template_string(html_content)


@app.route("/file", methods=["POST"])
def serve_markdown_as_html():
    """Serve the markdown file as HTML."""
    data = request.json
    if data is None:
        return "No filename given", 400

    filename = data.get("filename")

    # Remove url encoded characters like spaces
    # Necessary as the content of the body is taken from a URL at the client
    filename = unquote(filename)

    if not filename:
        return "Filename not provided", 400

    if ".." in filename or filename.startswith("/"):
        # Prevent directory traversal
        return "Invalid filename", 400

    file_path = os.path.join(MARKDOWN_DIR, filename)
    if not os.path.exists(file_path):
        return "File not found", 404

    with open(file_path, "r") as file:
        md_content = file.read()

    # Replace GitHub Emoji Markup with unicode representation
    md_content = multi_replace(md_content, GITHUB_EMOJIS_MARKUP_TO_UNICODE)

    # html_content = markdown.markdown(md_content)
    html_content = markdown_to_html(md_content)
    # html_content = markdown_to_html_v2(md_content)

    # Add headers
    html_content = add_ids_to_headers(html_content)

    # Modify image paths using BeautifulSoup
    pfn = Path(filename)
    basedir = Path(pfn.parts[0]) if len(pfn.parts) > 1 else Path()
    html_content = modify_image_paths(html_content, MAGIC_ASSET_URL_PREFIX / basedir)

    # Remove <p> in <li> where <p> preceeded by <input type="checkbox">
    html_content = fix_p_in_li_with_checkbox(html_content)

    # Add copy buttons to <pre lang="LANG"> elements
    html_content = add_copy_buttons_inside_pre(html_content)

    # Get headers
    headers = extract_headers_on_page_nav(html_content)

    return jsonify({"html": html_content, "headers": headers})


if __name__ == "__main__":
    app.run(debug=True, port=3030)
    # CORS(app.run(debug=True, port=3030),  origins=["http://localhost:3000"])
    # CORS(app.run(debug=True, port=3030))
