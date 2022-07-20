import { readFileSync as read_file } from "fs";
import { resolve, join } from "path";
const parsed_tsconfigs = new Map();
function remove_trailing(target_string, trailing_string) {
    return target_string.substring(0, target_string.length - trailing_string.length);
}
export function parse_tsconfig(path) {
    path ??= join(process.cwd(), "tsconfig.json");
    const parsed_tsconfig = parsed_tsconfigs.get(path);
    if (parsed_tsconfig !== undefined)
        return parsed_tsconfig;
    const tsconfig = JSON.parse(read_file(path, "utf-8"));
    const directory_root = tsconfig?.compilerOptions?.baseUrl;
    const tsconfig_aliases = tsconfig?.compilerOptions?.paths ?? {};
    const aliases = {};
    const globbing_operator = "/*";
    Object.keys(tsconfig_aliases)
        .filter(alias => alias.endsWith(globbing_operator))
        .forEach(alias => {
        const alias_path = tsconfig_aliases[alias][0];
        const new_alias = remove_trailing(alias, globbing_operator);
        const new_alias_path = remove_trailing(alias_path, globbing_operator);
        aliases[new_alias] = new_alias_path;
    });
    if (tsconfig?.extends !== undefined) {
        const extends_path = join(remove_trailing(path, "tsconfig.json"), tsconfig.extends);
        const [extends_alises, extends_directory_root] = parse_tsconfig(extends_path);
        return [
            { ...aliases, ...extends_alises },
            directory_root ?? extends_directory_root
        ];
    }
    return [aliases, directory_root];
}
export function scss_aliases(aliases, directory_root) {
    directory_root ??= ".";
    function scss_find_file(url) {
        const split_url = url.split("/");
        const base_directory = split_url.shift();
        if (base_directory == undefined)
            return null;
        const alias = aliases[base_directory];
        if (alias === undefined)
            return null;
        const file_path = resolve(directory_root, alias, ...split_url);
        return new URL(file_path);
    }
    return {
        findFileUrl: scss_find_file
    };
}
export function vite_aliases(aliases, directory_root) {
    const result = {};
    directory_root ??= ".";
    for (const alias in aliases) {
        const alias_path = aliases[alias];
        result[alias] = resolve(directory_root, alias_path);
    }
    return result;
}
//# sourceMappingURL=create_aliases.js.map