import { FileTree } from "../_components/file-tree-navigator";

export const newFileTreeStructure: FileTree = [
  {
    type: "directory",
    name: "dir_three",
    path: "dir_three",
    id: "dir_three",
    subtree: [
      {
        type: "file",
        name: "d.md",
        path: "dir_three/d.md",
        id: "dir_three/d.md",
      },
    ],
  },
  {
    type: "directory",
    name: "dir_one",
    path: "dir_one",
    id: "dir_one",
    subtree: [
      {
        type: "directory",
        name: "dir_two",
        path: "dir_one/dir_two",
        id: "dir_one/dir_two",
        subtree: [
          {
            type: "file",
            name: "sebas.md",
            path: "dir_one/dir_two/sebas.md",
            id: "dir_one/dir_two/sebas.md",
          },
        ],
      },
      {
        type: "file",
        name: "hello.md",
        path: "dir_one/hello.md",
        id: "dir_one/hello.md",
      },
      {
        type: "directory",
        name: "y",
        path: "dir_one/y",
        id: "dir_one/y",
        subtree: [
          {
            type: "file",
            name: "x.md",
            path: "dir_one/y/x.md",
            id: "dir_one/y/x.md",
          },
        ],
      },
    ],
  },
  {
    type: "directory",
    name: "z",
    path: "z",
    id: "z",
    subtree: [{ type: "file", name: "y.md", path: "z/y.md", id: "z/y.md" }],
  },
  { type: "file", name: "one.md", path: "one.md", id: "one.md" },
  { type: "file", name: "two.md", path: "two.md", id: "two.md" },
];

export const TestMarkdownHTML = () => {
  return (
    <div data-name="markdown-document">
      <h1 id="apache-arrow">Apache Arrow</h1>
      <p>
        <a href="https://bugs.chromium.org/p/oss-fuzz/issues/list?sort=-opened&amp;can=1&amp;q=proj:arrow">
          <img
            alt="Fuzzing Status"
            src="https://oss-fuzz-build-logs.storage.googleapis.com/badges/arrow.svg"
          />
        </a>
        <a href="https://github.com/apache/arrow/blob/master/LICENSE.txt">
          <img
            alt="License"
            src="http://img.shields.io/:license-Apache%202-blue.svg"
          />
        </a>
        <a href="https://twitter.com/apachearrow">
          <img
            alt="Twitter Follow"
            src="https://img.shields.io/twitter/follow/apachearrow.svg?style=social&amp;label=Follow"
          />
        </a>
      </p>
      <h2 id="powering-in-memory-analytics">Powering In-Memory Analytics</h2>
      <p>
        Apache Arrow is a development platform for in-memory analytics. It
        contains a set of technologies that enable big data systems to process
        and move data fast.
      </p>
      <p>Major components of the project include:</p>
      <ul>
        <li>
          <a href="https://github.com/apache/arrow/blob/master/docs/source/format/Columnar.rst">
            The Arrow Columnar In-Memory Format
          </a>
          : a standard and efficient in-memory representation of various
          datatypes, plain or nested
        </li>
        <li>
          <a href="https://github.com/apache/arrow/blob/master/docs/source/format/Columnar.rst#serialization-and-interprocess-communication-ipc">
            The Arrow IPC Format
          </a>
          : an efficient serialization of the Arrow format and associated
          metadata, for communication between processes and heterogeneous
          environments
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/format/Flight.proto">
            The Arrow Flight RPC protocol
          </a>
          : based on the Arrow IPC format, a building block for remote services
          exchanging Arrow data with application-defined semantics (for example
          a storage server or a database)
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/cpp">
            C++ libraries
          </a>
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/c_glib">
            C bindings using GLib
          </a>
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/csharp">
            C# .NET libraries
          </a>
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/cpp/src/gandiva">
            Gandiva
          </a>
          : an <a href="https://llvm.org">LLVM</a>-based Arrow expression
          compiler, part of the C++ codebase
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/go">
            Go libraries
          </a>
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/java">
            Java libraries
          </a>
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/js">
            JavaScript libraries
          </a>
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/cpp/src/plasma">
            Plasma Object Store
          </a>
          : a shared-memory blob store, part of the C++ codebase
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/python">
            Python libraries
          </a>
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/r">
            R libraries
          </a>
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/ruby">
            Ruby libraries
          </a>
        </li>
        <li>
          <a href="https://github.com/apache/arrow-rs">Rust libraries</a>
        </li>
      </ul>
      <p>
        Arrow is an
        <a href="https://www.apache.org">Apache Software Foundation</a> project.
        Learn more at <a href="https://arrow.apache.org">arrow.apache.org</a>.
      </p>
      <h2 id="what-s-in-the-arrow-libraries-">
        What’s in the Arrow libraries?
      </h2>
      <p>
        The reference Arrow libraries contain many distinct software components:
      </p>
      <ul>
        <li>
          Columnar vector and table-like containers (similar to data frames)
          supporting flat or nested types
        </li>
        <li>
          Fast, language agnostic metadata messaging layer (using Google’s
          Flatbuffers library)
        </li>
        <li>
          Reference-counted off-heap buffer memory management, for zero-copy
          memory sharing and handling memory-mapped files
        </li>
        <li>IO interfaces to local and remote filesystems</li>
        <li>
          Self-describing binary wire formats (streaming and batch/file-like)
          for remote procedure calls (RPC) and interprocess communication (IPC)
        </li>
        <li>
          Integration tests for verifying binary compatibility between the
          implementations (e.g. sending data from Java to C++)
        </li>
        <li>Conversions to and from other in-memory data structures</li>
        <li>
          Readers and writers for various widely-used file formats (such as
          Parquet, CSV)
        </li>
      </ul>
      <h2 id="implementation-status">Implementation status</h2>
      <p>
        The official Arrow libraries in this repository are in different stages
        of implementing the Arrow format and related features. See our current
        <a href="https://github.com/apache/arrow/blob/master/docs/source/status.rst">
          feature matrix
        </a>
        on git master.
      </p>
      <h2 id="how-to-contribute">How to Contribute</h2>
      <p>
        Please read our latest
        <a href="https://github.com/apache/arrow/blob/master/docs/source/developers/contributing.rst">
          project contribution guide
        </a>
        .
      </p>
      <h2 id="getting-involved">Getting involved</h2>
      <p>
        Even if you do not plan to contribute to Apache Arrow itself or Arrow
        integrations in other projects, we’d be happy to have you involved:
      </p>
      <ul>
        <li>
          Join the mailing list: send an email to
          <a href="mailto:dev-subscribe@arrow.apache.org">
            dev-subscribe@arrow.apache.org
          </a>
          . Share your ideas and use cases for the project.
        </li>
        <li>
          <a href="https://issues.apache.org/jira/browse/ARROW">
            Follow our activity on JIRA
          </a>
        </li>
        <li>
          <a href="https://github.com/apache/arrow/tree/master/format">
            Learn the format
          </a>
        </li>
        <li>Contribute code to one of the reference implementations</li>
      </ul>
    </div>
  );
};
