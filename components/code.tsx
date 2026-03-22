// Copyright (c) 2026 Windsor Nguyen. MIT License.

import { Pre } from "codehike/code";
import type { HighlightedCode } from "codehike/code";

export default function Code({ codeblock }: { codeblock: HighlightedCode }) {
  return <Pre code={codeblock} style={codeblock.style} />;
}
