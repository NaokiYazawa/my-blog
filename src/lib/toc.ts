import type { Link, List, ListItem, Paragraph, Root, Text } from "mdast";
import { toc } from "mdast-util-toc";
import { remark } from "remark";
import type { Node } from "unist";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

function flattenNode(node: Node): string {
  const p: string[] = [];
  visit(node, (node) => {
    if (node.type === "text") {
      p.push((node as Text).value);
    }
  });
  return p.join("");
}

interface Item {
  title: string;
  url: string;
  items?: Item[];
}

interface Items {
  items?: Item[];
}

function getItems(
  node: List | ListItem | Paragraph | null,
  current: Partial<Item>,
): Items {
  if (!node) {
    return {};
  }

  if (node.type === "paragraph") {
    visit(node, (item) => {
      if (item.type === "link") {
        current.url = (item as Link).url;
        current.title = flattenNode(node);
      }

      if (item.type === "text") {
        current.title = flattenNode(node);
      }
    });

    return current;
  }

  if (node.type === "list") {
    current.items = (node as List).children.map((i: ListItem) =>
      getItems(i, {}),
    ) as Item[];

    return current;
  } else if (node.type === "listItem") {
    const listItem = node as ListItem;
    const heading = getItems(listItem.children[0] as Paragraph, {});

    if (listItem.children.length > 1) {
      getItems(listItem.children[1] as List, heading);
    }

    return heading;
  }

  return {};
}

const getToc = () => (node: Root, file: VFile) => {
  const table = toc(node);
  Object.assign(file.data, getItems(table.map || null, {}));
};

export type TableOfContents = Items;

export async function getTableOfContents(
  content: string,
): Promise<TableOfContents> {
  const result = await remark().use(getToc).process(content);

  return result.data as TableOfContents;
}
