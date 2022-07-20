import type { AliasOptions } from "vite";
import type { FileImporter } from "sass";
export declare function parse_tsconfig(path?: string): [Record<string, string>, string];
export declare function scss_aliases(aliases: Record<string, string>, directory_root: string): FileImporter<"sync">;
export declare function vite_aliases(aliases: Record<string, string>, directory_root: string): AliasOptions;
//# sourceMappingURL=create_aliases.d.ts.map